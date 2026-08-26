import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { AdminRole, ADMIN_ROLE_LABELS } from '../../core/models/admin-role';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly roles = Object.values(AdminRole);
  readonly roleLabels = ADMIN_ROLE_LABELS;

  readonly name = signal('');
  readonly role = signal<AdminRole>(AdminRole.SUPER_ADMIN);

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    const name = this.name().trim() || 'Admin User';
    this.auth.login(name, this.role());
    this.router.navigate(['/dashboard']);
  }
}
