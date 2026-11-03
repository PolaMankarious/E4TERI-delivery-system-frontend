import { Order } from './order';
import { Package } from './package';
import { OrderDetails } from './order-details';

// one item from GET /api/admin
export interface AdminOrder extends Order {
    Package: Package;
    assignments: { courier_id: number }[]; // only couriers who accepted
    courier: OrderDetails['courier']; // assigned courier (accepted or not), null when unassigned
}

// one item from GET /api/admin/get-couriers
export interface Courier {
    id: number;
    name: string;
    phone_number: string;
}