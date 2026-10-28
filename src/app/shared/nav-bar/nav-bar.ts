import { Component } from '@angular/core';
import { UserService } from '../../services/user';
import { Role } from '../../models/role';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  Role = Role;
  constructor(public userService: UserService) {}
}
