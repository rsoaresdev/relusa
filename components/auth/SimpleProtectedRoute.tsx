"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "./AuthProvider";

interface SimpleProtectedRouteProps {
  children: React.ReactNode;
}

export default function SimpleProtectedRoute({
  children,
}: SimpleProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/marcacoes");
    }
  }, [loading, user, router]);

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

  if (!user) {
    return null; // Será redirecionado
  }

  return <>{children}</>;
}
