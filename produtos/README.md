# Backend Django REST - API de Produtos

## 🚀 Configuração e Execução

### Pré-requisitos
- Python 3.8+
- pip

### Instalação
```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Executar migrações
cd produtos
python manage.py migrate

# 3. Criar superuser (opcional - para acessar admin)
python manage.py createsuperuser

# 4. Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

## 📡 Endpoints da API

### Base URL: `http://localhost:8000/api/`

### 1. Listar todos os produtos
- **GET** `/api/products/`
- **Resposta**: Array de produtos

```json
[
  {
    "id": 1,
    "name": "Smartphone Samsung Galaxy",
    "price": "899.99",
    "available": true,
    "created_at": "2025-07-11T04:05:04.503110Z",
    "updated_at": "2025-07-11T04:05:04.503145Z"
  }
]
```

### 2. Buscar produto por ID
- **GET** `/api/products/{id}/`
- **Resposta**: Objeto do produto

### 3. Criar novo produto
- **POST** `/api/products/`
- **Body**:
```json
{
  "name": "Nome do Produto",
  "price": 99.99,
  "available": true
}
```

### 4. Atualizar produto
- **PUT** `/api/products/{id}/`
- **Body**: Mesmo formato do POST

### 5. Atualizar parcialmente
- **PATCH** `/api/products/{id}/`
- **Body**: Campos a serem atualizados

### 6. Deletar produto
- **DELETE** `/api/products/{id}/`
- **Resposta**: Status 204 (No Content)

### 7. Listar apenas produtos disponíveis
- **GET** `/api/products/available/`

## 🎯 Modelo de Dados

### Product
```python
{
  "id": int,           # ID único (auto-gerado)
  "name": string,      # Nome do produto
  "price": decimal,    # Preço (até 10 dígitos, 2 decimais)
  "available": boolean, # Disponibilidade
  "created_at": datetime, # Data de criação
  "updated_at": datetime  # Data de atualização
}
```

## 🔧 Configurações CORS

O backend está configurado para aceitar requisições do frontend Angular:
- Localhost:4200 (padrão do Angular)
- Todos os métodos HTTP (GET, POST, PUT, PATCH, DELETE)

## 🛠 Admin Django

Acesse `http://localhost:8000/admin/` para gerenciar produtos via interface web.

**Credenciais padrão:**
- Usuário: admin
- Senha: admin123

## 🧪 Testes da API

### Usando curl:

```bash
# Listar produtos
curl -X GET http://localhost:8000/api/products/

# Criar produto
curl -X POST http://localhost:8000/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Produto Teste", "price": 99.99, "available": true}'

# Atualizar produto
curl -X PUT http://localhost:8000/api/products/1/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Produto Atualizado", "price": 149.99, "available": false}'

# Deletar produto
curl -X DELETE http://localhost:8000/api/products/1/
```

## 🔗 Integração com Frontend Angular

No seu serviço Angular, use:

```typescript
// Base URL da API
private apiUrl = 'http://localhost:8000/api/products';

// Exemplo de serviço
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.apiUrl);
}

createProduct(product: Product): Observable<Product> {
  return this.http.post<Product>(this.apiUrl, product);
}

updateProduct(id: number, product: Product): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/${id}/`, product);
}

deleteProduct(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}/`);
}
```

## 📂 Estrutura do Projeto

```
produtos/
├── manage.py
├── produtos/
│   ├── settings.py      # Configurações do Django
│   ├── urls.py          # URLs principais
│   └── ...
├── backend/
│   ├── models.py        # Modelo Product
│   ├── serializers.py   # Serializers DRF
│   ├── views.py         # ViewSets da API
│   ├── urls.py          # URLs do app
│   ├── admin.py         # Configuração do admin
│   └── migrations/      # Migrações do banco
└── db.sqlite3           # Banco de dados SQLite
```

## ✅ Status

✅ Backend Django REST configurado
✅ Modelo Product criado
✅ API CRUD completa
✅ CORS configurado para Angular
✅ Admin Django configurado
✅ Dados de exemplo criados
✅ Servidor rodando na porta 8000
