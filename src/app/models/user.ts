// user.model.ts
import { Role } from './role';

// a user as the app knows them (never includes the password)
export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: Role;
}