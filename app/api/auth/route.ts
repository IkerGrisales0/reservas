import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const body = await request.json();
    const { action, email, password, name, phone, role, address } = body;

    // Validación básica de datos
    if (!email || !password || !action) {
      return NextResponse.json({ error: 'Faltan datos requeridos (email, password, action)' }, { status: 400 });
    }

    if (action === 'register') {
      if (!name || !phone) {
         return NextResponse.json({ error: 'Nombre y teléfono son requeridos para registro' }, { status: 400 });
      }

      // 1. Crear usuario en Auth (Service Role permite crear sin confirmación email si se desea, o normal)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirmar para evitar bloqueo en demo
        user_metadata: { name }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      const userId = authData.user.id;

      // 2. Insertar en tabla pública users
      const { error: userError } = await supabaseAdmin.from('users').insert({
        id: userId,
        email,
        role: role || 'cliente'
      });

      if (userError) {
        // Rollback (idealmente borrar usuario auth)
        await supabaseAdmin.auth.admin.deleteUser(userId);
        throw userError;
      }

      // 3. Crear perfil
      if ((role || 'cliente') === 'cliente') {
        const { error: profileError } = await supabaseAdmin.from('client_profiles').insert({
          user_id: userId,
          full_name: name,
          phone
        });
        if (profileError) throw profileError;
      } else if (role === 'restaurante') {
         // Crear perfil de restaurante
         const { error: profileError } = await supabaseAdmin.from('restaurant_profiles').insert({
            user_id: userId,
            name: name, // Usamos el nombre del registro como nombre del restaurante inicial
            location: address || '',
            cuisine: 'Variada', // Default value
            price_range: 'medio'
         });
         if (profileError) throw profileError;
      }

      return NextResponse.json({ success: true, message: 'Usuario registrado correctamente' });
    }

    if (action === 'login') {
      // Login normal para obtener tokens
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Obtener el rol del usuario desde la tabla pública
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      return NextResponse.json({ success: true, session: data.session, role: userData?.role || 'cliente' });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const { data: userData } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    return NextResponse.json({ role: userData?.role || 'cliente' });

  } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
