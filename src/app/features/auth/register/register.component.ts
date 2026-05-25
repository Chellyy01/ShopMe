import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authservice = inject(AuthService);
  router = inject(Router);
  errorMessage: string = '';
  isLoading: boolean = false;

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  registerForm = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.isLoading = true;
      const { firstName, lastName, username, email, password } =
        this.registerForm.value;
      this.authservice
        .registerUser(firstName!, lastName!, username!, email!, password!)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Registration successful', response);
            this.registerForm.reset();
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage =
              err.error?.message || 'Registration failed. Please try again.';
            console.error('Registration error', err);
          },
        });
    }
  }
}
