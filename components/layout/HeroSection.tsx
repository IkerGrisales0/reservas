'use client';
import { Search } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="hero">
      <div className="hero-container">
        <h1 className="hero-title">Descubre Tu Próxima</h1>
        <h2 className="hero-subtitle">Experiencia Gastronómica</h2>
        <p className="hero-description">
          Reserva en los restaurantes más exclusivos de la ciudad en segundos
        </p>

        <form onSubmit={handleSubmit} className="hero-search">
          <div className="hero-search-form">
            <div className="hero-search-input-wrapper">
              <Search className="hero-search-icon" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="Buscar restaurantes, cocina..."
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="hero-search-submit">
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
