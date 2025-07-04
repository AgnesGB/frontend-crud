# Frontend CRUD - Refatoração em Componentes

Este projeto foi refatorado para separar as operações de CRUD em componentes independentes, seguindo as melhores práticas do Angular.

## Estrutura dos Componentes

### 📁 Antes da Refatoração
Todo o código estava em um único componente `ProductCrudComponent` com:
- Listagem, criação, edição, visualização e exclusão tudo em um arquivo
- Template HTML extenso e confuso
- Lógica de negócio misturada com apresentação

### 📁 Depois da Refatoração

```
src/app/
├── components/
│   ├── product-list/          # Listagem de produtos
│   │   ├── product-list.component.ts
│   │   ├── product-list.component.html
│   │   └── product-list.component.scss
│   ├── product-form/          # Formulário (criar/editar)
│   │   ├── product-form.component.ts
│   │   ├── product-form.component.html
│   │   └── product-form.component.scss
│   ├── product-detail/        # Visualização de detalhes
│   │   ├── product-detail.component.ts
│   │   ├── product-detail.component.html
│   │   └── product-detail.component.scss
│   ├── product-delete/        # Confirmação de exclusão
│   │   ├── product-delete.component.ts
│   │   ├── product-delete.component.html
│   │   └── product-delete.component.scss
│   └── index.ts              # Barrel file para importações
├── services/
│   └── product.service.ts     # Serviço centralizado
├── models/
│   └── product.model.ts       # Modelo de dados
└── product-crud.component.ts  # Componente orquestrador
```

## Componentes Criados

### 1. **ProductListComponent** 📋
**Responsabilidade:** Exibir tabela de produtos com ações
- **Input:** `products: Product[]`
- **Outputs:** 
  - `newProduct: EventEmitter<void>`
  - `editProduct: EventEmitter<Product>`
  - `deleteProduct: EventEmitter<Product>`
  - `viewProduct: EventEmitter<Product>`

### 2. **ProductFormComponent** ✏️
**Responsabilidade:** Formulário para criar/editar produtos
- **Inputs:** 
  - `visible: boolean`
  - `product: Product | null`
- **Outputs:**
  - `visibleChange: EventEmitter<boolean>`
  - `save: EventEmitter<Product>`
  - `cancel: EventEmitter<void>`

### 3. **ProductDetailComponent** 👁️
**Responsabilidade:** Modal para visualizar detalhes do produto
- **Inputs:**
  - `visible: boolean`
  - `product: Product | null`
- **Outputs:**
  - `visibleChange: EventEmitter<boolean>`
  - `edit: EventEmitter<Product>`
  - `close: EventEmitter<void>`

### 4. **ProductDeleteComponent** 🗑️
**Responsabilidade:** Modal de confirmação de exclusão
- **Inputs:**
  - `visible: boolean`
  - `product: Product | null`
- **Outputs:**
  - `visibleChange: EventEmitter<boolean>`
  - `confirm: EventEmitter<void>`
  - `cancel: EventEmitter<void>`

### 5. **ProductService** 🔧
**Responsabilidade:** Centralizar lógica de negócios
- Gerencia estado dos produtos com BehaviorSubject
- Operações CRUD: `getProducts()`, `addProduct()`, `updateProduct()`, `deleteProduct()`
- Simula persistência em memória

## Benefícios da Refatoração

### ✅ **Separação de Responsabilidades**
- Cada componente tem uma responsabilidade específica
- Código mais organizados e fácil de manter

### ✅ **Reutilização**
- Componentes podem ser reutilizados em outras partes da aplicação
- Formulário pode ser usado tanto para criação quanto edição

### ✅ **Testabilidade**
- Cada componente pode ser testado isoladamente
- Mocks mais simples e específicos

### ✅ **Manutenibilidade**
- Mudanças em uma funcionalidade não afetam outras
- Código mais legível e organizados

### ✅ **Escalabilidade**
- Fácil adicionar novas funcionalidades
- Arquitetura preparada para crescimento

## Como Usar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar aplicação:**
   ```bash
   npx ng serve
   ``` 

3. **Acessar:** http://localhost:4200

## Fluxo de Dados

```
ProductCrudComponent (Orquestrador)
       ↓ [products]
ProductListComponent
       ↓ (events)
ProductCrudComponent
       ↓ (chama serviço)
ProductService
       ↓ (atualiza observable)
ProductCrudComponent
       ↓ [products atualizados]
ProductListComponent
```

## Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **PrimeNG** - Biblioteca de componentes UI
- **RxJS** - Programação reativa
- **TypeScript** - Linguagem tipada
- **SCSS** - Estilos

## Próximos Passos

- [ ] Implementar testes unitários para cada componente
- [ ] Adicionar validações mais robustas
- [ ] Integrar com API real
- [ ] Implementar lazy loading
- [ ] Adicionar internacionalização (i18n)
