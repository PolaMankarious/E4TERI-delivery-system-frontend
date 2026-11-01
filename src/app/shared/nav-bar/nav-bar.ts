import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { Role } from '../../models/role';

@Component({
  imports: [RouterLink],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  userService = inject(UserService);
  private router = inject(Router);

  protected readonly Role = Role;

  logout() {
    this.userService.deleteUserInfo();
    this.router.navigate(['/login']);
  }
}