import { Component, OnInit, signal } from '@angular/core';
import { NavBar } from '../../../shared/nav-bar/nav-bar';
import { iOrder } from '../../../models/iOrder';
import { AdminOrdersService } from '../../../services/Orders/admin-orders';
import { CommonModule } from '@angular/common';
@Component({
  imports: [NavBar, CommonModule],
  selector: 'app-admin-orders',
  styleUrl: './admin-orders.css',
  templateUrl: './admin-orders.html',
})
export class AdminOrders implements OnInit {
  adminOrders = signal<iOrder[]>([]);
  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }
  loadAllOrders() {
    this.adminOrdersService.getAllOrders().subscribe(
      (res) => {
        console.log(' got orders', res.data.orders);
        this.adminOrders.set(res.data.orders);
      },
      (err) => {
        console.log(' failed', err.status, err.error);
      },
    );
  }
}
