import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase/config";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // Redirecionar o utilizador para a URL especificada ou para a raiz da aplicação
      redirect(next);
    }
  }

  // Redirecionar o utilizador para uma página de erro com algumas instruções
  redirect("/auth/auth-code-error");
}
