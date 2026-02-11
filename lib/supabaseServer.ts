import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('PLACEHOLDER')) {
  console.error('CRITICAL ERROR: Supabase Service Role Key is missing or invalid.');
  console.error('Please update .env.local with your real SUPABASE_SERVICE_ROLE_KEY from the Supabase Dashboard > Project Settings > API.');
  throw new Error('Supabase Service Role Key is not configured.');
}

// Cliente con privilegios de administrador (Service Role)
// Úsalo solo en el servidor. Nunca en el cliente.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
