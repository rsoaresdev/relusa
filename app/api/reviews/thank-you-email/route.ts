import { NextRequest, NextResponse } from "next/server";
import {
  sendReviewThankYouEmail,
  sendAdminNewReviewNotificationEmail,
} from "@/lib/email/service";
import { supabase } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  try {
    const { reviewId, userEmail, userName, rating, comment } =
      await request.json();

    if (!reviewId || !userEmail || !userName || !rating) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Enviar email de agradecimento ao cliente
    const thankYouEmailSent = await sendReviewThankYouEmail(
      userEmail,
      userName,
      rating,
      comment
    );

    // Buscar dados da avaliação para o email do administrador
    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .select(
        `
        *,
        bookings(
          service_type,
          date,
          car_model,
          car_plate
        )
      `
      )
      .eq("id", reviewId)
      .single();

    if (!reviewError && reviewData) {
      const serviceName =
        reviewData.bookings?.service_type === "complete"
          ? "Lavagem Completa"
          : "Lavagem Exterior";

      // Enviar email de notificação ao administrador
      await sendAdminNewReviewNotificationEmail(
        reviewData,
        userName,
        serviceName
      );
    }

    return NextResponse.json({
      success: true,
      thankYouEmailSent,
      message: "Emails enviados com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao enviar emails:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
