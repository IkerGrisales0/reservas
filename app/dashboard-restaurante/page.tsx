'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getReservasByRestaurante, updateReservaStatus } from '@/services/reservasService';
import { Reserva } from '@/types/reserva';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RestaurantSetupForm from '@/components/forms/RestaurantSetupForm';
import { supabase } from '@/lib/supabaseClient';

export default function PanelPage() {
  const { user, role, loading: authLoading } = useAuth(); // Usando AuthContext
  const [date, setDate] = useState('2026-02-05'); 
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New state handling
  const [restProfile, setRestProfile] = useState<any>(null);
  const [isSetupIncomplete, setIsSetupIncomplete] = useState(false);

  const loadReservas = async () => {
    setLoading(true);
    const data = await getReservasByRestaurante('', date); // Backend handles ID via token
    setReservas(data);
    setLoading(false);
  };

  const loadProfile = async () => {
      // Fetch restaurant profile to check if setup is needed
      const { data } = await supabase.from('restaurant_profiles').select('*').eq('user_id', user?.id).single();
      if (data) {
          setRestProfile(data);
          // Check if critical fields are missing
          const hasImages = data.images && data.images.length >= 2;
          const hasCuisine = !!data.cuisine;
          if (!hasImages || !hasCuisine) {
              setIsSetupIncomplete(true);
          }
      }
  };

  useEffect(() => {
    if (!authLoading && user && role === 'restaurante') {
        loadProfile();
        loadReservas();
    }
  }, [date, authLoading, user, role]);

  // Protección Extra (Aunque AuthContext ya redirige)
  if (authLoading) return null;
  if (user && role !== 'restaurante') return <div className="p-8">Acceso denegado</div>;

  if (isSetupIncomplete && restProfile) {
      return (
        <div className="min-h-screen p-8">
            <RestaurantSetupForm profile={restProfile} onComplete={() => { setIsSetupIncomplete(false); loadProfile(); }} />
        </div>
      );
  }

  const handleStatusChange = async (id: string, status: 'confirmada' | 'cancelada') => {
    await updateReservaStatus(id, status);
    loadReservas();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Gestión de Reservas - {restProfile?.name || 'Mi Restaurante'}</h1>
        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
          <label className="font-medium text-gray-700">Fecha:</label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-auto bg-white text-black border-gray-300 focus:ring-green-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-black text-center">Cargando reservas...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Hora</th>
                <th className="p-4 font-semibold text-gray-700">Cliente</th>
                <th className="p-4 font-semibold text-gray-700">Personas</th>
                <th className="p-4 font-semibold text-gray-700">Estado</th>
                <th className="p-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservas.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-gray-500">No hay reservas para este día.</td>
                </tr>
              ) : (
                reservas.map(reserva => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-black">{reserva.time}</td>
                    <td className="p-4">
                      <div className="font-semibold text-black">{reserva.clienteNombre || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-500">{reserva.clienteTelefono}</div>
                    </td>
                    <td className="p-4 text-gray-700">{reserva.guests} pax</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                        ${reserva.status === 'confirmada' ? 'bg-green-100 text-green-800 border-none' : ''}
                        ${reserva.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border-none' : ''}
                        ${reserva.status === 'cancelada' ? 'bg-red-100 text-red-800 border-none' : ''}
                      `}>
                        {reserva.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {reserva.status === 'pendiente' && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleStatusChange(reserva.id, 'confirmada')}
                            className="bg-green-600 hover:bg-green-700 py-1 px-3 text-sm text-white"
                          >
                            Confirmar
                          </Button>
                          <Button 
                            onClick={() => handleStatusChange(reserva.id, 'cancelada')}
                            className="bg-red-600 hover:bg-red-700 py-1 px-3 text-sm text-white"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}