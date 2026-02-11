import { Restaurante } from '@/types/restaurante';

export async function getRestaurantes(filtro?: string): Promise<Restaurante[]> {
    let url = '/api/restaurantes';
    if (filtro) {
        url += `?search=${encodeURIComponent(filtro)}`;
    }
    
    const res = await fetch(url);
    
    if (!res.ok) {
        // Intentar leer el error, si es HTML probable error 500 de Next.js
        const text = await res.text();
        try {
            const jsonError = JSON.parse(text);
            throw new Error(jsonError.error || 'Error en la petición');
        } catch (e) {
            console.error('API Error (Posible HTML response):', text.substring(0, 200));
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
    }

    const data = await res.json();
    return data.map((d: any) => ({
      id: d.id,
      nombre: d.name,
      descripcion: d.description || '',
      ubicacion: d.location || '',
      tipoComida: d.cuisine || 'Variada',
      precio: (d.price_range === 'alto' ? 'alto' : d.price_range === 'bajo' ? 'bajo' : 'medio') as 'bajo'|'medio'|'alto',
      rating: 0,
      imagen: '',
      caracteristicas: []
    }));
}

export async function getRestauranteById(id: string): Promise<Restaurante | undefined> {
    const res = await fetch(`/api/restaurantes?id=${id}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    
    return {
      id: data.id,
      nombre: data.name,
      descripcion: data.description || '',
      ubicacion: data.location || '',
      tipoComida: data.cuisine || 'Variada',
      precio: (data.price_range === 'alto' ? 'alto' : data.price_range === 'bajo' ? 'bajo' : 'medio') as 'bajo'|'medio'|'alto',
      rating: 0,
      imagen: '',
      caracteristicas: []
    };
}
