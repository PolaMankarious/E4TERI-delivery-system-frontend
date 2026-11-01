import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../../shared/nav-bar/nav-bar';
import { Order } from '../../../models/order';

@Component({
  imports: [NavBar, RouterLink, DatePipe],
  selector: 'app-my-orders',
  styleUrl: './my-orders.css',
  templateUrl: './my-orders.html',
})
export class MyOrders implements OnInit {
  orders = signal<Order[]>([]);

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
    // mock data for now, replace with the service call later
    this.orders.set([
      {
        id: 1,
        pickup_address: 'Sheikh Zayed 1',
        dropoff_address: 'Sheikh Zayed 7',
        business_id: 1,
        order_status: 'pending',
        delivery_time: new Date('2026-12-15T12:02:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [],
      },
      {
        id: 2,
        pickup_address: '10 Tahrir St',
        dropoff_address: '25 Haram St',
        business_id: 1,
        order_status: 'in_transit',
        delivery_time: new Date('2026-12-16T15:30:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [],
      },
      {
        id: 3,
        pickup_address: 'Nasr City 4',
        dropoff_address: 'Maadi 12',
        business_id: 1,
        order_status: 'delivered',
        delivery_time: new Date('2026-12-10T09:00:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [],
      },
    ]);
  }

  cancelOrder(order: Order) {
    if (!confirm(`Cancel order #${order.id}? This cannot be undone.`)) return;

    // mock: remove it from the list, replace with the service call later
    this.orders.update((list) => list.filter((o) => o.id !== order.id));
  }
}