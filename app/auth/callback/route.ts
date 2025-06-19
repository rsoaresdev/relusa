import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Criar cliente Supabase para o servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Função auxiliar para logging em desenvolvimento
const logDev = (message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Auth Callback] ${message}`, data || "");
  }
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/marcacoes";

  console.log("[Auth Callback] Recebido:", {
    code: !!code,
    error,
    error_description,
    next,
  });

  // Se houver erro nos parâmetros, redirecionar para página de erro
  if (error) {
    console.error(
      "[Auth Callback] Erro no callback:",
      error,
      error_description
    );
    return NextResponse.redirect(`${origin}/marcacoes?error=auth_failed`);
  }

  // Processar código de autorização (PKCE flow)
  if (code) {
    try {
      console.log("[Auth Callback] Processando código PKCE");

      // Trocar o código por uma sessão
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error(
          "[Auth Callback] Erro ao trocar código por sessão:",
          exchangeError
        );
        return NextResponse.redirect(
          `${origin}/marcacoes?error=callback_failed`
        );
      }

      console.log("[Auth Callback] Código PKCE processado com sucesso");

      // Redirecionar para a página especificada
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error("[Auth Callback] Erro inesperado no callback:", error);
      return NextResponse.redirect(`${origin}/marcacoes?error=callback_failed`);
    }
  }

  // Se não houver código, redirecionar para marcações
  console.log(
    "[Auth Callback] Nenhum código encontrado, redirecionando para marcações"
  );
  return NextResponse.redirect(`${origin}/marcacoes`);
}
