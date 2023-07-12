import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthPaths } from '@modules/auth/shared/auth-routes';
import { AuthService } from '@modules/auth/shared/auth.service';
import { RegisterRequest } from '@modules/auth/shared/interfaces/register-request';
import { ErrorMessagesComponent } from '@modules/shared/components/error-messages/error-messages.component';
import { FormErrorsComponent } from '@modules/shared/components/form-errors/form-errors.component';
import { SvgIconDirective } from '@modules/shared/directives/svg-icon.directive';
import { TailwindDirective } from '@modules/shared/directives/tailwind.directive';
import { ErrorMessageService } from '@modules/shared/services/error-message.service';
import { passwordsMatchValidator } from '@modules/shared/validators/passwords-match';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-register-page',
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
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent {
  form = new FormGroup({
    first_name: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required
      ]
    }),
    last_name: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required
      ]
    }),
    email: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required,
        Validators.email
      ]
    }),
    password: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    }),
    password_confirm: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required
      ]
    })
  }, { validators: passwordsMatchValidator });
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  protected readonly AuthPaths = AuthPaths;
  private authService = inject(AuthService);
  private errorService = inject(ErrorMessageService);

  register(): void {
    if (!this.form.valid) return;
    this.loading.set(true);
    const data = {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      email: this.form.value.email,
      password: this.form.value.password
    } as RegisterRequest;
    this.authService.register(data).pipe(
      first(),
      finalize(() => this.handleSubmitFinish())
    ).subscribe({
      next: () => this.handleSubmitSuccess(),
      error: (error) => this.handleSubmitError(error)
    });
  }

  handleSubmitSuccess(): void {
    this.success.set(true);
  }

  handleSubmitError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      this.errorService.publishError('register', error);
    } else {
      this.errorService.publishMessages('register', ['Something went wrong please try again.']);
      console.error(error);
    }
  }

  handleSubmitFinish(): void {
    this.loading.set(false);
  }
}
