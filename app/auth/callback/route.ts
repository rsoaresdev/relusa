import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Criar cliente Supabase para o servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Função auxiliar para logging em desenvolvimento
const logDev = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth Callback] ${message}`, data || '');
  }
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get("type");
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");
  const next = searchParams.get("next") ?? "/marcacoes";

  logDev("Callback recebido", { type, code: !!code, error, hasTokens: !!(access_token && refresh_token) });

  // Se houver erro nos parâmetros, redirecionar para página de erro
  if (error) {
    console.error("[Auth Callback] Erro no callback:", error, error_description);
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  // Se for um reset password (recovery), redirecionar diretamente para a página de reset
  // IMPORTANTE: Não processar a sessão aqui para evitar login automático
  if (type === "recovery") {
    logDev("Processando recovery callback - redirecionando para reset password");
    return NextResponse.redirect(`${origin}/auth/reset-password`);
  }

  // Se temos tokens de acesso (implicit flow), redirecionar para a página
  if (access_token && refresh_token) {
    logDev("Processando implicit flow callback");
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Processar código OAuth (login com Google, etc.)
  if (code) {
    try {
      logDev("Processando OAuth code callback");
      // Trocar o código por uma sessão
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("[Auth Callback] Erro ao trocar código por sessão:", error);
        return NextResponse.redirect(`${origin}/auth/error`);
      }

      logDev("OAuth code processado com sucesso");
      // Para autenticação OAuth, redirecionar para a página especificada
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error("[Auth Callback] Erro no callback OAuth:", error);
      return NextResponse.redirect(`${origin}/auth/error`);
    }
  }

  // Se não houver parâmetros válidos, redirecionar para erro
  console.error("[Auth Callback] Callback sem parâmetros válidos:", Object.fromEntries(searchParams));
  return NextResponse.redirect(`${origin}/auth/error`);
} 