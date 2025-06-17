"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/marcacoes");
    }
  }, [loading, user, router]);

  // Redirecionar se requer admin mas não é admin
  useEffect(() => {
    if (!loading && user && requireAdmin && !isAdmin) {
      router.push("/marcacoes");
    }
  }, [loading, user, requireAdmin, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            A verificar autenticação...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Por favor aguarde.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Não tem permissões para aceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 