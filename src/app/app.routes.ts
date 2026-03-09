import { Routes } from '@angular/router';
// Importación directa para forzar la detección del error
import { CalendarioPage } from './vistas/calendario/calendario.page';

export const routes: Routes = [
<<<<<<< HEAD
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
=======
  { path: 'home', loadComponent: () => import('./vistas/home/home.page').then(m => m.HomePage) },
  { path: 'preguntas', loadComponent: () => import('./vistas/preguntas/preguntas.page').then(m => m.PreguntasPage) },
  { path: 'blog', loadComponent: () => import('./vistas/blog/blog.page').then( m => m.BlogPage)},
  { path: 'otros', loadComponent: () => import('./vistas/otros/otros.page').then( m => m.OtrosPage)},
  // Cambiamos loadComponent por component para forzar la carga
  { path: 'calendario', component: CalendarioPage }, 
  { path: '', redirectTo: 'home', pathMatch: 'full' }
>>>>>>> 5d75a2199d26ce52ad29ab30815ac7204627d9e6
];