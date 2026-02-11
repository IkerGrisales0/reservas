import { useState } from 'react';

export default function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (usuario: string, password: string) => {
    setLoading(true);
    // Simulación de login
    await new Promise(res => setTimeout(res, 500));
    setLoading(false);
    return usuario === 'admin' && password === '1234';
  };

  return { login, loading };
}
