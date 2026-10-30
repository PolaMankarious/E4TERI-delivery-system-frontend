import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { iUser } from '../../models/iUser';
import { Role } from '../../models/role';
import { UserService } from '../../services/user';
import { email } from '@angular/forms/signals';
@Component({
  imports: [RouterModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loading = false;
  errorMessage = '';

  loginObj: any = {
    email: '',
    password: '',
  };

  adminUser: iUser = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'pass123',
    phone_number: '01000000001',
    role: Role.Admin,
  };

  CourierUser: iUser = {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'pass456',
    phone_number: '01000000002',
    role: Role.Courier,
  };

  guestUser: iUser = {
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'pass789',
    phone_number: '01000000003',
    role: Role.Business,
  };

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}
  onLogin() {
    if (this.loading) return;

    this.loading = true;
    const formValue = this.loginObj;
    this.userService
      .loginUser({ email: this.loginObj.email, password: this.loginObj.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data.token);

          // fetch user data
          this.userService.fetchUserData().subscribe({
            next: (userRes: any) => {
              const userData = userRes.data;
              this.userService.saveUserInfo(userData);
              this.router.navigate(['/welcome']);
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
              this.errorMessage = 'Failed to load user data';
            },
          });
        },
        error: (err) => {
          console.log('ERROR fired', err.status, err.error);
          this.loading = false;
          this.errorMessage = err.error?.data?.message ?? err.error?.message ?? 'Login failed.';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
