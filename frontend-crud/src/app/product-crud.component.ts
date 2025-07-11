import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// Modelo de Produto
import { Product, CreateProductRequest, UpdateProductRequest } from './models/product.model';

// Serviço
import { ProductService } from './services/product.service';

// Componentes
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductDeleteComponent } from './components/product-delete/product-delete.component';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-crud',
  standalone: true,
  imports: [
    CommonModule,
    // Componentes
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent,
    ProductDeleteComponent,
    // PrimeNG
    ToastModule
  ],
  templateUrl: './product-crud.component.html'
})
export class ProductCrudComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  
  // Controle de visibilidade dos diálogos
  formDialogVisible: boolean = false;
  detailDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;

  // Loading states
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.subscribeToProductsChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: error || 'Erro ao carregar produtos',
            life: 5000 
          });
          this.isLoading = false;
        }
      });
  }

  subscribeToProductsChanges() {
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });
  }

  // Eventos do ProductListComponent
  onNewProduct() {
    this.selectedProduct = null;
    this.formDialogVisible = true;
  }

  onEditProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.formDialogVisible = true;
  }

  onViewProduct(product: Product) {
    this.selectedProduct = product;
    this.detailDialogVisible = true;
  }

  onDeleteProduct(product: Product) {
    this.selectedProduct = product;
    this.deleteDialogVisible = true;
  }

  // Eventos do ProductFormComponent
  onSaveProduct(data: CreateProductRequest | { id: number, data: UpdateProductRequest }) {
    this.isSubmitting = true;

    if ('id' in data) {
      // Modo edição
      this.productService.updateProduct(data.id, data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedProduct) => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: 'Produto atualizado com sucesso!', 
              life: 3000 
            });
            this.formDialogVisible = false;
            this.isSubmitting = false;
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: error || 'Erro ao atualizar produto',
              life: 5000 
            });
            this.isSubmitting = false;
          }
        });
    } else {
      // Modo criação
      this.productService.addProduct(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newProduct) => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: 'Produto criado com sucesso!', 
              life: 3000 
            });
            this.formDialogVisible = false;
            this.isSubmitting = false;
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: error || 'Erro ao criar produto',
              life: 5000 
            });
            this.isSubmitting = false;
          }
        });
    }
  }

  onCancelForm() {
    this.formDialogVisible = false;
  }

  // Eventos do ProductDetailComponent
  onEditFromDetail(product: Product) {
    this.detailDialogVisible = false;
    this.selectedProduct = { ...product };
    this.formDialogVisible = true;
  }

  onCloseDetail() {
    this.detailDialogVisible = false;
  }

  // Eventos do ProductDeleteComponent
  onConfirmDelete() {
    if (this.selectedProduct?.id) {
      this.isSubmitting = true;
      this.productService.deleteProduct(this.selectedProduct.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: 'Produto excluído com sucesso!', 
              life: 3000 
            });
            this.deleteDialogVisible = false;
            this.isSubmitting = false;
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: error || 'Erro ao excluir produto',
              life: 5000 
            });
            this.isSubmitting = false;
          }
        });
    }
  }

  onCancelDelete() {
    this.deleteDialogVisible = false;
  }

  // Método para recarregar produtos manualmente
  refreshProducts() {
    this.productService.loadProducts();
  }
}