'use client';
import { X, Calendar, Users, Clock } from "lucide-react";
import { useState } from "react";
import { Restaurante } from "@/types/restaurante";
import Swal from "sweetalert2";

interface BookingModalProps {
  restaurant: Restaurante;
  onClose: () => void;
  onConfirm: (booking: BookingData) => void;
}

export interface BookingData {
  date: string;
  time: string;
  guests: number;
}

export function BookingModal({ restaurant, onClose, onConfirm }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  // const [showAlternatives, setShowAlternatives] = useState(false);

  // Use simplified mocked times for now
  const generateTimeSlots = () => {
    return ["13:00", "13:30", "14:00", "14:30", "15:00", "20:00", "20:30", "21:00"];
  };
  const timeSlots = generateTimeSlots();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!date || !time) {
          Swal.fire('Error', 'Por favor selecciona fecha y hora', 'error');
          return;
      }
      onConfirm({ date, time, guests });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content text-black">
        <button onClick={onClose} className="modal-close text-black">
            <X size={24} />
        </button>
        <h2 className="modal-title text-black text-xl font-bold">Reservar en {restaurant.nombre}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-bold mb-1 text-black">Fecha</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-black" size={16} />
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-black bg-white"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1 text-black">Hora</label>
                <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`p-2 text-sm border rounded hover:bg-green-50 text-black ${time === slot ? 'bg-green-600 !text-white border-green-600' : 'bg-white border-gray-300'}`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <label className="block text-sm font-bold mb-1 text-black">Personas</label>
                 <div className="relative">
                    <Users className="absolute left-3 top-2.5 text-black" size={16} />
                    <select 
                        value={guests} 
                        onChange={e => setGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded bg-white text-black"
                    >
                        {[1,2,3,4,5,6,7,8].map(n => (
                            <option key={n} value={n}>{n} persona{n>1?'s':''}</option>
                        ))}
                    </select>
                 </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 mt-4 h-12">
                Confirmar Reserva
            </button>
        </form>
      </div>
    </div>
  );
}
