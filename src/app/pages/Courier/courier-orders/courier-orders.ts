import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AssignedOrder } from '../../../models/assigned-order';
import { OrderStatus } from '../../../models/order';
import { CourierService } from '../../../services/Orders/courier-service/courier-service';

@Component({
  selector: 'app-courier-orders',
  imports: [DatePipe],
  templateUrl: './courier-orders.html',
  styleUrl: './courier-orders.css',
})
export class CourierOrders implements OnInit {
  private courierService = inject(CourierService);

  orders = signal<AssignedOrder[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  activeOrderId = signal<number | null>(null);

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

    this.courierService.getAllAssignedOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not load assigned orders.',
        );
        this.loading.set(false);
      },
    });
  }

  respond(order: AssignedOrder, accepted: boolean): void {
    if (this.activeOrderId() !== null) return;

    this.activeOrderId.set(order.id);
    this.errorMessage.set('');

    this.courierService.respondToOrder(order.id, accepted).subscribe({
      next: () => {
        if (accepted) {
          this.orders.update((orders) =>
            orders.map((item) =>
              item.id === order.id ? { ...item, accepted: true } : item,
            ),
          );
        } else {
          this.orders.update((orders) =>
            orders.filter((item) => item.id !== order.id),
          );
        }

        this.activeOrderId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not update this assignment.',
        );
        this.activeOrderId.set(null);
      },
    });
  }

  updateStatus(order: AssignedOrder): void {
    const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
      pending: 'picked_up',
      picked_up: 'in_transit',
      in_transit: 'delivered',
    };

    const status = nextStatus[order.order_status];

    if (!status || !order.accepted || this.activeOrderId() !== null) {
      return;
    }

    this.activeOrderId.set(order.id);
    this.errorMessage.set('');

    this.courierService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        this.orders.update((orders) =>
          orders.map((item) =>
            item.id === order.id
              ? { ...item, order_status: status }
              : item,
          ),
        );
        this.activeOrderId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not update the order status.',
        );
        this.activeOrderId.set(null);
      },
    });
  }

  nextStatusLabel(status: OrderStatus): string {
    const labels: Partial<Record<OrderStatus, string>> = {
      pending: 'Mark as Picked Up',
      picked_up: 'Mark as In Transit',
      in_transit: 'Mark as Delivered',
    };

    return labels[status] ?? 'Completed';
  }
}