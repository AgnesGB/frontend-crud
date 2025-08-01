import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    ProgressSpinnerModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Input() loading: boolean = false;
  
  @Output() newProduct = new EventEmitter<void>();
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();
  @Output() viewProduct = new EventEmitter<Product>();

  @ViewChild('dt') dt!: Table;

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dt.filterGlobal(target.value, 'contains');
  }

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
