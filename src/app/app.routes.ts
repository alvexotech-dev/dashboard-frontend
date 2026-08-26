import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { NAV_GROUPS } from './core/nav-items';

// Every sidenav child route currently points at the generic Placeholder
// component, driven by its `data.title` / `data.description`. Swap a
// route's loadComponent for a real component as each module gets built.
const moduleRoutes: Routes = NAV_GROUPS.flatMap((group) =>
  group.children.map((child) => ({
    path: child.path,
    loadComponent: () => import('./shared/placeholder/placeholder').then((m) => m.Placeholder),
    data: { title: child.label, description: child.description },
  }))
);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      ...moduleRoutes,
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
