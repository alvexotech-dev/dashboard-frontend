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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MechanicService } from '../../../core/services/mechanic.service';
import { Mechanic } from '../../../core/models/mechanic';
import { MaskedPhone } from '../../../shared/masked-phone/masked-phone';

@Component({
  selector: 'app-mechanics-directory',
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MaskedPhone,
  ],
  templateUrl: './mechanics-directory.html',
  styleUrl: './mechanics-directory.scss',
})
export class MechanicsDirectory {
  readonly displayedColumns = [
    'workshopName',
    'name',
    'contact',
    'city',
    'specialization',
    'experienceYears',
    'hourlyRate',
    'rating',
    'active',
  ];

  readonly pageSizeOptions = [5, 10, 25, 50];

  readonly mechanics = signal<Mechanic[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly searchTerm = signal('');
  readonly sortActive = signal('id');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  private readonly searchInput$ = new Subject<string>();

  constructor(private mechanicService: MechanicService) {
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
    this.mechanicService
      .getMechanics({
        page: this.pageIndex(),
        size: this.pageSize(),
        search: this.searchTerm(),
        sortBy: this.sortActive(),
        sortDir: this.sortDirection(),
      })
      .subscribe({
        next: (result) => {
          this.mechanics.set(result.content);
          this.totalElements.set(result.totalElements);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load mechanics. Is the dashboard backend running?');
          this.loading.set(false);
        },
      });
  }
}
