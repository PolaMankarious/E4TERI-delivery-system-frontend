import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  base_url = 'http://localhost:4000';
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.base_url}/api/admin`);
  }
}
