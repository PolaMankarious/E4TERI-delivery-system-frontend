import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegisterRequest } from '../../models/auth';
import { Role } from '../../models/role';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private userService = inject(UserService);

  readonly Role = Role;

  step: 1 | 2 = 1;
  loading = false;
  errorMessage = '';

  user: RegisterRequest = {
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role: Role.Business,
  };

  confirmPassword = '';

  goToStep2(form: NgForm): void {
    form.form.markAllAsTouched();

    if (form.invalid) return;

    this.errorMessage = '';
    this.step = 2;
  }

  goToStep1(): void {
    this.errorMessage = '';
    this.step = 1;
  }

  passwordMatched(): boolean {
    return (
      this.user.password.length > 0 &&
      this.user.password === this.confirmPassword
    );
  }

  onRegister(form: NgForm): void {
    form.form.markAllAsTouched();

    if (this.loading || form.invalid || !this.passwordMatched()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.userService.registerUser(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          err.error?.data?.message ??
          err.error?.message ??
          'Registration failed. Please try again.';
      },
    });
  }
}