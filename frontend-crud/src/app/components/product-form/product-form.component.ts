import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../models/product.model';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-product-form',
  standalone: true,  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() product: Product | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateProductRequest | { id: number, data: UpdateProductRequest }>();
  @Output() cancel = new EventEmitter<void>();
  productForm!: FormGroup;
  isEditMode: boolean = false;

  get isEditing(): boolean {
    return this.isEditMode;
  }

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
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      available: [true]
    });
  }

  updateForm() {
    if (this.product && this.product.id) {
      this.isEditMode = true;
      this.productForm.patchValue({
        name: this.product.name,
        price: this.product.price,
        available: this.product.available
      });
    } else {
      this.isEditMode = false;
      this.productForm.reset();
      this.productForm.patchValue({
        name: '',
        price: null,
        available: true
      });
    }
  }

  onSave() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      
      if (this.isEditMode && this.product?.id) {
        // Modo edição - envia dados para atualização
        const updateData: UpdateProductRequest = {
          name: formData.name,
          price: formData.price,
          available: formData.available
        };
        this.save.emit({ id: this.product.id, data: updateData });
      } else {
        // Modo criação - envia dados para criação
        const createData: CreateProductRequest = {
          name: formData.name,
          price: formData.price,
          available: formData.available
        };
        this.save.emit(createData);
      }
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

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${fieldName === 'name' ? 'Nome' : fieldName === 'price' ? 'Preço' : 'Campo'} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${fieldName === 'name' ? 'Nome' : 'Campo'} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${fieldName === 'price' ? 'Preço' : 'Campo'} deve ser maior que ${field.errors['min'].min}`;
      }
    }
    return '';
  }
}
