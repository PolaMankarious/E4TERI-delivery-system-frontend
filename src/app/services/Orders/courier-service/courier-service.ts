import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../../config/api.config';
import { ApiResponse } from '../../../models/api-response';
import { AssignedOrder } from '../../../models/assigned-order';
import { Order, OrderStatus } from '../../../models/order';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private http = inject(HttpClient);
  private url = `${API_URL}/order`;

  // Feature 7: orders assigned to the logged in courier
  getAllAssignedOrders(): Observable<AssignedOrder[]> {
    return this.http
      .get<ApiResponse<{ orders: AssignedOrder[] }>>(`${this.url}/courier/assigned`)
      .pipe(map((res) => res.data.orders));
  }

  // Feature 7: accept (true) or decline (false); declining removes the assignment
  respondToOrder(orderId: number, accepted: boolean) {
    return this.http.patch<ApiResponse<unknown>>(`${this.url}/${orderId}/respond`, { accepted });
  }

  // Feature 8: move to the next status (picked_up, then in_transit, then delivered)
  updateOrderStatus(orderId: number, order_status: OrderStatus) {
    return this.http.patch<ApiResponse<{ order: Order }>>(`${this.url}/${orderId}/status`, {
      order_status,
    });
  }
}