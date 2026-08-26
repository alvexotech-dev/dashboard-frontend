import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { NAV_GROUPS } from '../../core/nav-items';

interface KpiTile {
  label: string;
  icon: string;
}

interface KpiSection {
  title: string;
  tiles: KpiTile[];
}

/**
 * Dashboard KPI layout mirrors ADMIN-US-01 / BR-02..BR-20 in the docx.
 * Values are placeholders ("—") until dashboard/backend exposes the
 * summary endpoints — wire each tile up to real counts then.
 */
const KPI_SECTIONS: KpiSection[] = [
  {
    title: 'Rider Summary',
    tiles: [
      { label: 'Registered Riders', icon: 'group' },
      { label: 'Deleted Riders', icon: 'person_off' },
    ],
  },
  {
    title: 'Workshop Summary',
    tiles: [
      { label: 'Registered Workshops', icon: 'store' },
      { label: 'Listed Workshops', icon: 'storefront' },
      { label: 'Platform Trusted Workshops', icon: 'verified' },
      { label: 'Pickup & Drop Enabled', icon: 'local_shipping' },
      { label: 'Advance Payment Enabled', icon: 'account_balance_wallet' },
      { label: 'Suspended Workshops', icon: 'block' },
      { label: 'Deleted Workshops', icon: 'delete' },
    ],
  },
  {
    title: 'Sales Agent Summary',
    tiles: [
      { label: 'Registered Sales Agents', icon: 'badge' },
      { label: 'Suspended Sales Agents', icon: 'block' },
      { label: 'Deleted Sales Agents', icon: 'delete' },
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

  readonly quickNavCards = computed(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return NAV_GROUPS.filter((g) => g.roles.includes(role)).map((g) => ({
      label: g.label,
      icon: g.icon,
      path: g.children[0].path,
    }));
  });

  constructor(protected auth: AuthService) {}
}
