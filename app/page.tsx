'use client';

import { useState, useEffect, useMemo } from 'react';
import { getRestaurantes } from '@/services/restauranteService';
import { Restaurante } from '@/types/restaurante';
import { HeroSection } from '@/components/layout/HeroSection';
import { RestaurantGrid } from '@/components/restaurante/RestaurantGrid';
import { FilterBar, Filters } from '@/components/restaurante/FilterBar';

export default function HomePage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<Filters>({
    rating: null,
    price: [1, 4],
    cuisine: null,
    search: "",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getRestaurantes();
        setRestaurantes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredRestaurantes = useMemo(() => {
      // Default empty array if restaurants is undefined
      const list = restaurantes || [];
      return list.filter(r => {
          if (filters.search && !r.nombre.toLowerCase().includes(filters.search.toLowerCase())) return false;
          if (filters.cuisine && r.tipoComida !== filters.cuisine) return false;
          return true;
      });
  }, [restaurantes, filters]);

  const cuisines = Array.from(new Set((restaurantes || []).map(r => r.tipoComida || 'Variada')));

  return (
    <main className="min-h-screen bg-gray-50">
        <HeroSection onSearch={(q) => setFilters(prev => ({...prev, search: q}))} />
        
        <FilterBar 
            filters={filters} 
            onChange={setFilters} 
            cuisines={cuisines}
        />

        <RestaurantGrid restaurants={filteredRestaurantes} />
    </main>
  );
}
