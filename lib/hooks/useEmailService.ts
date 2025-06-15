"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { Booking } from "@/lib/supabase/config";

type EmailType =
  | "welcome"
  | "booking_request"
  | "booking_approved"
  | "booking_rejected"
  | "service_started"
  | "service_completed"
  | "loyalty_reminder"
  | "admin_new_booking"
  | "admin_booking_cancelled";

interface SendEmailOptions {
  type: EmailType;
  data: any;
}

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);

  // Função para enviar email
  const sendEmail = async ({ type, data }: SendEmailOptions) => {
    setLoading(true);

    try {
      // Obter token de autenticação
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Utilizador não autenticado");
      }

      // Fazer requisição para a API de email
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ type, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar email");
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao enviar email",
      };
    } finally {
      setLoading(false);
    }
  };

  // Funções específicas para cada tipo de email
  const sendWelcomeEmail = async (userData: any) => {
    return await sendEmail({ type: "welcome", data: userData });
  };

  const sendBookingRequestEmail = async (booking: Booking) => {
    return await sendEmail({ type: "booking_request", data: booking });
  };

  const sendBookingApprovedEmail = async (booking: Booking) => {
    return await sendEmail({ type: "booking_approved", data: booking });
  };

  const sendBookingRejectedEmail = async (booking: Booking) => {
    return await sendEmail({ type: "booking_rejected", data: booking });
  };

  const sendServiceStartedEmail = async (booking: Booking) => {
    return await sendEmail({ type: "service_started", data: booking });
  };

  const sendServiceCompletedEmail = async (booking: Booking) => {
    return await sendEmail({ type: "service_completed", data: booking });
  };

  const sendLoyaltyReminderEmail = async (userId: string) => {
    if (!userId) {
      return {
        success: false,
        error: "ID de utilizador não fornecido",
      };
    }
    return await sendEmail({ type: "loyalty_reminder", data: { userId } });
  };

  // Funções para notificações de administrador
  const sendAdminNewBookingNotification = async (booking: Booking) => {
    return await sendEmail({ type: "admin_new_booking", data: booking });
  };

  const sendAdminBookingCancelledNotification = async (booking: Booking) => {
    return await sendEmail({ type: "admin_booking_cancelled", data: booking });
  };

  // Verificar conexão com o servidor de email (apenas para administradores)
  const checkEmailConnection = async () => {
    setLoading(true);

    try {
      // Obter token de autenticação
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Utilizador não autenticado");
      }

      // Fazer requisição para a API de email
      const response = await fetch("/api/email", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao verificar conexão de email");
      }

      return {
        success: true,
        connected: result.connected,
        message: result.message,
      };
    } catch (error: any) {
      return {
        success: false,
        connected: false,
        error: error.message || "Erro ao verificar conexão de email",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendEmail,
    sendWelcomeEmail,
    sendBookingRequestEmail,
    sendBookingApprovedEmail,
    sendBookingRejectedEmail,
    sendServiceStartedEmail,
    sendServiceCompletedEmail,
    sendLoyaltyReminderEmail,
    sendAdminNewBookingNotification,
    sendAdminBookingCancelledNotification,
    checkEmailConnection,
  };
};
