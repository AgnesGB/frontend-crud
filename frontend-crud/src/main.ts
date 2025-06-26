import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Imports essenciais para PrimeNG e roteamento
import { provideAnimations } from '@angular/platform-browser/animations'; // Habilita animações
import { MessageService } from 'primeng/api';     // Serviço para mensagens Toast
import { provideRouter } from '@angular/router'; // Para o roteamento
import { routes } from './app/app.routes';      // Importa suas rotas

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimations(),    // Habilita animações para PrimeNG
    MessageService,        // Permite injetar MessageService para notificações
    provideRouter(routes) // Configura o roteamento da aplicação
  ]
}).catch((err) => console.error(err));