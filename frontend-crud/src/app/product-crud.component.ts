// src/app/product-crud.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf, ngFor etc.
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para formulários

// Modelo de Produto
import { Product } from './models/product.model';

// Módulos PrimeNG que este componente usará
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar'; // Para a barra de ferramentas
import { TooltipModule } from 'primeng/tooltip'; // Para tooltips nos botões

// Serviço de mensagens (injeta o MessageService)
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-crud',
  standalone: true, // Componente standalone
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
    ToolbarModule,
    TooltipModule
  ],
  templateUrl: './product-crud.component.html',
  styleUrl: './product-crud.component.scss'
})
export class ProductCrudComponent implements OnInit {
  products: Product[] = []; // Lista de produtos
  selectedProduct: Product | null = null; // Produto selecionado para edição/exclusão
  productDialog: boolean = false; // Controla a visibilidade do modal de formulário
  deleteProductDialog: boolean = false; // Controla a visibilidade do modal de exclusão
  productForm!: FormGroup; // Formulário reativo
  loading: boolean = false; // Estado de carregamento

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService // Injeta o serviço de mensagens
  ) {}

  ngOnInit() {
    this.loadProducts(); // Carrega os produtos ao iniciar
    this.initProductForm(); // Inicializa o formulário
  }

  // Inicializa o formulário com os validadores
  initProductForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required], // Campo string obrigatório
      price: [null, [Validators.required, Validators.min(0)]], // Campo número obrigatório e >= 0
      available: [false] // Campo booleano (padrão false)
    });
  }

  // Método para aplicar filtro global na tabela
  applyGlobalFilter(filterValue: string) {
    // Implementação do filtro será feita pelo PrimeNG automaticamente
    // através do globalFilterFields definido no template
  }

  // Listar Produtos
  loadProducts() {
    this.loading = true;
    
    // Simulação de carregamento assíncrono
    setTimeout(() => {
      // Simulação de dados: Em um projeto real, você faria uma chamada HTTP para um backend
      this.products = [
        { id: 1, name: 'Smart TV 55" 4K Ultra HD', price: 2899.99, available: true },
        { id: 2, name: 'Fones de Ouvido Bluetooth Premium', price: 459.90, available: true },
        { id: 3, name: 'Teclado Mecânico RGB Gamer', price: 599.99, available: false },
        { id: 4, name: 'Mouse Wireless Ergonômico', price: 189.90, available: true },
        { id: 5, name: 'Notebook Dell Inspiron 15"', price: 3299.00, available: true },
        { id: 6, name: 'Smartphone Samsung Galaxy S23', price: 2199.99, available: false },
        { id: 7, name: 'Tablet iPad Air 10.9"', price: 4199.90, available: true },
        { id: 8, name: 'Webcam HD 1080p Logitech', price: 299.99, available: true },
        { id: 9, name: 'Monitor Ultrawide 29" LG', price: 1899.90, available: false },
        { id: 10, name: 'Impressora Multifuncional HP', price: 699.90, available: true }
      ];
      this.loading = false;
    }, 1000); // Simula 1 segundo de carregamento
  }

  // Abrir Diálogo para Novo Produto
  openNewProductDialog() {
    this.selectedProduct = null;
    this.initProductForm(); // Limpa o formulário
    this.productDialog = true; // Abre o modal
  }

  // Abrir Diálogo para Editar Produto
  editProduct(product: Product) {
    this.selectedProduct = { ...product }; // Cria uma cópia para evitar modificar o objeto original
    this.productForm.patchValue(this.selectedProduct); // Preenche o formulário
    this.productDialog = true; // Abre o modal
  }

  // Salvar Produto (Inserir ou Atualizar)
  saveProduct() {
    if (this.productForm.valid) {
      const productToSave: Product = this.productForm.value;

      if (productToSave.id) {
        // Lógica de Atualização
        const index = this.products.findIndex(p => p.id === productToSave.id);
        if (index > -1) {
          this.products[index] = productToSave;
          this.messageService.add({ 
            severity: 'success', 
            summary: '✅ Produto Atualizado!', 
            detail: `${productToSave.name} foi atualizado com sucesso.`, 
            life: 4000 
          });
        }
      } else {
        // Lógica de Inserção
        productToSave.id = this.generateRandomId(); // Gera um ID temporário
        this.products.push(productToSave);
        this.messageService.add({ 
          severity: 'success', 
          summary: '🎉 Novo Produto Criado!', 
          detail: `${productToSave.name} foi adicionado ao catálogo.`, 
          life: 4000 
        });
      }

      this.products = [...this.products]; // Força o Angular a detectar a mudança para atualizar a tabela
      this.hideDialog(); // Fecha o modal
    } else {
      this.messageService.add({ 
        severity: 'error', 
        summary: '❌ Erro de Validação', 
        detail: 'Por favor, preencha todos os campos obrigatórios corretamente.', 
        life: 5000 
      });
    }
  }

  // Abrir Diálogo de Confirmação para Excluir
  confirmDeleteProduct(product: Product) {
    this.selectedProduct = product;
    this.deleteProductDialog = true;
  }

  // Excluir Produto
  deleteProduct() {
    if (this.selectedProduct && this.selectedProduct.id) {
      const productName = this.selectedProduct.name;
      this.products = this.products.filter(p => p.id !== this.selectedProduct!.id);
      this.deleteProductDialog = false; // Fecha o modal de confirmação
      this.selectedProduct = null; // Limpa o produto selecionado
      this.messageService.add({ 
        severity: 'success', 
        summary: '🗑️ Produto Removido!', 
        detail: `${productName} foi excluído do catálogo.`, 
        life: 4000 
      });
      this.products = [...this.products]; // Força a atualização da tabela
    }
  }

  // Esconder o Diálogo (modal)
  hideDialog() {
    this.productDialog = false;
    this.initProductForm(); // Limpa o formulário ao fechar
  }

  // Função para gerar um ID temporário (substituído por um backend em um cenário real)
  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}