import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminOrder } from '../../../models/admin-order';
import { OrderStatus } from '../../../models/order';
import { AdminOrdersService } from '../../../services/Orders/admin-service/admin-service';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  private ordersService = inject(AdminOrdersService);

  orders = signal<AdminOrder[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  activeOrderId = signal<number | null>(null);

  readonly statuses: OrderStatus[] = [
    'pending',
    'picked_up',
    'in_transit',
    'delivered',
  ];

  readonly statusLabels: Record<OrderStatus, string> = {
    pending: 'Pending',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  };

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.ordersService.getAllOrders().subscribe({
      next: (orders) => {

        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not load orders.',
        );
        this.loading.set(false);
      },
    });
  }

  updateStatus(order: AdminOrder, status: string): void {
    if (
      !this.statuses.includes(status as OrderStatus) ||
      order.order_status === status ||
      this.activeOrderId() !== null
    ) {
      return;
    }

    this.activeOrderId.set(order.id);
    this.errorMessage.set('');

    this.ordersService
      .updateOrderStatus(order.id, status as OrderStatus)
      .subscribe({
        next: () => {
          this.orders.update((orders) =>
            orders.map((item) =>
              item.id === order.id
                ? { ...item, order_status: status as OrderStatus }
                : item,
            ),
          );
          this.activeOrderId.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(
            err.error?.data?.message ?? 'Could not update order status.',
          );
          this.activeOrderId.set(null);
        },
      });
  }

  deleteOrder(order: AdminOrder): void {
    if (this.activeOrderId() !== null) return;

    if (!confirm(`Delete order #${order.id}? This cannot be undone.`)) {
      return;
    }

    this.activeOrderId.set(order.id);
    this.errorMessage.set('');

    this.ordersService.deleteOrder(order.id).subscribe({
      next: () => {
        this.orders.update((orders) =>
          orders.filter((item) => item.id !== order.id),
        );
        this.activeOrderId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not delete this order.',
        );
        this.activeOrderId.set(null);
      },
    });
  }
}