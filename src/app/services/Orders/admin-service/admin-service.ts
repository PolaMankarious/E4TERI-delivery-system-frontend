import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../../config/api.config';
import { ApiResponse } from '../../../models/api-response';
import { Assignment } from '../../../models/assignment';
import { AdminOrder, Courier } from '../../../models/admin-order';
import { Order, OrderStatus } from '../../../models/order';

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  private http = inject(HttpClient);
  private url = `${API_URL}/order`;

  // Feature 9: every order in the system
  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<ApiResponse<{ orders: Order[] }>>(`${this.url}/admin`)
      .pipe(map((res) => res.data.orders));
  }

  // Feature 9: change the status of any order
  updateOrderStatus(id: number, order_status: OrderStatus) {
    return this.http.patch<ApiResponse<{ order: Order }>>(`${this.url}/admin/${id}`, {
      order_status,
    });
  }

  // Feature 9: delete any order
  deleteOrder(id: number) {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/admin/${id}`);
  }

  // Feature 10: assign an order to a courier, or reassign it (reassigning resets acceptance)
  assignCourier(order_id: number, courier_id: number) {
    return this.http.post<ApiResponse<{ order: Order; courier_id: number }>>(`${this.url}/courier`, {
      order_id,
      courier_id,
    });
  }

  // Feature 10: the raw assignments of one courier
  getCourierAssignments(courierId: number): Observable<Assignment[]> {
    return this.http
      .get<ApiResponse<{ assignments: Assignment[] }>>(`${this.url}/courier/${courierId}`)
      .pipe(map((res) => res.data.assignments));
  }

  // Feature 10: couriers for the assign dropdown
  getCouriers(): Observable<Courier[]> {
    return this.http
      .get<ApiResponse<{ couriers: Courier[] }>>(`${this.url}/get-couriers`)
      .pipe(map((res) => res.data.couriers));
  }
}