import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { VehicleUserService } from '../../../core/services/vehicle-user.service';
import { VehicleUser } from '../../../core/models/vehicle-user';
import { MaskedPhone } from '../../../shared/masked-phone/masked-phone';
import { httpErrorMessage } from '../../../core/utils/http-error-message';

@Component({
  selector: 'app-rider-directory',
  imports: [
    DatePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MaskedPhone,
  ],
  templateUrl: './rider-directory.html',
  styleUrl: './rider-directory.scss',
})
export class RiderDirectory {
  readonly displayedColumns = [
    'name',
    'contact',
    'city',
    'verified',
    'active',
    'createdAt',
  ];

  readonly pageSizeOptions = [5, 10, 25, 50];

  readonly riders = signal<VehicleUser[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly searchTerm = signal('');
  readonly sortActive = signal('id');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  private readonly searchInput$ = new Subject<string>();

  constructor(private vehicleUserService: VehicleUserService) {
    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.pageIndex.set(0);
        this.load();
      });
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
    this.sortActive.set(sort.direction ? sort.active : 'id');
    this.sortDirection.set(sort.direction === 'desc' ? 'desc' : 'asc');
    this.pageIndex.set(0);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.vehicleUserService
      .getVehicleUsers({
        page: this.pageIndex(),
        size: this.pageSize(),
        search: this.searchTerm(),
        sortBy: this.sortActive(),
        sortDir: this.sortDirection(),
      })
      .subscribe({
        next: (result) => {
          this.riders.set(result.content);
          this.totalElements.set(result.totalElements);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(httpErrorMessage(err, 'Could not load riders.'));
          this.loading.set(false);
        },
      });
  }
}
