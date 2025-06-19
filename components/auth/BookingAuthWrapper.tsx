"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "./AuthProvider";
import AuthForm from "./AuthForm";
import BookingForm from "../forms/BookingForm";
import UserDashboard from "../dashboard/UserDashboard";

export default function BookingAuthWrapper() {
  const { user, loading, error, signOut } = useAuthContext();
  const [view, setView] = useState<
    "login" | "register" | "booking" | "dashboard"
  >("login");
  const searchParams = useSearchParams();

  // Verificar erros na URL
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      if (urlError === "auth_failed") {
        toast.error("Erro na autenticação. Tente novamente.");
      } else if (urlError === "callback_failed") {
        toast.error("Erro no processamento do login. Tente novamente.");
      }

      // Limpar URL de erros
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [searchParams]);

  // Atualizar view baseado no estado do usuário
  useEffect(() => {
    if (user) {
      setView("dashboard");
    } else if (!loading) {
      setView("login");
    }
  }, [user, loading]);

  // Mostrar erro se houver
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. A recarregar página...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
  };

  const goToBookingForm = () => setView("booking");
  const goToDashboard = () => setView("dashboard");

  // Loading state com timeout visual
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            A verificar autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <AuthForm view={view as "login" | "register"} toggleView={toggleView} />
      </div>
    );
  }

  // Authenticated
  return (
    <div>
      {view === "dashboard" ? (
        <UserDashboard
          session={{ user }}
          onLogout={handleLogout}
          onNewBooking={goToBookingForm}
        />
      ) : (
        <BookingForm session={{ user }} onCancel={goToDashboard} />
      )}
    </div>
  );
}
