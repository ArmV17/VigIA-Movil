import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'preguntas',
    loadComponent: () =>
      import('./vistas/preguntas.page').then((m) => m.PreguntasPage),
  },
  {
    path: 'mapa',
    loadComponent: () => 
      import('./mapa/mapa.page').then(m => m.MapaPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];