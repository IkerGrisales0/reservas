'use client';
import { MapPin, Star } from "lucide-react";
import { Restaurante } from '@/types/restaurante';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import Link from 'next/link';

export default function RestauranteCard({ restaurante }: { restaurante: Restaurante }) {
  // Adaptation logic
  const cuisineType = restaurante.tipoComida || 'Variada';
  const imageUrl = restaurante.imagen || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';
  const priceSymbol = restaurante.precio === 'alto' ? '$$$' : restaurante.precio === 'medio' ? '$$' : '$';
  
  return (
    <Link href={`/restaurantes/${restaurante.id}`} className="block">
      <div className="restaurant-card">
        <div className="restaurant-card-image-wrapper">
            <ImageWithFallback
            src={imageUrl}
            alt={restaurante.nombre}
            className="restaurant-card-image"
            />
            <div className="restaurant-card-badges">
                <span className="restaurant-card-badge">
                    {cuisineType}
                </span>
                <span className="restaurant-card-badge">
                    {priceSymbol}
                </span>
            </div>
        </div>
        
        <div className="restaurant-card-content">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{restaurante.nombre}</h3>
                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded text-green-700 text-sm font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>{restaurante.rating || 4.5}</span>
                </div>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin size={16} className="mr-1" />
                <span className="truncate">{restaurante.ubicacion || 'Ubicación desconocida'}</span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">
                {restaurante.descripcion}
            </p>
        </div>
      </div>
    </Link>
  );
}
