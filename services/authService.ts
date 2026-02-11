import { supabase } from '@/lib/supabaseClient';

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);

  if (data.session) {
    await supabase.auth.setSession(data.session);
  }

  return data;
}

export async function registerUser(email: string, password: string, name: string, phone: string, role: string = 'cliente', address?: string) {
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name, phone, role, address }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    return data;
}

export async function logout() {
    await supabase.auth.signOut();
}

export async function getCurrentUser() {
    return await supabase.auth.getUser();
}

export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function updateUserProfile(userId: string, updates: { full_name?: string, phone?: string }) {
    const { error } = await supabase
        .from('client_profiles')
        .update(updates)
        .eq('user_id', userId);
    
    if (error) throw error;
}
