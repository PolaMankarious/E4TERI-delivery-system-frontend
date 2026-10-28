import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { iUser } from '../../models/iUser';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role';
import { UserService } from '../../services/user';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private router = inject(Router);
  private userService = inject(UserService);

  step: 1 | 2 = 1;
  loading = false;
  errorMessage = '';

  user: iUser = {
    name: '',
    email: '',
    password: '',
    phone_number: '',
    role: Role.Courier,
  };
  confirmPassword = '';

  passwordMatched(): boolean {
    return !!this.user.password && this.user.password === this.confirmPassword;
  }

  goToStep2() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email);
    if (!this.user.name || !emailValid || !this.user.phone_number) {
      return;
    }
    console.log('go to step2');
    this.step = 2;
  }

  goToStep1() {
    this.step = 1;
  }

  onRegister() {
    if (!this.passwordMatched()) return;
    console.log('registering');
    this.loading = true;
    this.errorMessage = '';
    //api here
    this.userService.registerUser(this.user).subscribe({
      next: (res) => {
        console.log('after next stage');
        this.userService.saveUserInfo(res);
        console.log('Registering: ', this.user);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Registeration failed';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
