export interface Product {
  id: number;          // Para identificar o produto (usado na edição/remoção)
  name: string;        // Atributo string
  price: number;       // Atributo número (preço)
  available: boolean;  // Atributo booleano (disponível ou não)
}