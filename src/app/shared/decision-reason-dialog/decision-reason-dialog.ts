import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DecisionReasonDialogData {
  title: string;
  label: string;
  confirmText: string;
}

@Component({
  selector: 'app-decision-reason-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './decision-reason-dialog.html',
  styleUrl: './decision-reason-dialog.scss',
})
export class DecisionReasonDialog {
  readonly reason = signal('');

  constructor(
    private dialogRef: MatDialogRef<DecisionReasonDialog, string>,
    @Inject(MAT_DIALOG_DATA) public data: DecisionReasonDialogData,
  ) {}

  confirm(): void {
    if (!this.reason().trim()) return;
    this.dialogRef.close(this.reason().trim());
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
