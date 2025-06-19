import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase com permissões administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, customerName, carModel, rating, comment } = body;

    // Validar dados obrigatórios
    if (!reviewId || !customerName || !carModel || !rating) {
      return NextResponse.json(
        { error: "Dados obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Validar rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Classificação deve estar entre 1 e 5" },
        { status: 400 }
      );
    }

    // Validar comprimento do comentário
    if (comment && comment.length > 50) {
      return NextResponse.json(
        { error: "Comentário não pode exceder 50 caracteres" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .update({
        customer_name: customerName,
        car_model: carModel,
        rating,
        comment: comment?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (error) {
      console.error("Erro ao atualizar avaliação:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar avaliação" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na API de edição de avaliação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
