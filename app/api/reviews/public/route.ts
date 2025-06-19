import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Tentar usar service key, se não existir usar anon key
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  supabaseServiceKey
    ? {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    : undefined
);

export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .eq("is_active", true)
      .eq("allow_publication", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar avaliações públicas:", error);
      return NextResponse.json(
        { error: "Erro ao buscar avaliações", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviews: reviews || [],
      count: reviews?.length || 0,
    });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: (error as Error).message },
      { status: 500 }
    );
  }
}
