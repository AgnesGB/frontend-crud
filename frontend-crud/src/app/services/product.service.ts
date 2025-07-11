import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:8000/api/products';
  
  // Cache local dos produtos para otimizar performance
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Carrega os produtos automaticamente ao instanciar o service
    this.loadProducts();
  }

  /**
   * Lista todos os produtos do backend
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/`).pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(this.handleError)
    );
  }

  /**
   * Busca um produto específico por ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cria um novo produto
   */
  addProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl + '/', productData).pipe(
      tap(newProduct => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza um produto existente (PUT - atualização completa)
   */
  updateProduct(id: number, productData: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}/`, productData).pipe(
      tap(updatedProduct => {
        const currentProducts = this.productsSubject.value;
        const index = currentProducts.findIndex(p => p.id === id);
        if (index > -1) {
          currentProducts[index] = updatedProduct;
          this.productsSubject.next([...currentProducts]);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza parcialmente um produto (PATCH)
   */
  patchProduct(id: number, productData: Partial<UpdateProductRequest>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}/`, productData).pipe(
      tap(updatedProduct => {
        const currentProducts = this.productsSubject.value;
        const index = currentProducts.findIndex(p => p.id === id);
        if (index > -1) {
          currentProducts[index] = updatedProduct;
          this.productsSubject.next([...currentProducts]);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Remove um produto
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(
      tap(() => {
        const currentProducts = this.productsSubject.value;
        const filteredProducts = currentProducts.filter(p => p.id !== id);
        this.productsSubject.next(filteredProducts);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Lista apenas produtos disponíveis
   */
  getAvailableProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/available/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Recarrega a lista de produtos do backend
   */
  loadProducts(): void {
    this.getProducts().subscribe({
      next: () => {
        console.log('Produtos carregados com sucesso');
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  /**
   * Obtém o produto do cache local por ID
   */
  getProductFromCache(id: number): Product | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  /**
   * Manipula erros HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          break;
        case 404:
          errorMessage = 'Produto não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 0:
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          break;
        default:
          errorMessage = `Erro: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('ProductService Error:', error);
    return throwError(() => errorMessage);
  }
}
