'use client';
import { Utensils, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
      await signOut();
      router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Utensils size={20} />
          </div>
          <span className="navbar-logo-text">ReservaFácil</span>
        </Link>
        
        <div className="flex gap-4 items-center"> 
            {/* Show links based on role */}
            {user && role === 'restaurante' && (
              <>
                 <Link href="/dashboard-restaurante" className="text-sm font-medium hover:text-blue-600">Dashboard</Link>
                 <Link href="/dashboard-restaurante" className="text-sm font-medium hover:text-blue-600">Reservas</Link>
              </>
            )}
            {user && role === 'cliente' && (
              <>
                 <Link href="/mis-reservas" className="text-sm font-medium hover:text-blue-600 text-black">Mis Reservas</Link>
                 <Link href="/perfil" className="text-sm font-medium hover:text-blue-600 text-black">Perfil</Link>
              </>
            )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="flex items-center gap-4">
                <span className="text-sm hidden sm:block font-bold text-black">{role === 'restaurante' ? '🍽️ Restaurante' : '👤 Cliente'}</span>
                <button onClick={handleSignOut} className="btn btn-secondary">
                  <LogOut size={16} />
                  <span className="hidden sm:inline ml-2">Salir</span>
                </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-primary">
                Iniciar sesión
              </Link>
              <Link href="/register" className="btn btn-secondary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
