import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-masked-phone',
  imports: [MatIconModule, MatIconButton, MatTooltipModule],
  templateUrl: './masked-phone.html',
  styleUrl: './masked-phone.scss',
})
export class MaskedPhone {
  readonly number = input<string | null | undefined>(null);

  readonly revealed = signal(false);

  readonly display = computed(() => {
    const value = this.number();
    if (!value) {
      return '—';
    }
    if (this.revealed()) {
      return value;
    }
    const last4 = value.slice(-4);
    return value.length <= 4 ? value : `*** ${last4}`;
  });

  toggle(): void {
    this.revealed.update((r) => !r);
  }
}
