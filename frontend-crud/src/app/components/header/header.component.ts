import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule
  ],
  template: `
    <div class="app-header-user" *ngIf="isAuthenticated">
      <div class="user-info">
        <p-avatar 
          [label]="getUserInitials()" 
          styleClass="mr-2"
          size="normal"
          shape="circle"
        ></p-avatar>
        <div class="user-details">
          <div class="user-name">{{ currentUser?.username }}</div>
          <div class="user-email">{{ currentUser?.email }}</div>
        </div>
      </div>
      
      <button
        pButton
        pRipple
        icon="pi pi-sign-out"
        label="Sair"
        class="p-button-danger p-button-sm"
        (click)="logout()"
      ></button>
    </div>
  `,
  styles: [`
    .app-header-user {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      font-weight: 600;
      color: white;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host ::ng-deep .p-avatar {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      font-weight: 600;
    }

    :host ::ng-deep .p-button-text {
      color: white !important;
    }

    :host ::ng-deep .p-button-text:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    @media (max-width: 768px) {
      .user-details {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAuthenticated = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Observa mudanças no estado de autenticação
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });

    // Observa mudanças no usuário atual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInitials(): string {
    if (!this.currentUser?.username) return 'U';
    
    const names = this.currentUser.username.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.currentUser.username.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro no logout:', error);
        // Mesmo com erro, limpa a sessão local e redireciona
        this.router.navigate(['/login']);
      }
    });
  }
}
