"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/marcacoes");
      } else if (requireAdmin && !isAdmin) {
        router.push("/marcacoes");
      }
    }
  }, [loading, user, requireAdmin, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            A verificar autenticação...
          </h2>
          <p className="text-muted-foreground">Por favor aguarde.</p>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null; // Será redirecionado
  }

  return <>{children}</>;
}
