import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { iUser } from '../../models/iUser';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role';
@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private router = inject(Router);

  step: 1 | 2 = 1;

  user: iUser = {
    user_id: 0,
    name: '',
    email: '',
    password: '',
    phone: '',
    role: Role.Courier,
  };
  confirmPassword = '';

  passwordMatched(): boolean {
    return !!this.user.password && this.user.password === this.confirmPassword;
  }

  goToStep2() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email);
    if (!this.user.name || !emailValid || !this.user.phone) {
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

    //api here

    console.log('Registering: ', this.user);
    this.router.navigate(['/login']);
  }
}
