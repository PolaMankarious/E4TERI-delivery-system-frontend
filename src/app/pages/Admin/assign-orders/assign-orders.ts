import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { AdminOrder, Courier } from '../../../models/admin-order';
import { AdminOrdersService } from '../../../services/Orders/admin-service/admin-service';

@Component({
  selector: 'app-assign-orders',
  imports: [FormsModule],
  templateUrl: './assign-orders.html',
  styleUrl: './assign-orders.css',
})
export class AssignOrders implements OnInit {
  private ordersService = inject(AdminOrdersService);

  orders = signal<AdminOrder[]>([]);
  couriers = signal<Courier[]>([]);
  selectedCourierIds: Record<number, number | null> = {};

  loading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  activeOrderId = signal<number | null>(null);

  get pendingCount(): number {
    return this.orders().filter(order => order.order_status === 'pending').length;
  }

  get assignedCount(): number {
    return this.orders().filter(order => order.courier !== null).length;
  }
  get inProgressCount(): number {
    return this.orders().filter(
      order => order.order_status === 'picked_up' ||
        order.order_status === 'in_transit'
    ).length;
  }

  get deliveredCount(): number {
    return this.orders().filter(order => order.order_status === 'delivered').length;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    forkJoin({
      orders: this.ordersService.getAllOrders(),
      couriers: this.ordersService.getCouriers(),
    }).subscribe({
      next: ({ orders, couriers }) => {
        console.log('Orders from API:', orders);

        console.table(
          orders.map(order => ({
            orderId: order.id,
            courierId: order.courier?.courier?.id,
            courierName: order.courier?.courier?.name,
            accepted: order.courier?.accepted
          }))
        );
        this.orders.set(orders);
        this.couriers.set(couriers);

        const selections: Record<number, number | null> = {};

        for (const order of orders) {
          selections[order.id] = order.courier?.courier.id ?? null;
        }

        this.selectedCourierIds = selections;
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not load orders and couriers.',
        );
        this.loading.set(false);
      },
    });
  }

  setSelectedCourier(orderId: number, value: number | null): void {
    this.selectedCourierIds[orderId] = value;
  }

  assignCourier(order: AdminOrder): void {
    const courierId = this.selectedCourierIds[order.id];

    console.log('Reassignment attempt:', {
      orderId: order.id,
      currentCourierId: order.courier?.courier.id,
      selectedCourierId: courierId,
      selectedCourier: this.couriers().find(c => c.id === courierId)
    });

    if (!courierId || this.activeOrderId() !== null) {
      return;
    }

    if (order.courier?.courier.id === courierId) {
      this.errorMessage.set('This courier is already assigned to this order.');
      return;
    }

    this.activeOrderId.set(order.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.ordersService.assignCourier(order.id, courierId).subscribe({
      next: () => {
        this.activeOrderId.set(null);
        this.loadData();
        this.successMessage.set(`Courier assigned to order #${order.id}.`);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not assign this courier.',
        );
        this.activeOrderId.set(null);
      },
    });
  }
}