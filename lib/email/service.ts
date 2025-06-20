// Serviço de envio de emails
import { emailTransporter, emailDefaults } from "./config";
import {
  welcomeEmailTemplate,
  bookingRequestEmailTemplate,
  bookingApprovedEmailTemplate,
  bookingRejectedEmailTemplate,
  bookingRescheduledEmailTemplate,
  serviceStartedEmailTemplate,
  serviceCompletedEmailTemplate,
  loyaltyReminderEmailTemplate,
  contactFormEmailTemplate,
  adminNewBookingNotificationTemplate,
  adminBookingCancelledNotificationTemplate,
  invoiceIssuedEmailTemplate,
  reviewThankYouEmailTemplate,
  serviceCompletedWithReviewRequestEmailTemplate,
  adminNewReviewNotificationEmailTemplate,
  ContactFormData,
} from "./templates";
import { User, Booking, LoyaltyPoints } from "@/lib/supabase/config";
import { createClient } from "@supabase/supabase-js";

// Criar um cliente Supabase com a chave de serviço para acesso administrativo
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

// Função para obter dados do utilizador
const getUserData = async (userId: string): Promise<User | null> => {
  if (!userId) {
    console.error("[getUserData] UserId não fornecido");
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[getUserData] Erro ao buscar utilizador:", error);
      return null;
    }

    if (!data) {
      console.error("[getUserData] Utilizador não encontrado:", userId);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("[getUserData] Erro inesperado:", error);
    return null;
  }
};

// Função para obter pontos de fidelidade
const getLoyaltyPoints = async (
  userId: string
): Promise<LoyaltyPoints | null> => {
  if (!userId) return null;

  const { data, error } = await supabaseAdmin
    .from("loyalty_points")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;

  return data as LoyaltyPoints;
};

// Função genérica para enviar email com retry
const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
  maxRetries: number = 3
) => {
  if (!to || !subject || !html) {
    console.error("[sendEmail] Parâmetros obrigatórios em falta:", {
      to: !!to,
      subject: !!subject,
      html: !!html,
    });
    return false;
  }

  const mailOptions = {
    ...emailDefaults,
    to,
    subject,
    html,
    replyTo: replyTo || emailDefaults.replyTo,
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[sendEmail] Tentativa ${attempt}/${maxRetries} - Enviando email para:`,
        to,
        "Assunto:",
        subject
      );

      await emailTransporter.sendMail(mailOptions);
      console.log("[sendEmail] Email enviado com sucesso para:", to);
      return true;
    } catch (error: any) {
      console.error(
        `[sendEmail] Erro na tentativa ${attempt}/${maxRetries}:`,
        error
      );

      // Se é um erro de timeout ou conectividade, tentar novamente
      const isRetryableError =
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET" ||
        error.code === "ENOTFOUND" ||
        error.message?.includes("Greeting never received");

      if (attempt < maxRetries && isRetryableError) {
        const delay = attempt * 2000; // Delay progressivo: 2s, 4s, 6s
        console.log(
          `[sendEmail] Aguardando ${delay}ms antes da próxima tentativa...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Se chegou aqui, todas as tentativas falharam
      console.error("[sendEmail] Todas as tentativas falharam para:", to);
      return false;
    }
  }

  return false;
};

// Enviar email de boas-vindas
export const sendWelcomeEmail = async (user: User) => {
  try {
    // Verificar se temos todos os dados necessários do utilizador
    if (!user || !user.email || !user.name) return false;

    const { subject, html } = welcomeEmailTemplate(user);
    return await sendEmail(user.email, subject, html);
  } catch {
    return false;
  }
};

// Enviar email de confirmação de agendamento
export const sendBookingRequestEmail = async (booking: Booking) => {
  const user = await getUserData(booking.user_id);
  if (!user) return false;

  const { subject, html } = bookingRequestEmailTemplate(booking, user.name);
  return await sendEmail(user.email, subject, html);
};

