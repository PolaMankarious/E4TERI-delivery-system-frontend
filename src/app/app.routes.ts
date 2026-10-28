import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { OrderDetails } from './pages/Guest/order-details/order-details';
import { AdminOrders } from './pages/Admin/admin-orders/admin-orders';
import { CourierOrders } from './pages/Courier/courier-orders/courier-orders';
import { AddOrder } from './pages/Guest/add-order/add-order';
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'order-details', component: OrderDetails },
  { path: 'admin-orders', component: AdminOrders },
  { path: 'courier-orders', component: CourierOrders },
  { path: 'add-order', component: AddOrder },
];
