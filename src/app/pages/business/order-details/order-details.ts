import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, Location, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OrderDetails as OrderDetailsModel } from '../../../models/order-details';
import { OrderStatus } from '../../../models/order';
import { BusinessOrdersService } from '../../../services/Orders/business-service/business-service';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private ordersService = inject(BusinessOrdersService);

  details = signal<OrderDetailsModel | null>(null);
  loading = signal(true);
  cancelling = signal(false);
  errorMessage = signal('');

  readonly statusSteps: OrderStatus[] = [
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
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage.set('Invalid order ID.');
      this.loading.set(false);
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.ordersService.getOrderDetails(id).subscribe({
      next: (details) => {
        this.details.set(details);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not load this order.',
        );
        this.loading.set(false);
      },
    });
  }

  getStatusIndex(status: OrderStatus): number {
    return this.statusSteps.indexOf(status);
  }

  cancelOrder(): void {
    const order = this.details()?.order;

    if (!order || order.order_status !== 'pending' || this.cancelling()) {
      return;
    }

    if (!confirm(`Cancel order #${order.id}? This cannot be undone.`)) {
      return;
    }

    this.cancelling.set(true);
    this.errorMessage.set('');

    this.ordersService.cancelOrder(order.id).subscribe({
      next: () => {
        this.router.navigate(['/my-orders']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.data?.message ?? 'Could not cancel this order.',
        );
        this.cancelling.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}