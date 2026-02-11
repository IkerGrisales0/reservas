'use client';
import { ChevronDown, Utensils, DollarSign } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Types defined locally or imported
export type Filters = {
    rating: number | null;
    price: [number, number];
    cuisine: string | null;
    search: string;
};

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  cuisines: string[];
}

export function FilterBar({ filters, onChange, cuisines }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCuisine, setSelectedCuisine] = useState("Todas las cocinas");

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Simplified logic for demo
  return (
    <div className="filter-bar">
      <div className="filter-bar-container">
        <span className="filter-bar-label">Filtrar:</span>
        
        <div className="filter-bar-filters" ref={dropdownRef}>
          <div className="filter-dropdown">
            <button
              onClick={() => setOpenDropdown(openDropdown === "cuisine" ? null : "cuisine")}
              className="filter-btn text-black"
            >
              <Utensils size={16} />
              <span className="text-black">{filters.cuisine || 'Todas las cocinas'}</span>
              <ChevronDown size={16} />
            </button>
            {openDropdown === "cuisine" && (
                <div className="filter-dropdown-menu text-black">
                    <div 
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded text-black"
                        onClick={() => {
                            onChange({ ...filters, cuisine: null });
                            setOpenDropdown(null);
                        }}
                    >
                        Todas
                    </div>
                    {cuisines.map(c => (
                        <div 
                            key={c} 
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded text-black"
                            onClick={() => {
                                onChange({ ...filters, cuisine: c });
                                setOpenDropdown(null);
                            }}
                        >
                            {c}
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="filter-dropdown">
             <button
              onClick={() => {
                  // Toggle price logic demo
                  // This is just a placeholder for now
              }}
              className="filter-btn text-black"
            >
              <DollarSign size={16} />
              <span className="text-black">Precio</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
