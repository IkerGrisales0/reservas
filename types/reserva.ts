export interface Reserva {
    id: string;
    restauranteId: string;
    restauranteNombre: string;
    date: string;
    time: string;
    guests: number;
    status: 'confirmada' | 'cancelada' | 'pendiente';
    userId?: string;
    clienteNombre?: string;
    clienteTelefono?: string;
}
