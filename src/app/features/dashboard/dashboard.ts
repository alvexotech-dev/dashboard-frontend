import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard-summary';
import { NAV_GROUPS } from '../../core/nav-items';

interface KpiTile {
  label: string;
  icon: string;
  // Maps this tile to a live count from DashboardSummary. Tiles without a
  // key stay "—" placeholders until their epic exposes real data.
  key?: keyof DashboardSummary;
}

interface KpiSection {
  title: string;
  tiles: KpiTile[];
}

/**
 * Dashboard KPI layout mirrors ADMIN-US-01 / BR-02..BR-20 in the docx.
 * Rider/Workshop registered+deleted, workshop Pickup&Drop/Advance-Payment
 * adoption, Listed/Platform Trusted counts (from approved WorkshopVerification
 * rows, ADMIN-US-06), and suspended/deleted counts for workshops and sales
 * agents are wired to GET /api/dashboard/summary via `key`; every other tile
 * stays a "—" placeholder until its epic exposes real data — add a `key`
 * there too once DashboardSummaryDto grows the matching field.
 */
const KPI_SECTIONS: KpiSection[] = [
  {
    title: 'Rider Summary',
    tiles: [
      { label: 'Registered Riders', icon: 'group', key: 'registeredRiders' },
      { label: 'Deleted Riders', icon: 'person_off', key: 'deletedRiders' },
    ],
  },
  {
    title: 'Workshop Summary',
    tiles: [
      { label: 'Registered Workshops', icon: 'store', key: 'registeredWorkshops' },
      { label: 'Listed Workshops', icon: 'storefront', key: 'listedWorkshops' },
      { label: 'Platform Trusted Workshops', icon: 'verified', key: 'platformTrustedWorkshops' },
      { label: 'Pickup & Drop Enabled', icon: 'local_shipping', key: 'pickupDropEnabledWorkshops' },
      { label: 'Advance Payment Enabled', icon: 'account_balance_wallet', key: 'advancePaymentEnabledWorkshops' },
      { label: 'Suspended Workshops', icon: 'block', key: 'suspendedWorkshops' },
      { label: 'Deleted Workshops', icon: 'delete', key: 'deletedWorkshops' },
    ],
  },
  {
    title: 'Sales Agent Summary',
    tiles: [
      { label: 'Registered Sales Agents', icon: 'badge', key: 'registeredSalesAgents' },
      { label: 'Suspended Sales Agents', icon: 'block', key: 'suspendedSalesAgents' },
      { label: 'Deleted Sales Agents', icon: 'delete', key: 'deletedSalesAgents' },
    ],
  },
  {
    title: 'Booking Summary',
    tiles: [
      { label: "Today's Scheduled Bookings", icon: 'event_available' },
      { label: "Today's Cancelled Bookings", icon: 'event_busy' },
    ],
  },
  {
    title: 'Finance Summary',
    tiles: [
      { label: 'Workshops — Pending Settlement', icon: 'hourglass_empty' },
      { label: 'Workshops — Completed Settlement', icon: 'task_alt' },
    ],
  },
  {
    title: 'Support Summary',
    tiles: [
      { label: 'Open Complaints', icon: 'report_problem' },
      { label: 'New Feedback', icon: 'rate_review' },
    ],
  },
];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly kpiSections = KPI_SECTIONS;

  readonly summary = signal<DashboardSummary | null>(null);

  readonly quickNavCards = computed(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return NAV_GROUPS.filter((g) => g.roles.includes(role)).map((g) => ({
      label: g.label,
      icon: g.icon,
      path: g.children[0].path,
    }));
  });

  constructor(protected auth: AuthService, private dashboardService: DashboardService) {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => this.summary.set(summary),
      // Leave tiles at their "—" placeholder if the backend isn't reachable.
      error: () => this.summary.set(null),
    });
  }

  tileValue(tile: KpiTile): string {
    const summary = this.summary();
    if (!tile.key || !summary) return '—';
    return summary[tile.key].toLocaleString();
  }
}
