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
import { WorkshopRegistrationRequestService } from '../../../core/services/workshop-registration-request.service';
import {
  WorkshopRegistrationRequestDetail,
  WorkshopRegistrationRequestSummary,
} from '../../../core/models/workshop-registration-request';
import { MaskedPhone } from '../../../shared/masked-phone/masked-phone';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { DecisionReasonDialog } from '../../../shared/decision-reason-dialog/decision-reason-dialog';

type ViewMode = 'queue' | 'all';

@Component({
  selector: 'app-registration-requests',
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
  templateUrl: './registration-requests.html',
  styleUrl: './registration-requests.scss',
})
export class RegistrationRequests {
  readonly displayedColumns = ['workshopName', 'ownerName', 'contact', 'city', 'registeredAt', 'status'];
  readonly pageSizeOptions = [5, 10, 25, 50];

  readonly viewMode = signal<ViewMode>('queue');

  readonly requests = signal<WorkshopRegistrationRequestSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly searchTerm = signal('');
  readonly sortActive = signal('registeredAt');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly selectedId = signal<number | null>(null);
  readonly selectedDetail = signal<WorkshopRegistrationRequestDetail | null>(null);
  readonly detailLoading = signal(false);
  readonly actionInProgress = signal(false);

  private readonly searchInput$ = new Subject<string>();

  constructor(
    private requestService: WorkshopRegistrationRequestService,
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
    this.sortActive.set('registeredAt');
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
    this.sortActive.set(sort.direction ? sort.active : 'registeredAt');
    this.sortDirection.set(sort.direction === 'desc' ? 'desc' : 'asc');
    this.pageIndex.set(0);
    this.load();
  }

  selectRequest(id: number): void {
    this.selectedId.set(id);
    this.detailLoading.set(true);
    this.requestService.getById(id).subscribe({
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
          title: 'Approve Registration',
          message: `Approve ${detail.workshopName}'s registration?`,
          confirmText: 'Approve',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.actionInProgress.set(true);
        this.requestService.approve(detail.id).subscribe({
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
          title: 'Reject Registration',
          label: 'Reason for rejection',
          confirmText: 'Reject',
        },
      })
      .afterClosed()
      .subscribe((reason: string | undefined) => {
        if (!reason) return;
        this.actionInProgress.set(true);
        this.requestService.reject(detail.id, reason).subscribe({
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
        this.requestService.requestInfo(detail.id, comments).subscribe({
          next: () => this.onActionComplete(detail.id),
          error: () => this.actionInProgress.set(false),
        });
      });
  }

  markResubmitted(): void {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.actionInProgress.set(true);
    this.requestService.markResubmitted(detail.id).subscribe({
      next: () => this.onActionComplete(detail.id),
      error: () => this.actionInProgress.set(false),
    });
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

    const result$ = this.viewMode() === 'queue' ? this.requestService.getQueue(query) : this.requestService.getAll(query);

    result$.subscribe({
      next: (result) => {
        this.requests.set(result.content);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load registration requests. Is the dashboard backend running?');
        this.loading.set(false);
      },
    });
  }
}
