import { Component } from '@angular/core';
import { NavBar } from '../../shared/nav-bar/nav-bar';

@Component({
  imports: [NavBar],
  selector: 'app-welcome',
  styleUrl: './welcome.css',
  templateUrl: './welcome.html',
})
export class Welcome {}
