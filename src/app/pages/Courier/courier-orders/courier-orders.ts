import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBar } from '../../../shared/nav-bar/nav-bar';
import { CourierService } from '../../../services/Orders/Courier/courier-service';
import { iAssignedOrder } from '../../../models/iAssignedOrder';

@Component({
  imports: [NavBar],
  selector: 'app-courier-orders',
  styleUrl: './courier-orders.css',
  templateUrl: './courier-orders.html',
})
export class CourierOrders implements OnInit {
  private courierService = inject(CourierService);

  assignedOrders = signal<iAssignedOrder[]>([]);

  ngOnInit(): void {
    this.loadAssignedOrders();
  }

  loadAssignedOrders() {
    this.courierService.getAllAssignedOrders().subscribe({
      next: (orders) => {
        console.log('assigned orders', orders);
      },
      error: (err) => {
        console.log('failed', err.status, err.error);
      },
    });
  }
}
