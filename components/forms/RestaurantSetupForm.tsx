'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Swal from 'sweetalert2';
import { supabase } from '@/lib/supabaseClient';

const CUISINES = [
  "Comida italiana (pizza, pasta)", "Comida mexicana", "Comida japonesa (sushi, ramen)",
  "Comida china", "Comida tailandesa", "Comida india", "Comida mediterránea",
  "Comida americana (burgers, BBQ)", "Comida vegetariana / vegana", "Comida rápida",
  "Mariscos", "Parrilla / asados", "Postres / cafetería"
];

export default function RestaurantSetupForm({ profile, onComplete }: { profile: any, onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    location: profile?.location || '',
    cuisine: profile?.cuisine || CUISINES[0],
    price_range: profile?.price_range || 'medio',
    images: (profile?.images || []).join('\n') // Simple text area for URLs initially
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate images
    const imageUrls = formData.images.split('\n').filter((url: string) => url.trim() !== '');
    if (imageUrls.length < 2 || imageUrls.length > 5) {
        Swal.fire('Error', 'Debes incluir entre 2 y 5 imágenes (URLs)', 'warning');
        setLoading(false);
        return;
    }

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                role: 'restaurante',
                ...formData,
                images: imageUrls
            })
        });

        if (!res.ok) throw new Error('Error al guardar perfil de restaurante');

        Swal.fire('¡Éxito!', 'Perfil de restaurante configurado', 'success');
        onComplete();
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'No se pudo guardar la configuración', 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-gray-200 text-black mt-10 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-600">Configuración Inicial del Restaurante</h2>
        <p className="mb-6 text-gray-600">Antes de continuar, necesitamos completar la información de tu establecimiento.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Nombre del Restaurante</label>
                <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border-gray-300 text-black"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Ubicación</label>
                <Input 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-white border-gray-300 text-black"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Tipo de Comida</label>
                    <select 
                        value={formData.cuisine}
                        onChange={e => setFormData({...formData, cuisine: e.target.value})}
                        className="w-full p-2 rounded bg-white border border-gray-300 text-black"
                    >
                        {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Rango de Precio</label>
                    <select 
                        value={formData.price_range}
                        onChange={e => setFormData({...formData, price_range: e.target.value})}
                        className="w-full p-2 rounded bg-white border border-gray-300 text-black"
                    >
                        <option value="bajo">$ Económico</option>
                        <option value="medio">$$ Medio</option>
                        <option value="alto">$$$ Alto</option>
                        <option value="lujo">$$$$ Lujo</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Fotos (URLs)</label>
                <p className="text-xs text-gray-500 mb-2">Ingresa una URL por línea (Mínimo 2, Máximo 5)</p>
                <textarea 
                    value={formData.images}
                    onChange={e => setFormData({...formData, images: e.target.value})}
                    className="w-full h-32 p-2 rounded bg-white border border-gray-300 text-black font-mono text-sm"
                    placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
                    required
                />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg text-white disabled:opacity-50" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar y Continuar'}
            </Button>
        </form>
    </div>
  );
}
