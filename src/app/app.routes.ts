import { Routes } from '@angular/router';
// Importación directa para forzar la detección del error
import { CalendarioPage } from './vistas/calendario/calendario.page';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./vistas/home/home.page').then(m => m.HomePage) },
  { path: 'preguntas', loadComponent: () => import('./vistas/preguntas/preguntas.page').then(m => m.PreguntasPage) },
  { path: 'blog', loadComponent: () => import('./vistas/blog/blog.page').then( m => m.BlogPage)},
  { path: 'otros', loadComponent: () => import('./vistas/otros/otros.page').then( m => m.OtrosPage)},
  // Cambiamos loadComponent por component para forzar la carga
  { path: 'calendario', component: CalendarioPage }, 
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];