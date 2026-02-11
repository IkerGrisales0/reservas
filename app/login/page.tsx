'use client';

import { Utensils } from 'lucide-react';
import Link from 'next/link';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <Link href="/" className="auth-logo">
                    <Utensils />
                </Link>
                <h1 className="auth-title">Bienvenido de nuevo</h1>
                <p className="auth-subtitle">Inicia sesión para gestionar tus reservas</p>
                <LoginForm />
            </div>
        </div>
    );
}
