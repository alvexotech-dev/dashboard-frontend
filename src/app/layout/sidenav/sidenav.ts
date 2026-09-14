import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ADMIN_ROLE_LABELS } from '../../core/models/admin-role';
import { NAV_GROUPS } from '../../core/nav-items';

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SideNav {
  readonly roleLabels = ADMIN_ROLE_LABELS;

  readonly navGroups = computed(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return NAV_GROUPS.filter((g) => g.roles.includes(role));
  });

  // Icon-only rail mode (matches the TailAdmin reference's collapsed
  // sidebar). Collapsed groups have no room for an expandable sub-menu, so
  // their icon just links straight to the group's first child route.
  readonly collapsed = signal(false);

  // Single-open accordion, kept in sync with the active route so landing on
  // (or navigating directly to) a nested page always shows its parent group
  // expanded and never leaves every group closed with no visible context.
  readonly openGroupIndex = signal<number | null>(null);

  constructor(protected auth: AuthService, protected theme: ThemeService, private router: Router) {
    this.syncOpenGroupToRoute();
    this.router
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.syncOpenGroupToRoute());
  }

  private syncOpenGroupToRoute(): void {
    const url = this.router.url;
    const index = this.navGroups().findIndex((group) =>
      group.children.some((child) => url.startsWith('/' + child.path)),
    );
    if (index !== -1) {
      this.openGroupIndex.set(index);
    }
  }

  toggleNav(): void {
    this.collapsed.set(!this.collapsed());
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
