import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

async function getUser(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const { restaurantId, date, time, people } = body;

    if (!restaurantId || !date || !time || !people) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('reservations')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('date', date)
      .eq('time', time)
      .not('status', 'eq', 'cancelada')
      .maybeSingle();

    if (existing) {
       return NextResponse.json({ error: 'Horario no disponible.' }, { status: 409 });
    }
    
    // Obtención del perfil de cliente vinculado al usuario autenticado para asociar la reserva
    const { data: profile } = await supabaseAdmin
        .from('client_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
    
    if (!profile) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('reservations')
      .insert({
        restaurant_id: restaurantId,
        client_id: profile.id,
        date,
        time,
        people,
        status: 'pendiente'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const dateFilter = searchParams.get('date');

        // Verificación de rol de restaurante: Se comprueba si el usuario autenticado posee un perfil de establecimiento
        const { data: restProfile } = await supabaseAdmin
            .from('restaurant_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (restProfile) {
            // Consulta de reservas asociadas al establecimiento del usuario
            let query = supabaseAdmin
                .from('reservations')
                .select(`
                    *,
                    client_profiles ( full_name, phone )
                `)
                .eq('restaurant_id', restProfile.id)
                .order('time', { ascending: true });
            
            if (dateFilter) {
                query = query.eq('date', dateFilter);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            return NextResponse.json(data);
        }

        // Verificación de rol de cliente: Se comprueba si el usuario autenticado posee un perfil de cliente
        const { data: clientProfile } = await supabaseAdmin
            .from('client_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (clientProfile) {
            // Consulta del historial de reservas personales del cliente
            const { data, error } = await supabaseAdmin
                .from('reservations')
                .select(`
                    *,
                    restaurant_profiles ( name )
                `)
                .eq('client_id', clientProfile.id)
                .order('date', { ascending: false });
            
            if (error) throw error;
            return NextResponse.json(data);
        }

        return NextResponse.json([]); 

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        const { data: profile } = await supabaseAdmin
            .from('client_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
        
        if (!profile) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 403 });

        const { data: reservation } = await supabaseAdmin
            .from('reservations')
            .select('client_id')
            .eq('id', id)
            .single();
            
        if (!reservation || reservation.client_id !== profile.id) {
             return NextResponse.json({ error: 'No tienes permiso para cancelar esta reserva' }, { status: 403 });
        }

        const { error } = await supabaseAdmin
            .from('reservations')
            .update({ status: 'cancelada' })
            .eq('id', id);
        
        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

        // Validación de permisos de gestión: Solo los perfiles de restaurante pueden modificar estados
        const { data: restProfile } = await supabaseAdmin
            .from('restaurant_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!restProfile) {
            return NextResponse.json({ error: 'Solo restaurantes pueden modificar reservas' }, { status: 403 });
        }

        // Validación de seguridad: Asegurar que la reserva corresponde al establecimiento autenticado
        const { data: reservation } = await supabaseAdmin
            .from('reservations')
            .select('restaurant_id')
            .eq('id', id)
            .single();

        if (!reservation || reservation.restaurant_id !== restProfile.id) {
            return NextResponse.json({ error: 'No tienes permiso sobre esta reserva' }, { status: 403 });
        }
        
        const { error } = await supabaseAdmin
            .from('reservations')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
