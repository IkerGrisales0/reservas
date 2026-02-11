'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { createReservation } from '@/services/reservasService';

export default function ReservaForm({ restauranteId }: { restauranteId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<any>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!session) {
       router.push('/login');
       return;
    }
    setStep(step + 1);
  };
  
  const handleBack = () => setStep(step - 1);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
        router.push('/login');
        return;
    }
    setLoading(true);
    setError('');
    
    try {
      await createReservation(
        restauranteId,
        session.user.id,
        formData.date,
        formData.time,
        formData.guests
      );
      setBookingSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'No autorizado' || err.message === 'Unauthorized') {
         router.push('/login');
      } else {
         setError(err.message || 'Hubo un error al crear la reserva.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="p-6 bg-green-50 text-green-800 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h3>
        <p>Te hemos enviado un correo con los detalles.</p>
        <p className="mt-4">
          Restaurante ID: {restauranteId}<br/>
          Fecha: {formData.date} a las {formData.time}<br/>
          Personas: {formData.guests}
        </p>
        <Button onClick={() => window.location.href = '/mis-reservas'} className="mt-4 bg-green-600 hover:bg-green-700">Ver Mis Reservas</Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
        <span className={step >= 1 ? 'text-blue-600' : ''}>1. Fecha y Personas</span>
        <span className={step >= 2 ? 'text-blue-600' : ''}>2. Hora</span>
        <span className={step >= 3 ? 'text-blue-600' : ''}>3. Datos</span>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <Input 
                type="date" 
                required 
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personas</label>
              <Input 
                type="number" 
                min="1" 
                max="20"
                required 
                value={formData.guests}
                onChange={(e) => handleChange('guests', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <Button type="button" onClick={handleNext} disabled={!formData.date} className="w-full mt-4">
              Buscar Disponibilidad
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Horarios Disponibles</h3>
            <div className="grid grid-cols-3 gap-2">
              {['13:00', '13:30', '14:00', '14:30', '15:00', '20:00', '20:30', '21:00'].map(time => (
                <button
                  type="button"
                  key={time}
                  onClick={() => handleChange('time', time)}
                  className={`p-2 rounded border text-sm ${formData.time === time ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="button" onClick={handleBack} className="bg-gray-500 hover:bg-gray-600">Atrás</Button>
              <Button type="button" onClick={handleNext} disabled={!formData.time} className="flex-1">Continuar</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tus Datos</h3>
            <Input 
              type="text" 
              placeholder="Nombre completo" 
              required 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full"
            />
            <Input 
              type="email" 
              placeholder="Email" 
              required 
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full"
            />
            <Input 
              type="tel" 
              placeholder="Teléfono" 
              required 
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full"
            />
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p>Reserva para {formData.guests} personas</p>
              <p>El {formData.date} a las {formData.time}</p>
            </div>
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <div className="flex gap-2 mt-4">
              <Button type="button" onClick={handleBack} className="bg-gray-500 hover:bg-gray-600">Atrás</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                {loading ? 'Confirmando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
