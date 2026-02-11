import { Restaurante } from '@/types/restaurante';
import RestauranteCard from './RestauranteCard';

export default function RestauranteList({ restaurantes }: { restaurantes: Restaurante[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantes.map(r => (
                <RestauranteCard key={r.id} restaurante={r} />
            ))}
        </div>
    );
}
