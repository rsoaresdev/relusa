"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/config";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const type = searchParams.get("type");
        
        console.log("[Auth Callback] Tipo de callback:", type);

        // Processar apenas recovery de password
        if (type === "recovery") {
          console.log("[Auth Callback] Processando recovery de password");
          
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("[Auth Callback] Erro na sessão:", error);
            setStatus("error");
            setTimeout(() => router.push("/auth?error=callback_failed"), 2000);
            return;
          }

          if (data.session) {
            console.log("[Auth Callback] Sessão de recovery válida, redirecionando");
            setStatus("success");
            // Redirecionar para página de reset de password
            router.push("/auth/reset-password");
          } else {
            console.log("[Auth Callback] Nenhuma sessão encontrada");
            setStatus("error");
            setTimeout(() => router.push("/auth?error=callback_failed"), 2000);
          }
        } else {
          // Para outros tipos ou sem tipo, redirecionar para login
          console.log("[Auth Callback] Tipo não reconhecido, redirecionando para login");
          router.push("/auth");
        }
      } catch (error) {
        console.error("[Auth Callback] Erro inesperado:", error);
        setStatus("error");
        setTimeout(() => router.push("/auth?error=callback_failed"), 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                A processar...
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A verificar as suas credenciais
              </p>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 text-green-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sucesso!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A redirecionar...
              </p>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 text-red-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Erro na autenticação
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A redirecionar para o login...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
