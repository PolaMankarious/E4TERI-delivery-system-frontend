export interface iOrder {
  order_id: number;
  pickup_location: string;
  dropoff_location: string;
  business_id: number;
  status: string;
  delivery_time: Date;
}
