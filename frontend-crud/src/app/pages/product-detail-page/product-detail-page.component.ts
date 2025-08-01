import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    CardModule
  ],
  providers: [MessageService],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss']
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  productId: number | null = null;
  currentProduct: Product | null = null;
  loading = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      if (id) {
        this.productId = +id;
        this.loadProduct(this.productId);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(id: number): void {
    this.loading = true;
    
    // Primeiro tenta buscar do cache
    const cachedProduct = this.productService.getProductFromCache(id);
    if (cachedProduct) {
      this.currentProduct = cachedProduct;
      this.loading = false;
      return;
    }

    // Se não encontrar no cache, busca do backend
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.currentProduct = product;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Produto não encontrado'
        });
        this.router.navigate(['/products']);
      }
    });
  }

  onEdit(): void {
    if (this.currentProduct) {
      this.router.navigate(['/products/edit', this.currentProduct.id]);
    }
  }

  onDelete(): void {
    if (this.currentProduct && this.currentProduct.id && confirm(`Tem certeza que deseja excluir o produto "${this.currentProduct.name}"?`)) {
      this.productService.deleteProduct(this.currentProduct.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto excluído com sucesso!'
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error
          });
        }
      });
    }
  }

  goBackToList(): void {
    this.router.navigate(['/products/list']);
  }

  goBackToCrud(): void {
    this.router.navigate(['/products']);
  }
}
