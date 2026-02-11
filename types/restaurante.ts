export interface Restaurante {
    id: string;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    tipoComida: string;
    precio: 'bajo' | 'medio' | 'alto';
    rating: number;
    imagen: string;
    images?: string[]; // Added support for carousel
    caracteristicas: string[];
}
