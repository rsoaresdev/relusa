"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, performLogout } from "@/lib/supabase/config";
import { toast } from "sonner";
import AuthForm from "./AuthForm";
import BookingForm from "../forms/BookingForm";
import UserDashboard from "../dashboard/UserDashboard";

export default function BookingAuthWrapper() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<
    "login" | "register" | "booking" | "dashboard"
  >("login");
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;

    // Verificar se há erros na URL
    const error = searchParams.get("error");
    if (error) {
      if (error === "auth_failed") {
        toast.error("Erro na autenticação. Tente novamente.");
      } else if (error === "callback_failed") {
        toast.error("Erro no processamento do login. Tente novamente.");
      }
    }

    // Verificar se há tokens OAuth na URL (implicit flow)
    const hasOAuthTokens =
      searchParams.get("access_token") ||
      searchParams.get("refresh_token") ||
      window.location.hash.includes("access_token");

    // Função para verificar e processar a sessão
    const processSession = async (currentSession: any) => {
      if (!mounted) return;

      if (currentSession?.user) {
        console.log(
          "Processando sessão do utilizador:",
          currentSession.user.id
        );

        // Verificar se o utilizador existe na BD
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentSession.user.id)
          .single();

        // Se não existe, criar
        if (!existingUser) {
          console.log("Criando novo utilizador na BD");
          await supabase.from("users").insert([
            {
              id: currentSession.user.id,
              email: currentSession.user.email || "",
              name:
                currentSession.user.user_metadata?.full_name ||
                currentSession.user.user_metadata?.name ||
                "Utilizador",
              phone: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

          // Criar pontos de fidelidade
          await supabase.from("loyalty_points").insert([
            {
              user_id: currentSession.user.id,
              points: 0,
              bookings_count: 0,
            },
          ]);
        }

        if (mounted) {
          console.log("Definindo sessão e indo para dashboard");
          setSession(currentSession);
          setView("dashboard");
          setLoading(false);

          // Se há tokens OAuth na URL, limpar a URL
          if (hasOAuthTokens) {
            window.history.replaceState({}, document.title, "/marcacoes");
          }
        }
      } else {
        if (mounted) {
          console.log("Nenhuma sessão encontrada, indo para login");
          setSession(null);
          setView("login");
          setLoading(false);
        }
      }
    };

    // Verificação inicial com retry para OAuth
    const checkInitialSession = async (retryCount = 0) => {
      try {
        console.log(
          `Verificação de sessão inicial (tentativa ${retryCount + 1})`
        );

        // Se há tokens OAuth na URL, aguardar mais tempo para o Supabase processar
        if (hasOAuthTokens && retryCount === 0) {
          console.log(
            "Tokens OAuth detetados na URL, aguardando processamento..."
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao verificar sessão:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        await processSession(data.session);

        // Se não há sessão e é a primeira tentativa, tentar novamente após um delay
        // Isso ajuda com OAuth callbacks que podem demorar a processar
        if (!data.session && retryCount < 3 && hasOAuthTokens) {
          setTimeout(() => {
            if (mounted) {
              checkInitialSession(retryCount + 1);
            }
          }, 1500);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão inicial:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Timeout de segurança
    const safetyTimeout = setTimeout(
      () => {
        if (mounted && loading) {
          console.log("Safety timeout: forçando fim do loading");
          setLoading(false);
        }
      },
      hasOAuthTokens ? 12000 : 6000
    ); // Mais tempo se há tokens OAuth

    checkInitialSession();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth change:", event, !!session);
      if (mounted) {
        await processSession(session);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await performLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Fallback: forçar refresh mesmo assim
      window.location.href = "/";
    }
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
  };

  const goToBookingForm = () => setView("booking");
  const goToDashboard = () => setView("dashboard");

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A verificar autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
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
          session={session}
          onLogout={handleLogout}
          onNewBooking={goToBookingForm}
        />
      ) : (
        <BookingForm session={session} onCancel={goToDashboard} />
      )}
    </div>
  );
}
