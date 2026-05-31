import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { authGuard } from './core/guards/auth.guard';
import { CartComponent } from './features/cart/cart.component';
import { SuccessPageComponent } from './features/checkout/success-page/success-page.component';
import { OrdersComponent } from './features/checkout/orders/orders.component';
import { AccountComponent } from './features/account/account.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard],
      },
      {
        path: 'success',
        component: SuccessPageComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [authGuard],
      },
      {
        path: 'wishlist',
        component: WishlistComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
