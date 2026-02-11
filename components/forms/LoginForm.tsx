'use client';

import { Mail, Lock, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { login } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        showConfirmButton: false,
        timer: 1500
      });
      
      // La redirección ahora es manejada por AuthContext
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Credenciales inválidas",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <div className="auth-footer">
          ¿No tienes una cuenta?
          <Link href="/register" className="auth-link">
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
}
