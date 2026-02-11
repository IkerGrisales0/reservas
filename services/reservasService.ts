import { supabase } from '@/lib/supabaseClient';
import { Reserva } from '@/types/reserva';

async function getHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session.access_token}` : ''
    };
}

export async function createReservation(restaurantId: string, userId: string, date: string, time: string, people: number) {
    const headers = await getHeaders();
    const res = await fetch('/api/reservas', {
        method: 'POST',
        headers,
        body: JSON.stringify({ restaurantId, date, time, people })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
}

export async function getReservasUsuario(userId: string): Promise<Reserva[]> {
    const headers = await getHeaders();
    const res = await fetch('/api/reservas', { 
        headers 
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return data.map((r: any) => ({
        id: r.id,
        restauranteId: r.restaurant_id, 
        restauranteNombre: r.restaurant_profiles?.name || 'Restaurante',
        date: r.date,
        time: r.time,
        guests: r.people,
        status: r.status
    }));
}

export async function cancelarReserva(reservaId: string): Promise<boolean> {
    const headers = await getHeaders();
    const res = await fetch(`/api/reservas?id=${reservaId}`, {
        method: 'DELETE',
        headers
    });
    
    if (!res.ok) return false;
    return true;
}

export async function getReservasByRestaurante(restaurantId: string, date?: string): Promise<Reserva[]> {
    const headers = await getHeaders();
    let url = '/api/reservas';
    if (date) {
        url += `?date=${date}`;
    }
    
    const res = await fetch(url, { headers });
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || 'Error al cargar reservas');

    // Mapear respuesta de DB a tipo Reserva de frontend
    return data.map((r: any) => ({
        id: r.id,
        restauranteId: r.restaurant_id,
        restauranteNombre: 'Mi Restaurante', // Opcional
        clienteNombre: r.client_profiles?.full_name || 'Cliente',
        clienteTelefono: r.client_profiles?.phone || '',
        date: r.date,
        time: r.time,
        guests: r.people,
        status: r.status
    }));
}

export async function updateReservaStatus(id: string, status: string): Promise<void> {
    const headers = await getHeaders();
    await fetch('/api/reservas', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, status })
    });
}
