import { NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  sendBookingRequestEmail,
  sendBookingApprovedEmail,
  sendBookingRejectedEmail,
  sendBookingRescheduledEmail,
  sendServiceStartedEmail,
  sendServiceCompletedEmail,
  sendServiceCompletedWithReviewRequestEmail,
  sendLoyaltyReminderEmail,
  sendContactFormEmail,
  sendAdminNewBookingNotification,
  sendAdminBookingCancelledNotification,
  sendInvoiceIssuedEmail,
} from "@/lib/email/service";
import { verifyEmailConnection } from "@/lib/email/config";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase com chave de serviço para verificações admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

// Rota GET para verificar a conexão com o servidor de email
export async function GET() {
  const isConnected = await verifyEmailConnection();

  return NextResponse.json({
    connected: isConnected,
    message: isConnected
      ? "Servidor de email conectado e pronto para enviar"
      : "Não foi possível conectar ao servidor de email",
  });
}

// Rota POST para enviar emails
export async function POST(request: Request) {
  try {
    // Verificar se a requisição é do sistema (servidor)
    const systemKey = request.headers.get("x-system-key");
    const isSystemRequest = systemKey === process.env.SYSTEM_API_KEY;

    // Verificar se é uma requisição do formulário de contacto
    const isContactFormRequest =
      request.headers.get("x-request-type") === "contact-form";

    // Verificar se é uma requisição autenticada de utilizador
    const authHeader = request.headers.get("authorization");
    const isUserRequest = authHeader && authHeader.startsWith("Bearer ");

    // Para requisições que precisam de privilégios admin (como invoice_issued)
    let isAdminUser = false;
    if (isUserRequest) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
        } = await supabaseAdmin.auth.getUser(token);

        if (user) {
          // Verificar se o usuário é admin
          const { data: adminData } = await supabaseAdmin
            .from("admins")
            .select("*")
            .eq("user_id", user.id)
            .single();

          isAdminUser = !!adminData;
        }
      } catch (error) {
        console.error("Erro ao verificar privilégios admin:", error);
      }
    }

    // Verificar autorização: deve ser uma requisição do sistema, do formulário de contacto, ou de utilizador autenticado
    if (!isSystemRequest && !isContactFormRequest && !isUserRequest) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    let result = false;

    switch (type) {
      case "welcome":
        result = await sendWelcomeEmail(data);
        break;
      case "booking_request":
        result = await sendBookingRequestEmail(data);
        break;
      case "booking_approved":
        result = await sendBookingApprovedEmail(data);
        break;
      case "booking_rejected":
        result = await sendBookingRejectedEmail(data);
        break;
      case "booking_rescheduled":
        if (!data.booking || !data.oldDate || !data.oldTimeSlot) {
          return NextResponse.json(
            { error: "Dados de reagendamento incompletos" },
            { status: 400 }
          );
        }
        result = await sendBookingRescheduledEmail(
          data.booking,
          data.oldDate,
          data.oldTimeSlot,
          data.oldCustomTime
        );
        break;
      case "service_started":
        result = await sendServiceStartedEmail(data);
        break;
      case "service_completed":
        result = await sendServiceCompletedEmail(data);
        break;
      case "service_completed_with_review_request":
        result = await sendServiceCompletedWithReviewRequestEmail(data);
        break;
      case "loyalty_reminder":
        if (!data.userId) {
          return NextResponse.json(
            {
              error:
                "ID de utilizador não fornecido para email de lembrete de fidelidade",
            },
            { status: 400 }
          );
        }
        result = await sendLoyaltyReminderEmail(data.userId);
        break;
      case "contact_form":
        // Validar dados do formulário
        if (!data.name || !data.email || !data.subject || !data.message) {
          return NextResponse.json(
            { error: "Dados de formulário incompletos" },
            { status: 400 }
          );
        }

        result = await sendContactFormEmail(data);
        break;
      case "admin_new_booking":
        result = await sendAdminNewBookingNotification(data);
        break;
      case "admin_booking_cancelled":
        result = await sendAdminBookingCancelledNotification(data);
        break;
      case "invoice_issued":
        // Verificar se o usuário é admin para envio de faturas
        if (!isAdminUser && !isSystemRequest) {
          return NextResponse.json(
            {
              error:
                "Acesso negado. Apenas administradores podem enviar faturas.",
            },
            { status: 403 }
          );
        }

        if (!data.booking_id || !data.file_path) {
          console.error("[API] Dados de fatura incompletos:", data);
          return NextResponse.json(
            { error: "Dados de fatura incompletos" },
            { status: 400 }
          );
        }
        result = await sendInvoiceIssuedEmail(data.booking_id, data.file_path);
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de email não suportado" },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Email enviado com sucesso",
      });
    } else {
      return NextResponse.json(
        { error: "Falha ao enviar email" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
