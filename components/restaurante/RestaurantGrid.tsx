'use client';
import RestauranteCard from "./RestauranteCard";
import { Restaurante } from "@/types/restaurante";

interface RestaurantGridProps {
  restaurants: Restaurante[];
  // onRestaurantClick: (restaurant: Restaurante) => void; // Unused as card is a link
}

export function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  return (
    <div className="restaurant-grid">
      <div className="restaurant-grid-container">
        <div className="restaurant-grid-header">
          <h2 className="restaurant-grid-title">
            Restaurantes Destacados
          </h2>
          <p className="restaurant-grid-count">
            {restaurants.length} restaurante{restaurants.length !== 1 ? "s" : ""} disponible{restaurants.length !== 1 ? "s" : ""}
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="restaurant-grid-empty">
            <p className="restaurant-grid-empty-title">No se encontraron restaurantes</p>
            <p className="restaurant-grid-empty-text">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="restaurant-grid-items">
            {restaurants.map((restaurant) => (
              <RestauranteCard
                key={restaurant.id}
                restaurante={restaurant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
