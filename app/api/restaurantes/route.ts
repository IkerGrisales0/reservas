import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search');

  try {
    // 1. Obtener restaurante por ID
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('restaurant_profiles') // Tabla definida en SQL
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return NextResponse.json(data);
    }

    // 2. Listar con filtros search (nombre, ubicación, cocina)
    let query = supabaseAdmin.from('restaurant_profiles').select('*');

    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%,cuisine.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);

  } catch (error: any) {
    console.error('API Restaurantes Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
