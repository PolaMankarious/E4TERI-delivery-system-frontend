import { Component, OnInit, signal } from '@angular/core';
import { NavBar } from '../../../shared/nav-bar/nav-bar';
import { Order } from '../../../models/order';
import { AdminOrdersService } from '../../../services/Orders/admin-service/admin-service';
import { CommonModule } from '@angular/common';
@Component({
  imports: [NavBar, CommonModule],
  selector: 'app-admin-orders',
  styleUrl: './admin-orders.css',
  templateUrl: './admin-orders.html',
})
export class AdminOrders implements OnInit {
  adminOrders = signal<Order[]>([]);
  constructor(private adminOrdersService: AdminOrdersService) { }

  ngOnInit(): void {
    this.loadAllOrders();
  }
  loadAllOrders() {
    this.adminOrdersService.getAllOrders().subscribe(
      (res) => {
        console.log(' got orders', res);
        this.adminOrders.set(res);
      },
      (err) => {
        console.log(' failed', err.status, err.error);
      },
    );
  }

  OnDeleteOrder(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this order?');

    if (!confirmed) {
      return;
    }

    this.adminOrdersService.deleteOrder(id).subscribe({
      next: (res) => {
        console.log('order deleted successfully', res);
        this.loadAllOrders();
      },
      error: (err) => {
        console.log('Failed to delete order', err.error);
      },
    });
  }
}
