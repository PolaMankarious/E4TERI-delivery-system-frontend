import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../../models/order';
import { BusinessOrdersService } from '../../../services/Orders/business-service/business-service';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-my-orders',
  styleUrl: './my-orders.css',
  templateUrl: './my-orders.html',
})
export class MyOrders implements OnInit {
  private ordersService = inject(BusinessOrdersService);

  orders = signal<Order[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  cancellingId = signal<number | null>(null);

  // how each backend status is shown to the user
  statusLabels: Record<string, string> = {
    pending: 'Pending',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  };

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.ordersService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.data?.message ?? 'Could not load your orders.');
        this.loading.set(false);
      },
    });
  }

  cancelOrder(order: Order) {
    if (!confirm(`Cancel order #${order.id}? This cannot be undone.`)) return;

    this.cancellingId.set(order.id);
    this.ordersService.cancelOrder(order.id).subscribe({
      next: () => {
        // remove it from the list without reloading
        this.orders.update((list) => list.filter((o) => o.id !== order.id));
        this.cancellingId.set(null);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.data?.message ?? 'Could not cancel the order.');
        this.cancellingId.set(null);
      },
    });
  }
}