import { NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  sendBookingRequestEmail,
  sendBookingApprovedEmail,
  sendBookingRejectedEmail,
  sendBookingRescheduledEmail,
  sendServiceStartedEmail,
  sendServiceCompletedEmail,
  sendLoyaltyReminderEmail,
  sendContactFormEmail,
  sendAdminNewBookingNotification,
  sendAdminBookingCancelledNotification,
} from "@/lib/email/service";
import { verifyEmailConnection } from "@/lib/email/config";

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
    // Verificar se a requisição é de um administrador ou do sistema
    const systemKey = request.headers.get("x-system-key");

    const isSystemRequest = systemKey === process.env.SYSTEM_API_KEY;

    // Para o formulário de contacto, não precisamos de autenticação
    const isContactFormRequest =
      request.headers.get("x-request-type") === "contact-form";

    if (!isSystemRequest) {
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
        // Verificar se é uma requisição do formulário de contacto
        if (!isContactFormRequest) {
          return NextResponse.json(
            { error: "Não autorizado para enviar emails de contacto" },
            { status: 401 }
          );
        }

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
