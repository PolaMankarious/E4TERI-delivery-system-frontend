import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from '../../services/user';
import { Role } from '../../models/role';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  userService = inject(UserService);

  readonly Role = Role;
}