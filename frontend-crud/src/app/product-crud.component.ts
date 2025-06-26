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
    ToolbarModule
  ],
  templateUrl: './product-crud.component.html'
})
export class ProductCrudComponent implements OnInit {
  products: Product[] = []; // Lista de produtos
  selectedProduct: Product | null = null; // Produto selecionado para edição/exclusão
  productDialog: boolean = false; // Controla a visibilidade do modal de formulário
  deleteProductDialog: boolean = false; // Controla a visibilidade do modal de exclusão
  productForm!: FormGroup; // Formulário reativo

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

  // --- Operações CRUD (simuladas em memória) ---

  // Listar Produtos
  loadProducts() {
    // Simulação de dados: Em um projeto real, você faria uma chamada HTTP para um backend
    this.products = [
      { id: 1, name: 'Smart TV 55"', price: 2500.00, available: true },
      { id: 2, name: 'Fones Bluetooth', price: 350.50, available: false },
      { id: 3, name: 'Teclado Mecânico', price: 500.00, available: true }
    ];
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
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado!', life: 3000 });
        }
      } else {
        // Lógica de Inserção
        productToSave.id = this.generateRandomId(); // Gera um ID temporário
        this.products.push(productToSave);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Criado!', life: 3000 });
      }

      this.products = [...this.products]; // Força o Angular a detectar a mudança para atualizar a tabela
      this.hideDialog(); // Fecha o modal
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios corretamente.', life: 3000 });
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
      this.products = this.products.filter(p => p.id !== this.selectedProduct!.id);
      this.deleteProductDialog = false; // Fecha o modal de confirmação
      this.selectedProduct = null; // Limpa o produto selecionado
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Removido!', life: 3000 });
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