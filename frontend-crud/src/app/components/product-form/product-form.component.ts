import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  standalone: true,
  imports: [
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
  isSubmitting: boolean = false;

  // Custom Validators
  static productNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const value = control.value.trim();
    
    // Verificar se contém apenas espaços
    if (value.length === 0) {
      return { whitespace: true };
    }
    
    // Verificar caracteres especiais proibidos
    const invalidChars = /[<>{}[\]\\\/|`~!@#$%^&*()+=?;:'"]/;
    if (invalidChars.test(value)) {
      return { invalidCharacters: true };
    }
    
    // Verificar se tem pelo menos 2 caracteres após trim
    if (value.length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.length } };
    }
    
    // Verificar tamanho máximo
    if (value.length > 100) {
      return { maxLength: { requiredLength: 100, actualLength: value.length } };
    }
    
    return null;
  }
  
  static priceValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const value = Number(control.value);
    
    // Verificar se é um número válido
    if (isNaN(value)) {
      return { invalidNumber: true };
    }
    
    // Verificar valor mínimo
    if (value <= 0) {
      return { min: { min: 0.01, actual: value } };
    }
    
    // Verificar valor máximo (1 milhão)
    if (value > 1000000) {
      return { max: { max: 1000000, actual: value } };
    }
    
    // Verificar número de casas decimais (máximo 2)
    const decimalStr = value.toString();
    if (decimalStr.includes('.')) {
      const decimals = decimalStr.split('.')[1];
      if (decimals.length > 2) {
        return { tooManyDecimals: { maxDecimals: 2, actualDecimals: decimals.length } };
      }
    }
    
    return null;
  }

  get isEditing(): boolean {
    return this.isEditMode;
  }

  get formControls() {
    return this.productForm.controls;
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
      this.resetFormState();
    }
  }

  initProductForm() {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        ProductFormComponent.productNameValidator
      ]],
      price: [null, [
        Validators.required,
        ProductFormComponent.priceValidator
      ]],
      available: [true, [Validators.required]]
    });
    
    // Adicionar listeners para mudanças nos campos
    this.setupFormValueChanges();
  }

  setupFormValueChanges() {
    // Listener para o campo nome - aplicar trim automático
    this.productForm.get('name')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const trimmedValue = value.trim();
        if (value !== trimmedValue && trimmedValue.length > 0) {
          this.productForm.get('name')?.setValue(trimmedValue, { emitEvent: false });
        }
      }
    });
    
    // Listener para validação em tempo real do preço
    this.productForm.get('price')?.valueChanges.subscribe(value => {
      if (value && value < 0) {
        this.productForm.get('price')?.setValue(Math.abs(value), { emitEvent: false });
      }
    });
  }

  resetFormState() {
    this.isSubmitting = false;
    this.productForm.markAsUntouched();
    this.productForm.markAsPristine();
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
    this.resetFormState();
  }

  onSave() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Marcar todos os campos como tocados para mostrar erros de validação
      this.markAllFieldsAsTouched();
      
      const formData = this.productForm.value;
      
      // Limpar e validar dados antes de enviar
      const cleanedData = {
        name: formData.name.trim(),
        price: Number(formData.price),
        available: Boolean(formData.available)
      };
      
      if (this.isEditMode && this.product?.id) {
        // Modo edição - envia dados para atualização
        const updateData: UpdateProductRequest = cleanedData;
        this.save.emit({ id: this.product.id, data: updateData });
      } else {
        // Modo criação - envia dados para criação
        const createData: CreateProductRequest = cleanedData;
        this.save.emit(createData);
      }
    } else {
      // Se o formulário é inválido, marcar todos os campos como tocados
      this.markAllFieldsAsTouched();
    }
  }

  onCancel() {
    this.hideDialog();
    this.cancel.emit();
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetFormState();
  }

  markAllFieldsAsTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Editar Produto' : 'Novo Produto';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      
      // Erros para o campo nome
      if (fieldName === 'name') {
        if (field.errors['required']) {
          return 'Nome do produto é obrigatório';
        }
        if (field.errors['whitespace']) {
          return 'Nome não pode conter apenas espaços';
        }
        if (field.errors['invalidCharacters']) {
          return 'Nome contém caracteres inválidos';
        }
        if (field.errors['minLength']) {
          return `Nome deve ter pelo menos ${field.errors['minLength'].requiredLength} caracteres`;
        }
        if (field.errors['maxLength']) {
          return `Nome deve ter no máximo ${field.errors['maxLength'].requiredLength} caracteres`;
        }
      }
      
      // Erros para o campo preço
      if (fieldName === 'price') {
        if (field.errors['required']) {
          return 'Preço é obrigatório';
        }
        if (field.errors['invalidNumber']) {
          return 'Preço deve ser um número válido';
        }
        if (field.errors['min']) {
          return `Preço deve ser maior que R$ ${field.errors['min'].min}`;
        }
        if (field.errors['max']) {
          return `Preço deve ser menor que R$ ${field.errors['max'].max.toLocaleString('pt-BR')}`;
        }
        if (field.errors['tooManyDecimals']) {
          return `Preço deve ter no máximo ${field.errors['tooManyDecimals'].maxDecimals} casas decimais`;
        }
      }
      
      // Erro genérico
      return 'Campo inválido';
    }
    return '';
  }

  // Métodos auxiliares para o template
  getFormValue(fieldName: string): any {
    return this.productForm.get(fieldName)?.value;
  }

  isFormDirty(): boolean {
    return this.productForm.dirty;
  }

  isFormValid(): boolean {
    return this.productForm.valid;
  }

  hasFieldErrors(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.errors);
  }

  // Método para resetar um campo específico
  resetField(fieldName: string) {
    const field = this.productForm.get(fieldName);
    if (field) {
      field.reset();
      field.markAsUntouched();
      field.markAsPristine();
    }
  }

  // Método para obter o estado do formulário
  getFormStatus(): { valid: boolean; dirty: boolean; touched: boolean; pending: boolean } {
    return {
      valid: this.productForm.valid,
      dirty: this.productForm.dirty,
      touched: this.productForm.touched,
      pending: this.productForm.pending
    };
  }

  // Métodos auxiliares para o template
  getFieldCssClass(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || (!field.dirty && !field.touched)) {
      return '';
    }
    
    if (field.valid) {
      return 'ng-valid p-inputtext-success';
    } else {
      return 'ng-invalid p-inputtext-error';
    }
  }

  getProductStatus(): string {
    if (!this.isFormValid()) {
      return 'Incompleto';
    }
    if (this.formControls['available'].value) {
      return 'Disponível';
    }
    return 'Indisponível';
  }

  getSaveButtonLabel(): string {
    if (this.isSubmitting) {
      return this.isEditMode ? 'Atualizando...' : 'Salvando...';
    }
    return this.isEditMode ? 'Atualizar Produto' : 'Salvar Produto';
  }

  getSaveButtonIcon(): string {
    if (this.isSubmitting) {
      return 'pi pi-spinner pi-spin';
    }
    return this.isEditMode ? 'pi pi-check' : 'pi pi-plus';
  }

  getValidationSummary(): string {
    const errors = [];
    
    if (this.formControls['name'].invalid) {
      errors.push('nome');
    }
    if (this.formControls['price'].invalid) {
      errors.push('preço');
    }
    
    if (errors.length === 0) {
      return 'Formulário válido';
    }
    if (errors.length === 1) {
      return `Corrigir ${errors[0]}`;
    }
    return `Corrigir ${errors.slice(0, -1).join(', ')} e ${errors[errors.length - 1]}`;
  }

  resetForm(): void {
    this.productForm.reset();
    this.productForm.patchValue({
      name: '',
      price: null,
      available: true
    });
    this.resetFormState();
  }

  // Método para resetar estado de submissão (pode ser chamado externamente)
  public resetSubmittingState(): void {
    this.isSubmitting = false;
  }
}
