import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { WorkshopVerificationService } from '../../../core/services/workshop-verification.service';
import {
  VerificationMethod,
  WorkshopVerificationDetail,
  WorkshopVerificationStatus,
  WorkshopVerificationSummary,
} from '../../../core/models/workshop-verification';
import { MaskedPhone } from '../../../shared/masked-phone/masked-phone';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { DecisionReasonDialog } from '../../../shared/decision-reason-dialog/decision-reason-dialog';
import { httpErrorMessage } from '../../../core/utils/http-error-message';

type ViewMode = 'queue' | 'all';

const STATUS_LABELS: Record<WorkshopVerificationStatus, string> = {
  NOT_SUBMITTED: 'Not Submitted',
  PENDING: 'Pending Review',
  ADDITIONAL_INFO_REQUESTED: 'Info Requested',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const METHOD_LABELS: Record<VerificationMethod, string> = {
  BUSINESS_LICENSE: 'Business License',
  GST_CERTIFICATE: 'GST Certificate',
  BANK_STATEMENT: 'Bank Statement',
};

/** Statuses an admin can still act on (approve, reject or request info). */
const OPEN_STATUSES: WorkshopVerificationStatus[] = ['NOT_SUBMITTED', 'PENDING', 'ADDITIONAL_INFO_REQUESTED'];

/**
 * ADMIN-US-06 — Manage Workshop Verification Queue (Platform Trust).
 * Structurally a near-copy of RegistrationRequests (same master/detail
 * layout, same lifecycle actions). Every workshop not yet Platform Verified
 * is listed: "Not Submitted" until it submits verification methods from the
 * app, then "Pending Review". Listed status is the onboarding approval on
 * the Registration Requests page.
 */
@Component({
  selector: 'app-verification-queue',
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatSortModule,
    MaskedPhone,
    DatePipe,
    TitleCasePipe,
  ],
  templateUrl: './verification-queue.html',
  styleUrl: './verification-queue.scss',
})
export class VerificationQueue {
  readonly displayedColumns = ['workshopName', 'ownerName', 'contact', 'city', 'requestedAt', 'status'];
  readonly pageSizeOptions = [5, 10, 25, 50];

  readonly viewMode = signal<ViewMode>('queue');

  readonly requests = signal<WorkshopVerificationSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly searchTerm = signal('');
  readonly sortActive = signal('requestedAt');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly selectedId = signal<number | null>(null);
  readonly selectedDetail = signal<WorkshopVerificationDetail | null>(null);
  readonly detailLoading = signal(false);
  readonly actionInProgress = signal(false);

  private readonly searchInput$ = new Subject<string>();

  constructor(
    private verificationService: WorkshopVerificationService,
    private dialog: MatDialog,
  ) {
    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.pageIndex.set(0);
        this.load();
      });
    this.load();
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
    this.pageIndex.set(0);
    this.sortActive.set('requestedAt');
    this.sortDirection.set(mode === 'queue' ? 'asc' : 'desc');
    this.selectedId.set(null);
    this.selectedDetail.set(null);
    this.load();
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  onSortChange(sort: Sort): void {
    this.sortActive.set(sort.direction ? sort.active : 'requestedAt');
    this.sortDirection.set(sort.direction === 'desc' ? 'desc' : 'asc');
    this.pageIndex.set(0);
    this.load();
  }

  selectRequest(id: number): void {
    this.selectedId.set(id);
    this.detailLoading.set(true);
    this.verificationService.getById(id).subscribe({
      next: (detail) => {
        this.selectedDetail.set(detail);
        this.detailLoading.set(false);
      },
      error: () => {
        this.detailLoading.set(false);
      },
    });
  }

  approve(): void {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Approve Platform Trust Status',
          message: `Approve ${detail.workshopName || detail.ownerName} as Platform Verified?`,
          confirmText: 'Approve',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.actionInProgress.set(true);
        this.verificationService.approve(detail.id).subscribe({
          next: () => this.onActionComplete(detail.id),
          error: () => this.actionInProgress.set(false),
        });
      });
  }

  reject(): void {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.dialog
      .open(DecisionReasonDialog, {
        data: {
          title: 'Reject Platform Trust Request',
          label: 'Reason for rejection',
          confirmText: 'Reject',
        },
      })
      .afterClosed()
      .subscribe((reason: string | undefined) => {
        if (!reason) return;
        this.actionInProgress.set(true);
        this.verificationService.reject(detail.id, reason).subscribe({
          next: () => this.onActionComplete(detail.id),
          error: () => this.actionInProgress.set(false),
        });
      });
  }

  requestInfo(): void {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.dialog
      .open(DecisionReasonDialog, {
        data: {
          title: 'Request Additional Information',
          label: 'What information is needed?',
          confirmText: 'Send Request',
        },
      })
      .afterClosed()
      .subscribe((comments: string | undefined) => {
        if (!comments) return;
        this.actionInProgress.set(true);
        this.verificationService.requestInfo(detail.id, comments).subscribe({
          next: () => this.onActionComplete(detail.id),
          error: () => this.actionInProgress.set(false),
        });
      });
  }

  statusLabel(status: WorkshopVerificationStatus): string {
    return STATUS_LABELS[status];
  }

  methodLabel(method: VerificationMethod): string {
    return METHOD_LABELS[method];
  }

  isOpen(status: WorkshopVerificationStatus): boolean {
    return OPEN_STATUSES.includes(status);
  }

  private onActionComplete(id: number): void {
    this.actionInProgress.set(false);
    this.load();
    this.selectRequest(id);
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    const query = {
      page: this.pageIndex(),
      size: this.pageSize(),
      search: this.searchTerm(),
      sortBy: this.sortActive(),
      sortDir: this.sortDirection(),
    };

    const result$ = this.viewMode() === 'queue' ? this.verificationService.getQueue(query) : this.verificationService.getAll(query);

    result$.subscribe({
      next: (result) => {
        this.requests.set(result.content);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(httpErrorMessage(err, 'Could not load verification requests.'));
        this.loading.set(false);
      },
    });
  }
}
