import { Role } from './role';
export interface iUser {
  user_id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}
