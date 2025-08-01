import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { AuthService, LoginRequest, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <div class="login-card fade-in-up">
        <p-card>
          <ng-template pTemplate="header">
            <div class="login-header">
              <i class="pi pi-shield text-6xl text-primary mb-3"></i>
              <h2 class="text-3xl font-bold text-900 mb-2">Bem-vindo de volta!</h2>
              <p class="text-600">Faça login para acessar o sistema</p>
            </div>
          </ng-template>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <!-- Campo Username -->
            <div class="field mb-4">
              <label for="username" class="block text-900 font-medium mb-2">
                <i class="pi pi-user mr-2"></i>Usuário
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-user"></i>
                </p-inputGroupAddon>
                <input 
                  pInputText 
                  id="username"
                  formControlName="username"
                  placeholder="Digite seu usuário"
                  class="w-full"
                  [class.ng-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                />
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Usuário é obrigatório
              </small>
            </div>

            <!-- Campo Password -->
            <div class="field mb-6">
              <label for="password" class="block text-900 font-medium mb-2">
                <i class="pi pi-lock mr-2"></i>Senha
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-lock"></i>
                </p-inputGroupAddon>
                <p-password 
                  formControlName="password"
                  placeholder="Digite sua senha"
                  [toggleMask]="true"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [class.ng-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  [feedback]="false"
                ></p-password>
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Senha é obrigatória
              </small>
            </div>

            <!-- Botão Login -->
            <button
              pButton
              pRipple
              type="submit"
              label="Entrar"
              icon="pi pi-sign-in"
              class="w-full p-button-lg mb-4"
              [loading]="loading"
              [disabled]="loginForm.invalid || loading"
            ></button>

            <!-- Divisor -->
            <div class="flex align-items-center justify-content-center mb-4">
              <div class="border-top-1 surface-border flex-1"></div>
              <span class="text-600 px-3">ou</span>
              <div class="border-top-1 surface-border flex-1"></div>
            </div>

            <!-- Botão Cadastro -->
            <button
              pButton
              pRipple
              type="button"
              label="Criar Nova Conta"
              icon="pi pi-user-plus"
              class="w-full p-button-lg p-button-outlined"
              (click)="goToRegister()"
              [disabled]="loading"
            ></button>
          </form>
        </p-card>
      </div>

      <!-- Toast Messages -->
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      margin: 0 auto;
    }

    .login-header {
      text-align: center;
      padding: 2.5rem 2rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-bottom: 1px solid #e2e8f0;
    }

    .login-form {
      padding: 2.5rem 2rem;
    }

    :host ::ng-deep .p-card {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      border: none;
    }

    :host ::ng-deep .p-card .p-card-body {
      padding: 0;
    }

    :host ::ng-deep .p-inputgroup {
      width: 100%;
    }

    :host ::ng-deep .p-inputgroup .p-inputtext,
    :host ::ng-deep .p-inputgroup .p-password input {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      font-size: 1rem;
      padding: 1rem 1.25rem;
    }

    :host ::ng-deep .p-inputgroup-addon {
      background: var(--p-primary-50);
      border-color: var(--p-primary-200);
      color: var(--p-primary-700);
      min-width: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host ::ng-deep .p-password {
      width: 100%;
    }

    :host ::ng-deep .p-password .p-password-input {
      width: 100% !important;
    }

    :host ::ng-deep .p-button-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
    }

    :host ::ng-deep .field label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      font-size: 0.95rem;
    }

    :host ::ng-deep .p-error {
      color: #dc2626;
      font-size: 0.85rem;
    }

    .border-top-1 {
      border-top: 1px solid;
    }

    .surface-border {
      border-color: #e2e8f0;
    }

    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in-up {
      animation: fade-in-up 0.6s ease-out;
    }

    @media (max-width: 640px) {
      .login-container {
        padding: 1rem;
      }
      
      .login-form {
        padding: 2rem 1.5rem;
      }
      
      .login-header {
        padding: 2rem 1.5rem 1rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtém a URL de retorno dos query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Se já estiver autenticado, redireciona
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response: LoginResponse) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Login realizado!',
            detail: `Bem-vindo, ${response.user.username}!`,
            life: 3000
          });
          
          // Redireciona para a URL original ou dashboard
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Erro no login:', error);
          
          let errorMessage = 'Erro no servidor. Tente novamente.';
          
          if (error.status === 401) {
            errorMessage = 'Usuário ou senha incorretos.';
          } else if (error.status === 400) {
            errorMessage = 'Dados inválidos. Verifique os campos.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Login',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
