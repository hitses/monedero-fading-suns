import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/pjs/pjs.component').then((c) => c.PjsComponent),
  },
  {
    path: ':name',
    loadComponent: () =>
      import('./components/pj/pj.component').then((c) => c.PjComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
