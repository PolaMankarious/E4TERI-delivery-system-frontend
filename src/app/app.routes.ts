import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { OrderDetails } from './pages/business/order-details/order-details';
import { AdminOrders } from './pages/admin/admin-orders/admin-orders';
import { CourierOrders } from './pages/courier/courier-orders/courier-orders';
import { AddOrder } from './pages/business/add-order/add-order';
import { MyOrders } from './pages/business/my-orders/my-orders';
import { Welcome } from './pages/welcome/welcome';
import { authGuard } from './services/guards/auth-guard';
import { roleGuard } from './services/guards/role-guard';
import { Role } from './models/role';
import { AssignOrders } from './pages/admin/assign-orders/assign-orders';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'welcome', component: Welcome, canActivate: [authGuard] },

  // business
  { path: 'my-orders', component: MyOrders, canActivate: [authGuard, roleGuard], data: { roles: [Role.Business] } },
  { path: 'add-order', component: AddOrder, canActivate: [authGuard, roleGuard], data: { roles: [Role.Business] } },
  { path: 'order-details/:id', component: OrderDetails, canActivate: [authGuard, roleGuard], data: { roles: [Role.Business] } },

  // courier
  { path: 'courier-orders', component: CourierOrders, canActivate: [authGuard, roleGuard], data: { roles: [Role.Courier] } },

  // admin
  { path: 'admin-orders', component: AdminOrders, canActivate: [authGuard, roleGuard], data: { roles: [Role.Admin] } },
  { path: 'assign-orders', component: AssignOrders, canActivate: [authGuard, roleGuard], data: { roles: [Role.Admin] }, },
  { path: '**', redirectTo: 'login' },
];