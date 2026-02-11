'use client';
import { X, MapPin, Clock, Phone, Mail, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { Restaurante } from "@/types/restaurante";
import { useState } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

interface RestaurantDetailProps {
  restaurant: Restaurante;
  onBack: () => void;
  onBooking: () => void;
}

export function RestaurantDetail({ restaurant, onBack, onBooking }: RestaurantDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use images array if available, otherwise just use single image or fallback
  const images = restaurant.images && restaurant.images.length > 0 
      ? restaurant.images 
      : [restaurant.imagen || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openingTime = "13:00"; 
  const closingTime = "23:30";
  const priceRange = '$'.repeat(restaurant.precio === 'alto' ? 3 : restaurant.precio === 'medio' ? 2 : 1);

  return (
    <div className="restaurant-detail-page bg-white text-black">
      <div className="detail-header bg-white border-b border-gray-200">
        <button onClick={onBack} className="detail-back-btn text-black hover:text-green-600">
          <X size={24} />
          Volver
        </button>
      </div>

      <div className="detail-container">
        <div className="detail-image-section relative group">
          <ImageWithFallback
            src={images[currentImageIndex]}
            alt={restaurant.nombre}
            className="detail-main-image w-full h-[400px] object-cover rounded-lg"
          />
          {images.length > 1 && (
            <>
                <button 
                    onClick={prevImage} 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={nextImage} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </>
          )}
        </div>

        <div className="detail-content bg-white">
          <div className="detail-content-inner">
            <div className="detail-title-section">
              <h1 className="detail-title text-black">{restaurant.nombre}</h1>
              <div className="detail-meta">
                <span className="detail-badge bg-green-100 text-green-800">{restaurant.tipoComida || 'Cocina variada'}</span>
                <span className="detail-price text-gray-700">{priceRange}</span>
              </div>
            </div>

            <div className="detail-section mb-6">
              <p className="detail-description text-xl text-gray-600">{restaurant.descripcion}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center gap-3 text-gray-600">
                     <Clock className="text-green-600" />
                     <span>{openingTime} - {closingTime}</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-600">
                     <MapPin className="text-green-600" />
                     <span>{restaurant.ubicacion || 'Centro de la ciudad'}</span>
                 </div>
            </div>

            <button 
                onClick={onBooking}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition"
            >
                Reservar Mesa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