// Enviar email de aprovação de agendamento
export const sendBookingApprovedEmail = async (booking: Booking) => {
  try {
    if (!booking || !booking.user_id) {
      console.error("[sendBookingApprovedEmail] Dados de booking inválidos");
      return false;
    }

    const user = await getUserData(booking.user_id);
    if (!user) {
      console.error(
        "[sendBookingApprovedEmail] Utilizador não encontrado para booking:",
        booking.id
      );
      return false;
    }

    const { subject, html } = bookingApprovedEmailTemplate(booking, user.name);
    return await sendEmail(user.email, subject, html);
  } catch (error) {
    console.error("[sendBookingApprovedEmail] Erro:", error);
    return false;
  }
};

// Enviar email de rejeição de agendamento
export const sendBookingRejectedEmail = async (booking: Booking) => {
  try {
    if (!booking || !booking.user_id) {
      console.error("[sendBookingRejectedEmail] Dados de booking inválidos");
      return false;
    }

    const user = await getUserData(booking.user_id);
    if (!user) {
      console.error(
        "[sendBookingRejectedEmail] Utilizador não encontrado para booking:",
        booking.id
      );
      return false;
    }

    const { subject, html } = bookingRejectedEmailTemplate(booking, user.name);
    return await sendEmail(user.email, subject, html);
  } catch (error) {
    console.error("[sendBookingRejectedEmail] Erro:", error);
    return false;
  }
};

// Enviar email de reagendamento de marcação
export const sendBookingRescheduledEmail = async (
  booking: Booking,
  oldDate: string,
  oldTimeSlot: string,
  oldCustomTime?: string
) => {
  const user = await getUserData(booking.user_id);
  if (!user) return false;

  const { subject, html } = bookingRescheduledEmailTemplate(
    booking,
    user.name,
    oldDate,
    oldTimeSlot,
    oldCustomTime
  );
  return await sendEmail(user.email, subject, html);
};

// Enviar email de início de serviço
export const sendServiceStartedEmail = async (booking: Booking) => {
  const user = await getUserData(booking.user_id);
  if (!user) return false;

  const { subject, html } = serviceStartedEmailTemplate(booking, user.name);
  return await sendEmail(user.email, subject, html);
};

// Enviar email de conclusão de serviço
export const sendServiceCompletedEmail = async (booking: Booking) => {
  const user = await getUserData(booking.user_id);
  if (!user) return false;

  const { subject, html } = serviceCompletedEmailTemplate(booking, user.name);
  return await sendEmail(user.email, subject, html);
};

// Enviar email de lembrete de fidelidade (quando falta 1 para a 5ª lavagem)
export const sendLoyaltyReminderEmail = async (userId: string) => {
  if (!userId) return false;

  const user = await getUserData(userId);
  if (!user) return false;

  const loyaltyPoints = await getLoyaltyPoints(userId);
  if (!loyaltyPoints) return false;

  // Só envia o lembrete quando falta 1 lavagem para completar o ciclo (na 4ª lavagem)
  // bookings_count % 5 === 4 significa que é a 4ª lavagem
  if (loyaltyPoints.bookings_count % 5 === 4) {
    const { subject, html } = loyaltyReminderEmailTemplate(user, loyaltyPoints);
    return await sendEmail(user.email, subject, html);
  }

  return false;
};

// Enviar email de formulário de contacto
export const sendContactFormEmail = async (data: ContactFormData) => {
  try {
    // Validar dados do formulário
    if (!data.name || !data.email || !data.message) return false;

    const { subject, html } = contactFormEmailTemplate(data);

    // Enviar para o email da empresa com resposta para o email do cliente
    return await sendEmail("geral@relusa.pt", subject, html, data.email);
  } catch {
    return false;
  }
};

// Enviar notificação para administrador sobre novo pedido de marcação
export const sendAdminNewBookingNotification = async (booking: Booking) => {
  try {
    const user = await getUserData(booking.user_id);
    if (!user) return false;

    const { subject, html } = adminNewBookingNotificationTemplate(
      booking,
      user.name,
      user.email
    );

    // Enviar para o email administrativo
    return await sendEmail("geral@relusa.pt", subject, html);
  } catch {
    return false;
  }
};

