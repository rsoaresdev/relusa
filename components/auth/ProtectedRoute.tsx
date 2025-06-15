"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/config";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        // Usar a mesma lógica do BookingAuthWrapper
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        if (!data.session?.user) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Se requer admin, verificar se é admin
        if (requireAdmin) {
          const { data: adminData } = await supabase
            .from("admins")
            .select("*")
            .eq("user_id", data.session.user.id)
            .single();

          setIsAdmin(!!adminData);
        }

        setLoading(false);
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    // Timeout de segurança
    timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 10000);

    checkAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        } else {
          setIsAuthenticated(true);
          
          if (requireAdmin) {
            const { data: adminData } = await supabase
              .from("admins")
              .select("*")
              .eq("user_id", session.user.id)
              .single();
            
            setIsAdmin(!!adminData);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [requireAdmin]);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/marcacoes");
    }
  }, [loading, isAuthenticated, router]);

  // Redirecionar se requer admin mas não é admin
  useEffect(() => {
    if (!loading && isAuthenticated && requireAdmin && !isAdmin) {
      router.push("/marcacoes");
    }
  }, [loading, isAuthenticated, requireAdmin, isAdmin, router]);

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

  if (!isAuthenticated) {
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