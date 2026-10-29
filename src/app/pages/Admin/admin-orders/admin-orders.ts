import { Component, OnInit } from '@angular/core';
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
  adminOrders: iOrder[] = [];

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }
  loadAllOrders() {
    this.adminOrdersService.getAllOrders().subscribe(
      (adminOrders) => {
        console.log(' got orders', adminOrders.data.orders);
        this.adminOrders = adminOrders.data.orders;
      },
      (err) => {
        console.log('❌ failed', err.status, err.error);
      },
    );
  }
}
