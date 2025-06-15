"use client";

import { useState, useEffect } from "react";
import { supabase, performLogout } from "@/lib/supabase/config";
import { toast } from "sonner";
import AuthForm from "./AuthForm";
import AdminDashboard from "../dashboard/AdminDashboard";

export default function AdminAuthWrapper() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Verificar se o utilizador está autenticado e é administrador
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setLoading(false);
          setAuthCheckComplete(true);
          return;
        }

        setSession(data.session);

        if (data.session) {
          // Verificar se o utilizador é administrador
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("*")
            .eq("user_id", data.session.user.id)
            .single();

          if (!adminError && adminData) {
            setIsAdmin(true);
          } else {
            toast.error(
              "Acesso restrito. Apenas administradores podem aceder a esta área."
            );
          }
        }
      } finally {
        setLoading(false);
        setAuthCheckComplete(true);
      }
    };

    // Adicionar um timeout de segurança para garantir que não ficará em loading infinito
    timeoutId = setTimeout(() => {
      if (loading && !authCheckComplete) {
        setLoading(false);
        setAuthCheckComplete(true);
      }
    }, 15000); // 15 segundos

    // Verificar sessão apenas uma vez no carregamento inicial
    checkSession();

    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session) {
          // Verificar se o utilizador é administrador
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (!adminError && adminData) {
            setIsAdmin(true);
          } else {
            toast.error(
              "Acesso restrito. Apenas administradores podem aceder a esta área."
            );
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }

        setAuthCheckComplete(true);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await performLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Fallback: forçar refresh mesmo assim
      window.location.href = "/";
    }
  };

  if (loading && !authCheckComplete) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o utilizador não estiver autenticado, mostrar formulário de login
  if (!session || !isAdmin) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold font-poppins mb-6 text-gray-900 dark:text-white text-center">
            Acesso Administrativo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Faça login com a sua conta de administrador para aceder ao painel.
          </p>
          <AuthForm view="login" toggleView={() => {}} />
        </div>
      </div>
    );
  }

  // Se o utilizador for administrador, mostrar dashboard
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <AdminDashboard session={session} onLogout={handleLogout} />
    </div>
  );
}
