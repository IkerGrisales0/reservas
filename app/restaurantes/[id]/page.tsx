'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRestauranteById } from '@/services/restauranteService';
import { Restaurante } from '@/types/restaurante';
import { RestaurantDetail } from '@/components/restaurante/RestaurantDetail';
import { BookingModal } from '@/components/ui/BookingModal';
import { supabase } from '@/lib/supabaseClient';
import { createReservation } from '@/services/reservasService';
import Swal from 'sweetalert2';

export default function RestaurantePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      getRestauranteById(id).then(data => {
        setRestaurante(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBookingConfirm = async (bookingData: any) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para realizar una reserva',
                confirmButtonText: 'Ir al login',
                confirmButtonColor: '#10b981'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
            setShowModal(false);
            return;
        }

        if (!restaurante) return;

        await createReservation(
            restaurante.id,
            user.id,
            bookingData.date,
            bookingData.time,
            bookingData.guests
        );

        setShowModal(false);
        Swal.fire('¡Reserva Confirmada!', `Te esperamos el ${bookingData.date} a las ${bookingData.time}`, 'success');
      } catch (error: any) {
        console.error(error);
        Swal.fire('Error', error.message || 'No se pudo crear la reserva', 'error');
      }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando restaurante...</div>;
  if (!restaurante) return <div className="p-8 text-center text-red-500">Restaurante no encontrado</div>;

  return (
    <>
        <RestaurantDetail
            restaurant={restaurante}
            onBack={() => router.back()}
            onBooking={() => setShowModal(true)}
        />
        {showModal && (
            <BookingModal
                restaurant={restaurante}
                onClose={() => setShowModal(false)}
                onConfirm={handleBookingConfirm}
            />
        )}
    </>
  );
}
