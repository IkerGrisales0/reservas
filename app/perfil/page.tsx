'use client';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/services/authService';
import Swal from 'sweetalert2';

export default function PerfilPage() {
    const { user, role, signOut, loading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState({ full_name: '', phone: '' });
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (user) {
            getUserProfile(user.id).then(data => {
                if (data) setProfile({ full_name: data.full_name || '', phone: data.phone || '' });
                setFetching(false);
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Updated to use the secure API route
            const { data: { session } } = await import('@/lib/supabaseClient').then(m => m.supabase.auth.getSession());
            
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    role: 'cliente',
                    full_name: profile.full_name,
                    phone: profile.phone
                })
            });

            if (!res.ok) throw new Error('Error al actualizar');

            Swal.fire('Guardado', 'Perfil actualizado correctamente', 'success');
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading || (user && fetching)) return <div className="min-h-screen text-black flex items-center justify-center">Cargando...</div>;
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white">
            <h1 className="text-3xl font-bold mb-6 text-black">Mi Perfil</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 space-y-6">
                
                <div className="border-b border-gray-200 pb-4">
                    <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                    <p className="text-lg text-black font-mono">{user.email}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                    <label className="text-sm font-medium text-gray-500 block mb-1">Rol</label>
                    <p className="text-lg text-black capitalize flex items-center gap-2">
                        {role === 'cliente' ? '👤' : '🍽️'} {role}
                    </p>
                </div>

                {role === 'cliente' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                            <Input 
                                value={profile.full_name} 
                                onChange={e => setProfile({...profile, full_name: e.target.value})}
                                className="w-full bg-white border-gray-300 text-black focus:ring-green-500"
                                placeholder='Tu nombre'
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                            <Input 
                                value={profile.phone} 
                                onChange={e => setProfile({...profile, phone: e.target.value})}
                                className="w-full bg-white border-gray-300 text-black focus:ring-green-500"
                                placeholder='+57 ...'
                            />
                        </div>
                         <Button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white w-full py-3 text-lg font-semibold"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </>
                )}
                
                <div className="pt-6 mt-6 border-t border-gray-200">
                    <Button 
                        onClick={async () => { await signOut(); router.push('/login'); }} 
                        className="bg-red-50 hover:bg-red-100 text-red-600 w-full border border-red-200"
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    );
}
