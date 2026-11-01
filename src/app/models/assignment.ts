
// a raw row from GET /api/order/courier/:id (admin)
export interface Assignment {
  order_id: number;
  courier_id: number;
  accepted: boolean | null;
  createdAt: string;
  updatedAt: string;
}