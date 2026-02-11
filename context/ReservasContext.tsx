import { createContext, useState, ReactNode } from 'react';

interface ReservasContextType {
  reservas: any[];
  setReservas: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ReservasContext = createContext<ReservasContextType | null>(null);

export function ReservasProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<any[]>([]);

  return (
    <ReservasContext.Provider value={{ reservas, setReservas }}>
      {children}
    </ReservasContext.Provider>
  );
}
