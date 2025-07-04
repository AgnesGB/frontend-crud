import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() product: Product | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initProductForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.productForm) {
      this.updateForm();
    }
    if (changes['visible'] && changes['visible'].currentValue) {
      this.updateForm();
    }
  }

  initProductForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      available: [false]
    });
  }

  updateForm() {
    if (this.product) {
      this.isEditMode = true;
      this.productForm.patchValue(this.product);
    } else {
      this.isEditMode = false;
      this.productForm.reset();
      this.productForm.patchValue({
        id: null,
        name: '',
        price: null,
        available: false
      });
    }
  }

  onSave() {
    if (this.productForm.valid) {
      const productToSave: Product = this.productForm.value;
      this.save.emit(productToSave);
    }
  }

  onCancel() {
    this.hideDialog();
    this.cancel.emit();
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Editar Produto' : 'Novo Produto';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
