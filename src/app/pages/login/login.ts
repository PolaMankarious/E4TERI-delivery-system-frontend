import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { iUser } from '../../models/iUser';
import { Role } from '../../models/role';
import { UserService } from '../../services/user';
@Component({
  imports: [RouterModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loginObj: any = {
    email: '',
    password: '',
  };

  adminUser: iUser = {
    user_id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'pass123',
    phone: '01000000001',
    role: Role.Admin,
  };

  CourierUser: iUser = {
    user_id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'pass456',
    phone: '01000000002',
    role: Role.Courier,
  };

  guestUser: iUser = {
    user_id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'pass789',
    phone: '01000000003',
    role: Role.Business,
  };

  constructor(private userService: UserService) {}
  onLogin() {
    const formValue = this.loginObj;
    this.userService.saveUserInfo(this.adminUser);
  }
}
