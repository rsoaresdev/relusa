import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/marcacoes";

  // Criar cliente Supabase para autenticação
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Importante: não detetar na URL pois já se trata aqui
      },
    }
  );

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

      // Criar uma resposta de redirecionamento
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error("[Auth Callback] Erro inesperado no callback:", error);
      return NextResponse.redirect(`${origin}/marcacoes?error=callback_failed`);
    }
  }

  // Se não houver código, redirecionar para marcações
  return NextResponse.redirect(`${origin}/marcacoes`);
}
