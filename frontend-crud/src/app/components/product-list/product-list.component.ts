import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  
  @Output() newProduct = new EventEmitter<void>();
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();
  @Output() viewProduct = new EventEmitter<Product>();

  onNewProduct() {
    this.newProduct.emit();
  }

  onEditProduct(product: Product) {
    this.editProduct.emit(product);
  }

  onDeleteProduct(product: Product) {
    this.deleteProduct.emit(product);
  }

  onViewProduct(product: Product) {
    this.viewProduct.emit(product);
  }
}
