import { useState } from 'react';

interface Reserva {
  id: string;
  nombre: string;
}

export default function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const addReserva = (reserva: Reserva) => setReservas(prev => [...prev, reserva]);
  return { reservas, addReserva };
}
