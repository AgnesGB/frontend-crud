import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Modelo de Produto
import { Product } from './models/product.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-crud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // PrimeNG
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    ToolbarModule
  ],
  templateUrl: './product-crud.component.html'
})
export class ProductCrudComponent implements OnInit {
  products: Product[] = []; 
  selectedProduct: Product | null = null; 
  productDialog: boolean = false; 
  deleteProductDialog: boolean = false; 
  productForm!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService 
  ) {}

  ngOnInit() {
    this.loadProducts(); 
    this.initProductForm(); 
  }

  initProductForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]], 
      available: [false]
    });
  }

  // --- Operações CRUD (simuladas em memória) ---

  loadProducts() {
    this.products = [
      { id: 1, name: 'Smart TV 55"', price: 2500.00, available: true },
      { id: 2, name: 'Fones Bluetooth', price: 350.50, available: false },
      { id: 3, name: 'Teclado Mecânico', price: 500.00, available: true }
    ];
  }

  openNewProductDialog() {
    this.selectedProduct = null;
    this.initProductForm(); 
    this.productDialog = true; 
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product }; 
    this.productForm.patchValue(this.selectedProduct); 
    this.productDialog = true; 
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productToSave: Product = this.productForm.value;

      if (productToSave.id) {
        const index = this.products.findIndex(p => p.id === productToSave.id);
        if (index > -1) {
          this.products[index] = productToSave;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado!', life: 3000 });
        }
      } else {
        productToSave.id = this.generateRandomId();
        this.products.push(productToSave);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Criado!', life: 3000 });
      }

      this.products = [...this.products];
      this.hideDialog();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios corretamente.', life: 3000 });
    }
  }

  confirmDeleteProduct(product: Product) {
    this.selectedProduct = product;
    this.deleteProductDialog = true;
  }

  deleteProduct() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.products = this.products.filter(p => p.id !== this.selectedProduct!.id);
      this.deleteProductDialog = false;
      this.selectedProduct = null;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Removido!', life: 3000 });
      this.products = [...this.products];
    }
  }

  hideDialog() {
    this.productDialog = false;
    this.initProductForm();
  }

  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}