export type UserRole = 'cliente' | 'restaurante' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
}

export interface RestaurantProfile {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  cuisine?: string;
  price_range?: string;
  description?: string;
  // Fields not in SQL but needed for frontend compatibility (can be joined or computed)
  rating?: number;
  imagen?: string; 
}

export interface RestaurantHour {
  id: string;
  restaurant_id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
}

export type ReservationStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'rechazada';

export interface Reservation {
  id: string;
  restaurant_id: string;
  client_id: string;
  date: string;
  time: string;
  people: number;
  status: ReservationStatus;
  created_at: string;
}
