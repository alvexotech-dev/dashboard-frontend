import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MechanicService } from '../../../core/services/mechanic.service';
import { Mechanic } from '../../../core/models/mechanic';

@Component({
  selector: 'app-mechanics-directory',
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
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

  readonly mechanics = signal<Mechanic[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(private mechanicService: MechanicService) {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mechanicService.getMechanics().subscribe({
      next: (mechanics) => {
        this.mechanics.set(mechanics);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load mechanics. Is the dashboard backend running?');
        this.loading.set(false);
      },
    });
  }
}
