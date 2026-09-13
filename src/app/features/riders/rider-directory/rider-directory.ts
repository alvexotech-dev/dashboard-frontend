import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VehicleUserService } from '../../../core/services/vehicle-user.service';
import { VehicleUser } from '../../../core/models/vehicle-user';
import { MaskedPhone } from '../../../shared/masked-phone/masked-phone';

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

  readonly riders = signal<VehicleUser[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(private vehicleUserService: VehicleUserService) {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.vehicleUserService.getVehicleUsers().subscribe({
      next: (riders) => {
        this.riders.set(riders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load riders. Is the dashboard backend running?');
        this.loading.set(false);
      },
    });
  }
}
