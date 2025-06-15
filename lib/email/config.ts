// Configuração do serviço de email
import nodemailer from "nodemailer";

// Configuração do transporte de email
export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Configuração padrão de emails
export const emailDefaults = {
  from: process.env.EMAIL_FROM,
  replyTo: process.env.EMAIL_REPLY_TO,
};

// Função para verificar a conexão com o servidor SMTP
export async function verifyEmailConnection() {
  try {
    await emailTransporter.verify();
    return true;
  } catch {
    return false;
  }
}
