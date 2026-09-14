import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Injected (not just used via DI elsewhere) so the persisted light/dark
  // mode is applied to <html> as soon as the app boots — including on the
  // login page, before the sidenav (the only other injector) ever mounts.
  constructor(private theme: ThemeService) {}
}
