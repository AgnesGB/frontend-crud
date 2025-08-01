import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <div class="register-card fade-in-up">
        <p-card>
          <ng-template pTemplate="header">
            <div class="register-header">
              <i class="pi pi-user-plus text-6xl text-primary mb-3"></i>
              <h2 class="text-3xl font-bold text-900 mb-2">Criar Nova Conta</h2>
              <p class="text-600">Preencha os dados para se cadastrar</p>
            </div>
          </ng-template>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <!-- Campo Nome -->
            <div class="field mb-4">
              <label for="firstName" class="block text-900 font-medium mb-2">
                <i class="pi pi-user mr-2"></i>Nome
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-user"></i>
                </p-inputGroupAddon>
                <input 
                  pInputText 
                  id="firstName"
                  formControlName="firstName"
                  placeholder="Digite seu nome"
                  class="w-full"
                  [class.ng-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                />
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Nome é obrigatório
              </small>
            </div>

            <!-- Campo Sobrenome -->
            <div class="field mb-4">
              <label for="lastName" class="block text-900 font-medium mb-2">
                <i class="pi pi-user mr-2"></i>Sobrenome
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-user"></i>
                </p-inputGroupAddon>
                <input 
                  pInputText 
                  id="lastName"
                  formControlName="lastName"
                  placeholder="Digite seu sobrenome"
                  class="w-full"
                  [class.ng-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                />
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Sobrenome é obrigatório
              </small>
            </div>

            <!-- Campo Email -->
            <div class="field mb-4">
              <label for="email" class="block text-900 font-medium mb-2">
                <i class="pi pi-envelope mr-2"></i>Email
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-envelope"></i>
                </p-inputGroupAddon>
                <input 
                  pInputText 
                  id="email"
                  formControlName="email"
                  placeholder="Digite seu email"
                  type="email"
                  class="w-full"
                  [class.ng-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                />
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                <span *ngIf="registerForm.get('email')?.hasError('required')">Email é obrigatório</span>
                <span *ngIf="registerForm.get('email')?.hasError('email')">Email deve ter um formato válido</span>
              </small>
            </div>

            <!-- Campo Username -->
            <div class="field mb-4">
              <label for="username" class="block text-900 font-medium mb-2">
                <i class="pi pi-user mr-2"></i>Nome de Usuário
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-at"></i>
                </p-inputGroupAddon>
                <input 
                  pInputText 
                  id="username"
                  formControlName="username"
                  placeholder="Digite um nome de usuário"
                  class="w-full"
                  [class.ng-invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                />
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                <span *ngIf="registerForm.get('username')?.hasError('required')">Nome de usuário é obrigatório</span>
                <span *ngIf="registerForm.get('username')?.hasError('minlength')">Nome de usuário deve ter pelo menos 3 caracteres</span>
              </small>
            </div>

            <!-- Campo Password -->
            <div class="field mb-4">
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
                  [class.ng-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  [promptLabel]="'Digite uma senha'"
                  [weakLabel]="'Fraca'"
                  [mediumLabel]="'Média'"
                  [strongLabel]="'Forte'"
                ></p-password>
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                <span *ngIf="registerForm.get('password')?.hasError('required')">Senha é obrigatória</span>
                <span *ngIf="registerForm.get('password')?.hasError('minlength')">Senha deve ter pelo menos 6 caracteres</span>
              </small>
            </div>

            <!-- Campo Confirm Password -->
            <div class="field mb-6">
              <label for="confirmPassword" class="block text-900 font-medium mb-2">
                <i class="pi pi-lock mr-2"></i>Confirmar Senha
              </label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-lock"></i>
                </p-inputGroupAddon>
                <p-password 
                  formControlName="confirmPassword"
                  placeholder="Confirme sua senha"
                  [toggleMask]="true"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [class.ng-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                  [feedback]="false"
                ></p-password>
              </p-inputGroup>
              <small 
                class="p-error block mt-1" 
                *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                <span *ngIf="registerForm.get('confirmPassword')?.hasError('required')">Confirmação de senha é obrigatória</span>
                <span *ngIf="registerForm.get('confirmPassword')?.hasError('mismatch')">As senhas não coincidem</span>
              </small>
            </div>

            <!-- Botões -->
            <div class="flex flex-column gap-3">
              <button
                pButton
                pRipple
                type="submit"
                label="Criar Conta"
                icon="pi pi-user-plus"
                class="w-full p-button-lg"
                [loading]="loading"
                [disabled]="registerForm.invalid || loading"
              ></button>

              <button
                pButton
                pRipple
                type="button"
                label="Voltar ao Login"
                icon="pi pi-arrow-left"
                class="w-full p-button-lg p-button-outlined"
                (click)="goToLogin()"
                [disabled]="loading"
              ></button>
            </div>
          </form>
        </p-card>
      </div>

      <!-- Toast Messages -->
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .register-card {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .register-header {
      text-align: center;
      padding: 2.5rem 2rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-bottom: 1px solid #e2e8f0;
    }

    .register-form {
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
      .register-container {
        padding: 1rem;
      }
      
      .register-form {
        padding: 2rem 1.5rem;
      }
      
      .register-header {
        padding: 2rem 1.5rem 1rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Se já estiver autenticado, redireciona
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else if (confirmPassword?.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const userData = {
        first_name: this.registerForm.value.firstName,
        last_name: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        username: this.registerForm.value.username,
        password: this.registerForm.value.password
      };

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Conta criada!',
            detail: 'Sua conta foi criada com sucesso. Faça login para continuar.',
            life: 5000
          });
          
          // Redireciona para login após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Erro no registro:', error);
          
          let errorMessage = 'Erro no servidor. Tente novamente.';
          
          if (error.status === 400) {
            if (error.error?.details) {
              // Mostrar detalhes específicos das validações
              const details = error.error.details;
              const messages = [];
              
              if (details.username) {
                messages.push(`Usuário: ${details.username[0]}`);
              }
              if (details.email) {
                messages.push(`Email: ${details.email[0]}`);
              }
              if (details.password) {
                messages.push(`Senha: ${details.password[0]}`);
              }
              if (details.first_name) {
                messages.push(`Nome: ${details.first_name[0]}`);
              }
              if (details.last_name) {
                messages.push(`Sobrenome: ${details.last_name[0]}`);
              }
              
              errorMessage = messages.length > 0 ? messages.join('\n') : 'Dados inválidos. Verifique os campos.';
            } else if (error.error?.error) {
              errorMessage = error.error.error;
            } else {
              errorMessage = 'Dados inválidos. Verifique os campos.';
            }
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Cadastro',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}
