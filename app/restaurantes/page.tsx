'use client';

import { useEffect, useState } from 'react';
import RestauranteList from '@/components/restaurante/RestauranteList';
import { Restaurante } from '@/types/restaurante';
import { getRestaurantes } from '@/services/restauranteService';

export default function RestaurantesPage() {
    const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRestaurantes().then(data => {
            setRestaurantes(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando restaurantes...</div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Restaurantes</h1>
            <RestauranteList restaurantes={restaurantes} />
        </div>
    );
}
