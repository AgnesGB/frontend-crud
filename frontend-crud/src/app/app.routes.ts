import { Routes } from '@angular/router';
import { ProductCrudComponent } from './product-crud.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'products', 
    component: ProductCrudComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '', 
    redirectTo: '/products', 
    pathMatch: 'full' 
  },
];