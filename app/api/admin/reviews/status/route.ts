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
    const { reviewId, isApproved, isActive } = body;

    // Validar dados obrigatórios
    if (!reviewId) {
      return NextResponse.json(
        { error: "ID da avaliação é obrigatório" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (isApproved !== undefined) updateData.is_approved = isApproved;
    if (isActive !== undefined) updateData.is_active = isActive;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar fornecido" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .update(updateData)
      .eq("id", reviewId);

    if (error) {
      console.error("Erro ao atualizar status da avaliação:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar avaliação" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na API de status de avaliação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
