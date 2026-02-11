'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getReservasUsuario, cancelarReserva } from '@/services/reservasService';
import { Reserva } from '@/types/reserva';
import Button from '@/components/ui/Button';

export default function MisReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'proximas' | 'historial'>('proximas');

  const fetchReservas = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getReservasUsuario(user.id);
    setReservas(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservas();
    }
  }, [user, authLoading]);

  // Si está cargando auth, no renderizar nada (el Layout ya maneja el spinner global,
  // pero esto previene flash de contenido protegido)
  if (authLoading) return null;

  const handleCancel = async (id: string) => {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      await cancelarReserva(id);
      fetchReservas(); // Refresh
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'text-green-600 bg-green-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter logic
  const today = new Date().toISOString().split('T')[0];
  const filteredReservas = reservas.filter(r => {
    if (activeTab === 'proximas') {
      return r.date >= today && r.status !== 'cancelada';
    } else {
      return r.date < today || r.status === 'cancelada';
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>
      
      <div className="flex border-b mb-6">
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'proximas' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('proximas')}
        >
          Próximas
        </button>
        <button 
          className={`px-6 py-2 font-medium ${activeTab === 'historial' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial
        </button>
      </div>

      {loading ? (
        <p>Cargando tus reservas...</p>
      ) : (
        <div className="space-y-4">
          {filteredReservas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No tienes reservas en esta sección.</p>
              <Link href="/">
                <Button>Buscar Restaurantes</Button>
              </Link>
            </div>
          ) : (
            filteredReservas.map(reserva => (
              <div key={reserva.id} className="bg-white border rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                   <h3 className="font-bold text-lg mb-1">{reserva.restauranteNombre}</h3>
                   <div className="text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
                     <span>📅 {reserva.date}</span>
                     <span>⏰ {reserva.time}</span>
                     <span>👥 {reserva.guests} personas</span>
                   </div>
                   <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusColor(reserva.status)}`}>
                     {reserva.status}
                   </span>
                </div>
                
                {activeTab === 'proximas' && reserva.status === 'confirmada' && (
                  <div className="mt-4 md:mt-0">
                    <Button 
                      onClick={() => handleCancel(reserva.id)}
                      className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
