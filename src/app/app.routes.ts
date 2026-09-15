import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NAV_GROUPS } from './core/nav-items';
import { AdminRole } from './core/models/admin-role';

// Every sidenav child route defaults to the generic Placeholder component,
// driven by its `data.title` / `data.description`, except the ones swapped
// in below as each module gets built. Each route also carries its group's
// `roles` in `data` + `roleGuard`, so direct navigation (not just sidenav
// visibility) is blocked for a role that shouldn't see that module.
const moduleRoutes: Routes = NAV_GROUPS.flatMap((group) =>
  group.children.map((child) => ({
    path: child.path,
    loadComponent:
      child.path === 'workshops/directory'
        ? () =>
            import('./features/workshops/mechanics-directory/mechanics-directory').then(
              (m) => m.MechanicsDirectory,
            )
        : child.path === 'riders/directory'
        ? () => import('./features/riders/rider-directory/rider-directory').then((m) => m.RiderDirectory)
        : child.path === 'workshops/registration-requests'
        ? () =>
            import('./features/workshops/registration-requests/registration-requests').then(
              (m) => m.RegistrationRequests,
            )
        : () => import('./shared/placeholder/placeholder').then((m) => m.Placeholder),
    canActivate: [roleGuard],
    data: { title: child.label, description: child.description, roles: group.roles },
  }))
);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/sidenav/sidenav').then((m) => m.SideNav),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      // Not part of NAV_GROUPS/moduleRoutes above since it isn't a sidenav
      // destination itself — it's opened by selecting a row in the Workshop
      // Directory (workshops/directory). Same allowed roles as that group.
      {
        path: 'workshops/directory/:id',
        loadComponent: () =>
          import('./features/workshops/workshop-summary/workshop-summary').then((m) => m.WorkshopSummary),
        canActivate: [roleGuard],
        data: { roles: [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_ADMIN] },
      },
      ...moduleRoutes,
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
