import { inject, Service, signal } from '@angular/core';
import { iOrder } from '../../../models/iOrder';
import { Observable } from 'rxjs';
import { iAssignedOrder } from '../../../models/iAssignedOrder';
import { HttpClient } from '@angular/common/http';

@Service()
export class CourierService {
  private base_url = 'http://localhost:4000';
  private http = inject(HttpClient);
  // assignedOrders = signal<iOrder[]>([]);

  getAllAssignedOrders(): Observable<iAssignedOrder[]> {
    return this.http.get<iAssignedOrder[]>(`${this.base_url}/api/order/courier/assigned`);
  }
}
