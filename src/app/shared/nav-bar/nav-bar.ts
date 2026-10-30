import { Component } from '@angular/core';
import { UserService } from '../../services/user';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  constructor(public userService: UserService) {}
}
