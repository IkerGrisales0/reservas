export interface User {
    id: string;
    email: string;
    nombre?: string;
    role?: 'admin' | 'user';
}
