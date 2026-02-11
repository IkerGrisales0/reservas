'use client';

import { Utensils } from 'lucide-react';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <Link href="/" className="auth-logo">
                    <Utensils />
                </Link>
                <h1 className="auth-title">Crear Cuenta</h1>
                <p className="auth-subtitle">Únete a ReservaFácil y descubre los mejores restaurantes</p>
                <RegisterForm />
            </div>
        </div>
    );
}
