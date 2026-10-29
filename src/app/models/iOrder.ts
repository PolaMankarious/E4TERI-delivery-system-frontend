export interface iOrder {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  business_id: number;
  order_status: string;
  delivery_time: Date;
  createdAt: Date;
  updatedAt: Date;
  assignments: [];
}
