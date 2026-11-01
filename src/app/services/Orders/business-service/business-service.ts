import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../../config/api.config';
import { ApiResponse } from '../../../models/api-response';
import { CreateOrderRequest, Order } from '../../../models/order';
import { OrderDetails } from '../../../models/order-details';
import { Package } from '../../../models/package';

@Injectable({
    providedIn: 'root',
})
export class BusinessOrdersService {
    private http = inject(HttpClient);
    private url = `${API_URL}/order`;

    // Feature 4: create an order with its package
    createOrder(body: CreateOrderRequest) {
        return this.http.post<ApiResponse<{ order: Order; package: Package }>>(this.url, body);
    }

    // Feature 5: orders of the logged in business user
    getMyOrders(): Observable<Order[]> {
        return this.http
            .get<ApiResponse<{ orders: Order[] }>>(this.url)
            .pipe(map((res) => res.data.orders));
    }

    // Feature 6: one order with its package and courier
    getOrderDetails(id: number): Observable<OrderDetails> {
        return this.http.get<ApiResponse<OrderDetails>>(`${this.url}/${id}`).pipe(map((res) => res.data));
    }

    // Feature 6: cancel (backend only allows this while the order is pending)
    cancelOrder(id: number) {
        return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
    }
}