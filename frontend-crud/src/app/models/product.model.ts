export interface Product {
  id?: number;          // Opcional para criação, obrigatório para edição
  name: string;         // Nome do produto
  price: number;        // Preço do produto
  available: boolean;   // Se está disponível
  created_at?: string;  // Data de criação (somente leitura)
  updated_at?: string;  // Data de atualização (somente leitura)
}

export interface CreateProductRequest {
  name: string;
  price: number;
  available: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  available?: boolean;
}