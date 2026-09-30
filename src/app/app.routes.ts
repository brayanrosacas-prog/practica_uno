import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'detalle',
    loadComponent: () => import('./detalle/detalle.page').then( m => m.DetallePage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'gestion-alumnos',
    loadComponent: () => import('./gestion-alumnos/gestion-alumnos.page').then( m => m.GestionAlumnosPage)
  },
  {
    path: 'gestion-carreras',
    loadComponent: () => import('./gestion-carreras/gestion-carreras.page').then( m => m.GestionCarrerasPage)
  },
];
