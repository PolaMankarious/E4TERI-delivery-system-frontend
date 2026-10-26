import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { OrderDetails } from './pages/Guest/order-details/order-details';
import { AdminOrders } from './pages/Admin/admin-orders/admin-orders';
import { CourierOrders } from './pages/Courier/courier-orders/courier-orders';
import { MyOrders } from './pages/Guest/my-orders/my-orders';
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'order-details', component: OrderDetails },
  { path: 'admin-orders', component: AdminOrders },
  { path: 'courier-orders', component: CourierOrders },
  { path: 'my-orders', component: MyOrders },
];
