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
  if (!userId) return null;

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  if (!data) return null;

  return data as User;
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

// Função genérica para enviar email
const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  replyTo?: string
) => {
  const mailOptions = {
    ...emailDefaults,
    to,
    subject,
    html,
    replyTo: replyTo || emailDefaults.replyTo,
  };

  await emailTransporter.sendMail(mailOptions);
  return true;
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
  const user = await getUserData(booking.user_id);
  if (!user) return false;

  const { subject, html } = bookingApprovedEmailTemplate(booking, user.name);
  return await sendEmail(user.email, subject, html);
};

// Enviar email de rejeição de agendamento
export const sendBookingRejectedEmail = async (booking: Booking) => {
  const user = await getUserData(booking.user_id);
  if (!user) return false;

  const { subject, html } = bookingRejectedEmailTemplate(booking, user.name);
  return await sendEmail(user.email, subject, html);
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
  // bookings_count % 5 === 3 significa que é a 4ª lavagem (contando a partir de 0)
  if (loyaltyPoints.bookings_count % 5 === 3) {
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
