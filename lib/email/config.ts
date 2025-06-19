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
  // Configurações para resolver problemas de timeout e conectividade
  connectionTimeout: 60000, // 60 segundos
  greetingTimeout: 30000, // 30 segundos
  socketTimeout: 60000, // 60 segundos
  // Configurações adicionais para melhor compatibilidade
  tls: {
    // Não falhar em certificados inválidos
    rejectUnauthorized: false,
    // Versões TLS suportadas
    minVersion: "TLSv1.2",
  },
  // Pool de conexões para melhor performance
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  // Retry automático
  retryDelay: 3000,
  maxRetries: 3,
} as any);

// Configuração padrão de emails
export const emailDefaults = {
  from: process.env.EMAIL_FROM,
  replyTo: process.env.EMAIL_REPLY_TO,
};

// Função para verificar a conexão com o servidor SMTP
export async function verifyEmailConnection() {
  try {
    console.log("[verifyEmailConnection] Testando conexão SMTP...");
    await emailTransporter.verify();
    console.log("[verifyEmailConnection] Conexão SMTP verificada com sucesso");
    return true;
  } catch (error) {
    console.error("[verifyEmailConnection] Erro na verificação SMTP:", error);
    return false;
  }
}
