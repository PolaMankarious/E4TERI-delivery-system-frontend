import { Role } from './role';
export interface iUser {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role: Role;
}
