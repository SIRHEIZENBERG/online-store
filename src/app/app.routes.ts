import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/components/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'product/:slug',
    loadComponent: () =>
      import('../app/components/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'login',
    loadComponent: () => import('../app/components/admin/login/login').then((m) => m.Login),
  },
  {
    path: 'solutions',
    loadComponent: () => import('../app/components/solutions/solutions').then((m) => m.Solutions),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('../app/components/admin/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'about-us',
    loadComponent: () => import('../app/components/about-us/about-us').then((m) => m.AboutUs),
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
