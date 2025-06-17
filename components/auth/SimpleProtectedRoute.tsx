"use client";

import { useAuthContext } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SimpleProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function SimpleProtectedRoute({ 
  children, 
  requireAdmin = false 
}: SimpleProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/marcacoes");
    }
  }, [loading, user, router]);

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