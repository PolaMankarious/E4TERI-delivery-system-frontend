
import { Role } from './role';

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    role: Role;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// what POST /auth/login returns inside data
export interface LoginData {
    user_id: number;
    token: string;
}