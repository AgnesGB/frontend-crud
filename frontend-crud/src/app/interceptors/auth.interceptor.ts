import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona o token de autorização se disponível
    const authToken = this.authService.getToken();
    let authReq = req;

    if (authToken && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Token ${authToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se receber erro 401 (Unauthorized), tenta renovar o token
        if (error.status === 401 && !req.url.includes('/auth/refresh')) {
          return this.handle401Error(authReq, next);
        }

        // Para outros erros, apenas repassa
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Tenta renovar o token
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Token renovado com sucesso, faz nova tentativa da requisição original
        const newToken = this.authService.getToken();
        const authReq = request.clone({
          setHeaders: {
            Authorization: `Token ${newToken}`
          }
        });
        return next.handle(authReq);
      }),
      catchError((error) => {
        // Falha ao renovar token, faz logout e redireciona para login
        this.authService.logout().subscribe();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }
}
