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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      const { data, error: exchangeError } =
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

      console.log("[Auth Callback] Código PKCE processado com sucesso", {
        hasSession: !!data.session,
        hasUser: !!data.user,
      });

      // Criar uma resposta de redirecionamento com cookies de autenticação
      const response = NextResponse.redirect(`${origin}${next}?auth=success`);

      // Definir cookies de sessão se existirem
      if (data.session) {
        // Usar a data de expiração do token ou 30 dias como padrão
        const tokenExpiry = data.session.expires_at
          ? new Date(data.session.expires_at * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

        response.cookies.set("sb-access-token", data.session.access_token, {
          expires: tokenExpiry,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        if (data.session.refresh_token) {
          // Refresh token com duração mais longa
          const refreshExpiry = new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ); // 1 ano

          response.cookies.set("sb-refresh-token", data.session.refresh_token, {
            expires: refreshExpiry,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
      }

      return response;
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
