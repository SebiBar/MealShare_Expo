import { User } from "./User";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// Auth response interface
export interface AuthResponse {
    token: string;
    user: User;
}