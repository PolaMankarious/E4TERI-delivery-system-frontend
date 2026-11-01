import { Role } from './role';

// what GET /user/me returns inside data (never includes the password)
export interface User {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  role: Role;
}