import { Order } from './order';
import { Package } from './package';

// data from GET /api/order/:id
export interface OrderDetails {
    order: Order;
    package: Package;
    courier: {
        courier: { id: number; name: string; phone_number: string };
        accepted: boolean;
    } | null; // null means no courier assigned yet
}