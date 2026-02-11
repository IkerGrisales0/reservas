import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('PLACEHOLDER')) {
  console.warn('WARNING: Supabase Service Role Key is missing or invalid. Admin features will fail.');
}

// Cliente con privilegios de administrador (Service Role)
// Úsalo solo en el servidor. Nunca en el cliente.
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceKey || 'placeholder', 
  {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