// Enviar notificação para administrador sobre cancelamento de marcação
export const sendAdminBookingCancelledNotification = async (
  booking: Booking
) => {
  try {
    const user = await getUserData(booking.user_id);
    if (!user) return false;

    const { subject, html } = adminBookingCancelledNotificationTemplate(
      booking,
      user.name,
      user.email
    );

    // Enviar para o email administrativo
    return await sendEmail("geral@relusa.pt", subject, html);
  } catch {
    return false;
  }
};

// Enviar email de fatura emitida com anexo
export const sendInvoiceIssuedEmail = async (
  bookingId: string,
  filePath: string
) => {
  try {
    // Obter dados da marcação
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error(
        "[sendInvoiceIssuedEmail] Erro ao obter booking:",
        bookingError
      );
      return false;
    }

    // Obter dados do utilizador
    const user = await getUserData(booking.user_id);
    if (!user) {
      console.error("[sendInvoiceIssuedEmail] Utilizador não encontrado");
      return false;
    }

    // Obter URL assinada para o ficheiro
    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from("invoices")
      .createSignedUrl(filePath, 60 * 60 * 24); // 24 horas

    if (urlError || !urlData?.signedUrl) {
      console.error(
        "[sendInvoiceIssuedEmail] Erro ao gerar URL assinada:",
        urlError
      );
      return false;
    }

    // Fazer download do ficheiro para anexar ao email
    const response = await fetch(urlData.signedUrl);
    if (!response.ok) {
      console.error(
        `[sendInvoiceIssuedEmail] Erro no download: ${response.status} ${response.statusText}`
      );
      return false;
    }
    const buffer = await response.arrayBuffer();

    const { subject, html } = invoiceIssuedEmailTemplate(
      booking as Booking,
      user.name
    );

    // Opções de email com anexo
    const mailOptions = {
      ...emailDefaults,
      to: user.email,
      subject,
      html,
      attachments: [
        {
          filename: `fatura_${bookingId}.pdf`,
          content: Buffer.from(buffer),
          contentType: "application/pdf",
        },
      ],
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de fatura emitida:", error);
    return false;
  }
};

// Enviar email de agradecimento por avaliação
export const sendReviewThankYouEmail = async (
  userEmail: string,
  userName: string,
  rating: number,
  comment?: string
) => {
  try {
    const { subject, html } = reviewThankYouEmailTemplate(
      userName,
      rating,
      comment
    );
    return await sendEmail(userEmail, subject, html);
  } catch (error) {
    console.error(
      "Erro ao enviar email de agradecimento por avaliação:",
      error
    );
    return false;
  }
};

// Função para enviar emails do sistema (apenas para uso no servidor)
export const sendSystemEmail = async (type: string, data: any) => {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-system-key": process.env.SYSTEM_API_KEY!,
      },
      body: JSON.stringify({ type, data }),
    });

    const result = await response.json();
    return response.ok && result.success;
  } catch {
    return false;
  }
};

// Enviar email de conclusão de serviço solicitando avaliação
export const sendServiceCompletedWithReviewRequestEmail = async (
  booking: Booking
) => {
  try {
    if (!booking || !booking.user_id) {
      console.error(
        "[sendServiceCompletedWithReviewRequestEmail] Dados de booking inválidos"
      );
      return false;
    }

    const user = await getUserData(booking.user_id);
    if (!user) {
      console.error(
        "[sendServiceCompletedWithReviewRequestEmail] Utilizador não encontrado para booking:",
        booking.id
      );
      return false;
    }

    const { subject, html } = serviceCompletedWithReviewRequestEmailTemplate(
      booking,
      user.name
    );
    return await sendEmail(user.email, subject, html);
  } catch (error) {
    console.error("[sendServiceCompletedWithReviewRequestEmail] Erro:", error);
    return false;
  }
};

// Enviar email para administrador quando há nova avaliação pendente
export const sendAdminNewReviewNotificationEmail = async (
  review: any,
  userName: string,
  serviceName: string
) => {
  if (!review) return false;

  const { subject, html } = adminNewReviewNotificationEmailTemplate(
    review,
    userName,
    serviceName
  );
  return await sendEmail("geral@relusa.pt", subject, html);
};
