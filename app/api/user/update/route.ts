import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function PUT(request: Request) {
  try {
    // 1. Verificar Autenticación
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const body = await request.json();
    const { role, ...updates } = body;

    // 2. Actualizar según el rol
    if (role === 'cliente') {
        const { error } = await supabaseAdmin
            .from('client_profiles')
            .update({
                full_name: updates.full_name,
                phone: updates.phone
            })
            .eq('user_id', user.id);

        if (error) throw error;

    } else if (role === 'restaurante') {
        const { error } = await supabaseAdmin
            .from('restaurant_profiles')
            .update({
                name: updates.name,
                location: updates.location,
                cuisine: updates.cuisine,
                price_range: updates.price_range,
                images: updates.images,
                description: updates.description
            })
            .eq('user_id', user.id);

        if (error) throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
