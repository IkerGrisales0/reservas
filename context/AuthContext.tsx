'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'cliente' | 'restaurante' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'cliente' | 'restaurante' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const fetchRole = async (token: string) => {
      try {
        const res = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.role) {
                setRole(data.role);
            }
        }
      } catch (e) {
          console.error("Error fetching role", e);
      }
      // Note: We do NOT set loading false here anymore, to avoid race conditions.
      // Loading is managed by the main flow.
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout prevents infinite loading (3s max)
    const timeout = setTimeout(() => {
        if (mounted && loading) {
            console.warn("Auth timeout - forcing load complete");
            setLoading(false);
        }
    }, 3000);

    const initAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && mounted) {
                setSession(session);
                setUser(session.user);
                await fetchRole(session.access_token);
            }
        } catch (e) {
            console.error("Auth init error", e);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
         await fetchRole(session.access_token);
         setLoading(false);
      } else {
          setRole(null);
          setLoading(false);
      }
    });

    return () => {
        mounted = false;
        clearTimeout(timeout);
        subscription.unsubscribe();
    };
  }, []);

  // 3. Centralized Redirection Logic
  useEffect(() => {
      if (loading) return;

      const publicRoutes = ['/login', '/register', '/'];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (user && role) {
          // Usuario Logueado
          if (pathname === '/login' || pathname === '/register') {
             if (role === 'restaurante') router.push('/dashboard-restaurante');
             else router.push('/');
          } else if (role === 'restaurante' && pathname === '/') {
              router.push('/dashboard-restaurante');
          }
      } else if (!user && !loading) {
          // Usuario No Logueado
          const isRestaurantesPublic = pathname.startsWith('/restaurantes');
          if (!isPublicRoute && !isRestaurantesPublic) {
              router.push('/login');
          }
      }
  }, [user, role, loading, pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
