import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@modules/auth/shared/auth.service';
import { ErrorMessagesComponent } from '@modules/shared/components/error-messages/error-messages.component';
import { FormErrorsComponent } from '@modules/shared/components/form-errors/form-errors.component';
import { SvgIconDirective } from '@modules/shared/directives/svg-icon.directive';
import { TailwindDirective } from '@modules/shared/directives/tailwind.directive';
import { ErrorMessageService } from '@modules/shared/services/error-message.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-forgot-pw-page',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    FormErrorsComponent,
    ErrorMessagesComponent,
    SvgIconDirective,
    TailwindDirective
  ],
  templateUrl: './forgot-pw-page.component.html'
})
export class ForgotPwPageComponent {
  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required,
        Validators.email
      ]
    }),
  });
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  private authService = inject(AuthService);
  private errorService = inject(ErrorMessageService);

  submit(): void {
    if (!this.form.valid) return;
    this.loading.set(true);
    this.success.set(false);
    const email = this.form.value.email ?? '';
    this.authService.forgotPassword(email).pipe(
      first(),
      finalize(() => this.handleSubmitFinish())
    ).subscribe({
      next: () => this.handleSubmitSuccess(),
      error: (error) => this.handleSubmitError(error),
    });
  }

  handleSubmitFinish(): void {
    this.loading.set(false);
  }

  handleSubmitSuccess(): void {
    this.success.set(true);
  }

  handleSubmitError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      this.errorService.publishError('forgotPw', error);
    } else {
      this.errorService.publishMessages('forgotPw', ['Something went wrong please try again.']);
      console.error(error);
    }
  }
}
