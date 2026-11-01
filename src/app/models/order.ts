import { Package } from './package';

export type OrderStatus = 'pending' | 'picked_up' | 'in_transit' | 'delivered';

export interface Order {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  business_id: number;
  order_status: OrderStatus;
  delivery_time: string;
  createdAt: string;
  updatedAt: string;
}

// body for POST /api/order
export interface CreateOrderRequest {
  order: Pick<Order, 'pickup_address' | 'dropoff_address' | 'delivery_time'>;
  package: Omit<Package, 'id' | 'order_id'>;
}