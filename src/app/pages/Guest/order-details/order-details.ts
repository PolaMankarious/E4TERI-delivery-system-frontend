import { Component } from '@angular/core';
import { NavBar } from '../../../shared/nav-bar/nav-bar';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  imports: [NavBar],
  selector: 'app-order-details',
  styleUrl: './order-details.css',
  templateUrl: './order-details.html',
})
export class OrderDetails {
  private route = inject(ActivatedRoute);
  orderId = Number(this.route.snapshot.paramMap.get('id'));
}