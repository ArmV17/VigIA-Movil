import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./vistas/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'preguntas',
    loadComponent: () => import('./vistas/preguntas/preguntas.page').then((m) => m.PreguntasPage),
  },
];