import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  @Input() visible: boolean = false;
  @Input() product: Product | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  onEdit() {
    if (this.product) {
      this.edit.emit(this.product);
    }
  }

  onClose() {
    this.hideDialog();
    this.close.emit();
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
