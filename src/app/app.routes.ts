import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./vistas/home/home.page').then(m => m.HomePage) },
  { path: 'preguntas', loadComponent: () => import('./vistas//preguntas/preguntas.page').then(m => m.PreguntasPage) },
  { path: 'blog', loadComponent: () => import('./vistas/blog/blog.page').then( m => m.BlogPage)},
  { path: 'otros', loadComponent: () => import('./vistas/otros/otros.page').then( m => m.OtrosPage)},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];