import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MechanicService } from '../../../core/services/mechanic.service';
import { WorkshopSummary as WorkshopSummaryModel } from '../../../core/models/workshop-summary';
import { MaskedPhone } from '../../../shared/masked-phone/masked-phone';
import { httpErrorMessage } from '../../../core/utils/http-error-message';

/**
 * ADMIN-US-02 Workshop Summary (BR-06..BR-11), opened by selecting a row in
 * the Workshop Directory (mechanics-directory). Read-only per BR-13/BR-14 —
 * no suspend/verify/enable actions live here; those belong to
 * ADMIN-US-04/06/07.
 */
@Component({
  selector: 'app-workshop-summary',
  imports: [
    DatePipe,
    TitleCasePipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MaskedPhone,
  ],
  templateUrl: './workshop-summary.html',
  styleUrl: './workshop-summary.scss',
})
export class WorkshopSummary {
  readonly workshop = signal<WorkshopSummaryModel | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mechanicService: MechanicService,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  backToDirectory(): void {
    this.router.navigate(['/workshops/directory']);
  }

  private load(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.mechanicService.getSummary(id).subscribe({
      next: (workshop) => {
        this.workshop.set(workshop);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(httpErrorMessage(err, 'Could not load this workshop. It may not exist.'));
        this.loading.set(false);
      },
    });
  }
}
