import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {path:"list", component: ProductListComponent},
  {path:"", component: AddProductComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


];
