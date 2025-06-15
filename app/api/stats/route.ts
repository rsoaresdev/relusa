import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Criar cliente Supabase com cookies (admin)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || ""
    );

    // Procurar número total de lavagens concluídas
    const { count, error } = await supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("status", "completed");

    if (error) {
      throw error;
    }

    const totalBookings = count || 0;

    // Calcular água economizada (200L por lavagem)
    const waterSaved = totalBookings * 200;

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        waterSaved,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao procurar estatísticas",
      },
      { status: 500 }
    );
  }
}
