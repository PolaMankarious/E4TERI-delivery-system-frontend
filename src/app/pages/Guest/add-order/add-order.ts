import { Component } from '@angular/core';
import { NavBar } from '../../../shared/nav-bar/nav-bar';

@Component({
  imports: [NavBar],
  selector: 'app-my-orders',
  styleUrl: './add-order.css',
  templateUrl: './add-order.html',
})
export class AddOrder {}
