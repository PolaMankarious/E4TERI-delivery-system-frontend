import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  imports: [RouterModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private userService = inject(UserService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  loginObj = {
    email: '',
    password: '',
  };

  onLogin() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.userService.loginUser(this.loginObj).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/welcome']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.data?.message ?? 'Login failed.';
      },
    });
  }
}