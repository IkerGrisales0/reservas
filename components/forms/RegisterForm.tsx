'use client';

import { Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from 'next/link';
import { registerUser } from "@/services/authService";

// Base schema for shared fields
const baseSchema = z.object({
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Teléfono requerido"),
  password: z.string().min(6, "Min 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Client schema
const clientSchema = baseSchema.extend({
  role: z.literal('cliente'),
  name: z.string().min(1, "Nombre completo requerido"),
});

// Restaurant schema
const restaurantSchema = baseSchema.extend({
  role: z.literal('restaurante'),
  name: z.string().min(1, "Nombre del restaurante requerido"),
  address: z.string().min(1, "Dirección requerida"),
});

type ClientFormData = z.infer<typeof clientSchema>;
type RestaurantFormData = z.infer<typeof restaurantSchema>;
type FormData = ClientFormData | RestaurantFormData;

function UtensilsIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
    )
}

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'cliente' | 'restaurante'>('cliente');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(role === 'cliente' ? clientSchema : restaurantSchema),
    defaultValues: {
      role: 'cliente'
    }
  });

  const handleRoleChange = (newRole: 'cliente' | 'restaurante') => {
    setRole(newRole);
    clearErrors();
    reset({ role: newRole }); 
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const address = data.role === 'restaurante' ? (data as RestaurantFormData).address : undefined;
      await registerUser(data.email, data.password, data.name, data.phone, data.role, address);
      
      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Bienvenido a ReservaFácil",
        confirmButtonColor: "#10b981",
      });
      router.push("/login"); // Fixed redirection to login implies successful creation
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un problema al registrar tu cuenta",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card w-full max-w-md mx-auto">
      
      {/* Role Tabs */}
      <div className="flex p-1 mb-6 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => handleRoleChange('cliente')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            role === 'cliente' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cliente
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('restaurante')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            role === 'restaurante' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Restaurante
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Helper hidden field for role */}
        <input type="hidden" {...register('role')} value={role} />

        {/* Name Field (Conditional Label) */}
        <div className="form-group">
          <label className="form-label">{role === 'cliente' ? 'Nombre completo' : 'Nombre del restaurante'}</label>
          <div className="input-wrapper">
             <div className="input-icon">
                {role === 'cliente' ? <User size={20} /> : <UtensilsIcon size={20} />}
             </div>
            <input
              type="text"
              className="form-input"
              placeholder={role === 'cliente' ? "Ej: Juan Pérez" : "Mi Restaurante"}
              {...register("name")}
            />
          </div>
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-wrapper">
             <Mail className="input-icon" size={20} />
            <input
              type="email"
              className="form-input"
              placeholder="correo@ejemplo.com"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">Teléfono</label>
           <div className="input-wrapper">
             <Phone className="input-icon" size={20} />
            <input
              type="tel"
              className="form-input"
              placeholder="+34 600 000 000"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="error-message">{errors.phone.message}</p>}
        </div>

        {/* Address (Restaurant Only) */}
        {role === 'restaurante' && (
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <div className="input-wrapper">
             <MapPin className="input-icon" size={20} />
              <input
                type="text"
                className="form-input"
                placeholder="Calle Principal 123, Madrid"
                {...register("address")}
              />
            </div>
            {/* @ts-ignore - address exists on RestaurantFormData */}
            {errors.address && <p className="error-message">{errors.address?.message}</p>}
          </div>
        )}

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Contraseña</label>
           <div className="input-wrapper">
             <Lock className="input-icon" size={20} />
            <input
              type="password"
              className="form-input"
              placeholder="........"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label">Confirmar Contraseña</label>
           <div className="input-wrapper">
             <Lock className="input-icon" size={20} />
            <input
              type="password"
              className="form-input"
              placeholder="........"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

        <p className="auth-footer-text">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="auth-link">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
