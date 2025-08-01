import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
  expires_in?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api'; // Ajuste conforme sua API Django
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verifica se o token ainda é válido na inicialização
    this.checkTokenValidity();
  }

  /**
   * Realiza o login do usuário
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  /**
   * Realiza o logout do usuário
   */
  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    return this.http.post(`${this.API_URL}/auth/logout/`, {}, { headers })
      .pipe(
        tap(() => {
          this.clearSession();
        })
      );
  }

  /**
   * Registra um novo usuário
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register/`, userData);
  }

  /**
   * Atualiza o token usando o refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return new Observable(observer => observer.error('No refresh token'));
    }

    return this.http.post<{ access_token: string }>(`${this.API_URL}/auth/refresh/`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => {
        this.setToken(response.access_token);
      })
    );
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        localStorage.removeItem(this.USER_KEY);
        return null;
      }
    }
    return null;
  }

  /**
   * Obtém o token de acesso
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtém o refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Define a sessão após login bem-sucedido
   */
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    
    if (authResult.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refresh_token);
    }

    this.currentUserSubject.next(authResult.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Define apenas o token (usado no refresh)
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Limpa a sessão
   */
  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Verifica se há um token válido
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      // Decodifica o JWT para verificar a expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        // Token expirado
        this.clearSession();
        return false;
      }
      
      return true;
    } catch {
      // Token inválido
      this.clearSession();
      return false;
    }
  }

  /**
   * Verifica a validade do token na inicialização
   */
  private checkTokenValidity(): void {
    const isValid = this.hasValidToken();
    this.isAuthenticatedSubject.next(isValid);
    
    if (!isValid) {
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Obtém headers de autorização para requisições HTTP
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Token ${token}`);
    }
    return new HttpHeaders();
  }
}
