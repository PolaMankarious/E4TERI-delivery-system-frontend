
import { Order } from './order';
import { Package } from './package';

// one item from GET /api/order/courier/assigned
export interface AssignedOrder extends Order {
  Package: Package;
  accepted: boolean;
}