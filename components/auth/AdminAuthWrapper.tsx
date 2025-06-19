"use client";

import { useAuthContext } from "./AuthProvider";
import { toast } from "sonner";
import AuthForm from "./AuthForm";
import AdminDashboard from "../dashboard/AdminDashboard";

export default function AdminAuthWrapper() {
  const { user, loading, isAdmin, signOut } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
      toast.error("Erro ao terminar sessão. A recarregar página...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            A verificar permissões de administrador...
          </p>
        </div>
      </div>
    );
  }

  // Se o utilizador não estiver autenticado ou não for admin
  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-card rounded-lg border border-border/50 shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Acesso Administrativo
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Faça login com a sua conta de administrador para aceder ao painel.
          </p>
          {!user ? (
            <AuthForm view="login" toggleView={() => {}} />
          ) : (
            <div className="text-center">
              <p className="text-destructive mb-4">
                Acesso restrito. Apenas administradores podem aceder a esta
                área.
              </p>
              <button
                onClick={handleLogout}
                className="text-primary hover:underline"
              >
                Terminar sessão
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Se o utilizador for administrador, mostrar dashboard
  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm p-6">
      <AdminDashboard session={{ user }} onLogout={handleLogout} />
    </div>
  );
}
