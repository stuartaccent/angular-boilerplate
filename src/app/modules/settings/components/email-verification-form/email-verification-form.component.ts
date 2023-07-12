import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthRepository } from '@modules/auth/shared/auth.repository';
import { AuthService } from '@modules/auth/shared/auth.service';
import { ErrorMessagesComponent } from '@modules/shared/components/error-messages/error-messages.component';
import { FormErrorsComponent } from '@modules/shared/components/form-errors/form-errors.component';
import { TailwindDirective } from '@modules/shared/directives/tailwind.directive';
import { ErrorMessageService } from '@modules/shared/services/error-message.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-email-verification-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsComponent,
    ErrorMessagesComponent,
    TailwindDirective
  ],
  templateUrl: './email-verification-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailVerificationFormComponent {
  authRepository = inject(AuthRepository);
  form = new FormGroup({
    token: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required
      ]
    }),
  });
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  requested = signal<boolean>(false);
  private authService = inject(AuthService);
  private errorService = inject(ErrorMessageService);

  request(event: Event | MouseEvent): void {
    event.stopPropagation();
    this.requested.set(false);
    this.authService.verifyRequest().pipe(
      first()
    ).subscribe({
      next: () => this.handleRequestSuccess(),
      error: (error) => this.handleBothError(error)
    });
  }

  submit(): void {
    if (!this.form.valid) return;
    this.loading.set(true);
    this.success.set(false);
    this.authService.verify(this.form.value.token ?? '').pipe(
      first(),
      finalize(() => this.handleSubmitFinish())
    ).subscribe({
      next: () => this.handleSubmitSuccess(),
      error: (error) => this.handleBothError(error)
    });
  }

  handleRequestSuccess(): void {
    this.requested.set(true);
  }

  handleSubmitSuccess(): void {
    this.success.set(true);
  }

  handleBothError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      this.errorService.publishError('verifyEmail', error);
    } else {
      this.errorService.publishMessages('verifyEmail', ['Something went wrong please try again.']);
      console.error(error);
    }
  }

  handleSubmitFinish(): void {
    this.loading.set(false);
  }
}
