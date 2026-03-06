import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./vistas/home/home.page').then(m => m.HomePage) },
  { path: 'preguntas', loadComponent: () => import('./vistas//preguntas/preguntas.page').then(m => m.PreguntasPage) },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];