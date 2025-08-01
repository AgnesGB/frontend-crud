import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Product, CreateProductRequest, UpdateProductRequest } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    CardModule
  ],
  providers: [MessageService],
  templateUrl: './product-form-page.component.html',
  styleUrls: ['./product-form-page.component.scss']
})
export class ProductFormPageComponent implements OnInit, OnDestroy {
  isEditMode = false;
  productId: number | null = null;
  currentProduct: Product | null = null;
  pageTitle = 'Novo Produto';
  
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
        this.isEditMode = true;
        this.productId = +id;
        this.pageTitle = 'Editar Produto';
        this.loadProduct(this.productId);
      } else {
        this.isEditMode = false;
        this.productId = null;
        this.currentProduct = null;
        this.pageTitle = 'Novo Produto';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(id: number): void {
    // Primeiro tenta buscar do cache
    const cachedProduct = this.productService.getProductFromCache(id);
    if (cachedProduct) {
      this.currentProduct = cachedProduct;
      return;
    }

    // Se não encontrar no cache, busca do backend
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.currentProduct = product;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Produto não encontrado'
        });
        this.router.navigate(['/products']);
      }
    });
  }

  onSave(data: CreateProductRequest | { id: number, data: UpdateProductRequest }): void {
    if (this.isEditMode && this.productId) {
      // Verifica se é o formato correto para atualização
      let updateData: UpdateProductRequest;
      if ('id' in data && 'data' in data) {
        updateData = data.data;
      } else {
        updateData = data as UpdateProductRequest;
      }
      
      this.productService.updateProduct(this.productId, updateData).subscribe({
        next: (product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto atualizado com sucesso!'
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
    } else {
      // Criação - extrai os dados se vierem no formato de objeto com data
      let createData: CreateProductRequest;
      if ('id' in data && 'data' in data) {
        createData = data.data as CreateProductRequest;
      } else {
        createData = data as CreateProductRequest;
      }
      
      this.productService.addProduct(createData).subscribe({
        next: (product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto criado com sucesso!'
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

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  goBackToList(): void {
    this.router.navigate(['/products/list']);
  }

  goBackToCrud(): void {
    this.router.navigate(['/products']);
  }
}
