import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Generic stand-in for every module screen that doesn't have a real
 * implementation yet. Title/description come from route `data` — see
 * app.routes.ts. Once a module is built for real, replace its route's
 * `loadComponent` with the real component instead of this one.
 */
@Component({
  selector: 'app-placeholder',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss',
})
export class Placeholder {
  readonly title = input<string>('');
  readonly description = input<string>('');
}
