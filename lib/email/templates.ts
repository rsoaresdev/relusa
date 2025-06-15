// Templates de email para diferentes situações
import { User, Booking, LoyaltyPoints } from "@/lib/supabase/config";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt } from "date-fns/locale";

// Cores e estilos comuns
const styles = {
  primaryColor: "#4F7942", // Verde Relusa
  secondaryColor: "#E8F5E9", // Verde claro
  textColor: "#334155", // Cinza escuro
  accentColor: "#10b981", // Verde sucesso
  warningColor: "#f59e0b", // Amarelo
  dangerColor: "#ef4444", // Vermelho
  fontFamily: "Arial, Helvetica, sans-serif",
};

// Função para formatar a data
const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
  } catch {
    return dateString;
  }
};

// Função para obter o horário baseado no time_slot
const getTimeSlot = (timeSlot: string, customTime?: string) => {
  switch (timeSlot) {
    case "morning":
      return "Manhã (9h - 12h)";
    case "afternoon":
      return "Tarde (13h - 17h)";
    case "evening":
      return "Final do dia (17h - 19h)";
    case "custom":
      return customTime || "Horário personalizado";
    default:
      return "Horário não especificado";
  }
};

// Função para obter o tipo de serviço
const getServiceType = (serviceType: string) => {
  return serviceType === "complete"
    ? "Lavagem Completa (Interior + Exterior)"
    : "Lavagem Exterior";
};

// Função para obter o preço
const getPrice = (serviceType: string, hasDiscount: boolean) => {
  if (hasDiscount) {
    return serviceType === "complete" ? "9€" : "6€";
  }
  return serviceType === "complete" ? "18€" : "12€";
};

// Função para calcular duração entre início e fim
const calculateDuration = (
  startTime: string | null | undefined,
  endTime: string | null | undefined
) => {
  if (!startTime || !endTime) return "N/A";
  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const minutes = differenceInMinutes(end, start);

    if (minutes < 60) {
      return `${minutes} minutos`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`;
    }
  } catch {
    return "N/A";
  }
};

// Função para formatar timestamp
const formatTimestamp = (timestamp: string | null | undefined) => {
  if (!timestamp) return "N/A";
  try {
    const date = parseISO(timestamp);
    return format(date, "d 'de' MMMM, HH:mm", { locale: pt });
  } catch {
    return "Data inválida";
  }
};

// Layout base para todos os emails
const baseLayout = (content: string, title: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: ${styles.fontFamily};
          line-height: 1.6;
          color: ${styles.textColor};
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .wrapper {
          width: 100%;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 120px;
          height: auto;
          margin-bottom: 20px;
        }
        .content {
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        h1, h2, h3 {
          color: ${styles.primaryColor};
          margin-top: 0;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: ${styles.primaryColor};
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 10px 0;
          text-align: center;
        }
        .button:hover {
          background-color: #3d5a33;
        }
        .info-box {
          background-color: ${styles.secondaryColor};
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 8px 0;
          vertical-align: top;
        }
        td:first-child {
          width: 120px;
          color: #64748b;
        }
        .highlight {
          color: ${styles.primaryColor};
          font-weight: 600;
        }
        .success {
          color: ${styles.accentColor};
          font-weight: 600;
        }
        .warning {
          color: ${styles.warningColor};
          font-weight: 600;
        }
        .danger {
          color: ${styles.dangerColor};
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${styles.primaryColor};
          text-decoration: none;
          margin: 0 10px;
        }
        .social-links a:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .content {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <img src="https://www.relusa.pt/logo_rounded.png" alt="Relusa" class="logo">
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="https://www.relusa.pt" target="_blank">Website</a>
              <a href="https://instagram.com/relusa.pt" target="_blank">Instagram</a>
              <a href="https://wa.me/351932440827" target="_blank">WhatsApp</a>
            </div>
            <p>© ${new Date().getFullYear()} Relusa. Todos os direitos reservados.</p>
            <p>
              <small>
                Este email foi enviado para si porque é cliente da Relusa..
              </small>
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

// Email de boas-vindas após criação de conta
export const welcomeEmailTemplate = (user: User) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.primaryColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">👋</div>
      </div>
      <h2 style="color: ${
        styles.primaryColor
      }; margin: 0;">Bem-vindo à Relusa!</h2>
    </div>

    <p>Olá, ${user.name || "Cliente"}! 🌱</p>
    <p>Estamos muito felizes em tê-lo como cliente. A Relusa é a sua solução para lavagem automóvel ecológica, prática e de qualidade.</p>
    
    <div style="background-color: ${
      styles.secondaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Com a sua conta, você pode:</h4>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Agendar lavagens automóveis online</li>
        <li>Acompanhar o status das suas marcações</li>
        <li>Acumular pontos de fidelidade</li>
        <li>Receber ofertas exclusivas</li>
      </ul>
    </div>
    
    <div style="background-color: white; border: 2px solid ${
      styles.primaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Sabia que...</h4>
      <p style="margin: 0;">O nosso serviço de lavagem a seco ecológico utiliza apenas <span class="highlight">1 litro de água</span> por lavagem!</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b;">
        Comparado com uma lavagem tradicional que usa até 300 litros de água,
        você está ajudando a preservar o meio ambiente.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin-bottom: 20px;">Pronto para experimentar? Agende sua primeira lavagem!</p>
      <a href="https://www.relusa.pt/marcacoes" class="button">Agendar Lavagem</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; text-align: center;">
        <strong>Precisa de ajuda?</strong><br>
        Estamos aqui para ajudar! Entre em contacto através do email <a href="mailto:geral@relusa.pt" style="color: ${
          styles.primaryColor
        };">geral@relusa.pt</a>
      </p>
    </div>
  `;

  return {
    subject: "👋 Bem-vindo à Relusa! Sua lavagem ecológica",
    html: baseLayout(content, "Bem-vindo à Relusa"),
  };
};

// Email de confirmação de agendamento
export const bookingRequestEmailTemplate = (
  booking: Booking,
  userName: string
) => {
  const content = `
    <h2>Pedido de Agendamento Recebido</h2>
    <p>Olá, ${userName || "Cliente"}! 👋</p>
    <p>Recebemos o seu pedido de agendamento para uma lavagem automóvel. Estamos muito felizes em poder ajudar a manter o seu veículo impecável!</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Marcação</h3>
      <table>
        <tr>
          <td><strong>Serviço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚗</span>
              ${getServiceType(booking.service_type)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Data</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📅</span>
              ${formatDate(booking.date)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Horário</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏰</span>
              ${getTimeSlot(booking.time_slot, booking.custom_time)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Veículo</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚘</span>
              ${booking.car_model} (${booking.car_plate})
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Morada</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span>
              ${booking.address}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Preço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">💰</span>
              <strong>${getPrice(
                booking.service_type,
                booking.has_discount || false
              )}</strong>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <p>O seu pedido está em análise. Iremos confirmar a disponibilidade para o horário solicitado o mais brevemente possível.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/marcacoes" class="button">Ver Minhas Marcações</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Precisa alterar ou cancelar?</strong><br>
        Aceda à sua conta ou contacte-nos através do email <a href="mailto:geral@relusa.pt" style="color: ${
          styles.primaryColor
        };">geral@relusa.pt</a>
      </p>
    </div>
  `;

  return {
    subject: "🚗 Pedido de Agendamento Recebido - Relusa",
    html: baseLayout(content, "Pedido de Agendamento - Relusa"),
  };
};

// Email de confirmação de aprovação de agendamento
export const bookingApprovedEmailTemplate = (
  booking: Booking,
  userName: string
) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.accentColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">✓</div>
      </div>
      <h2 style="color: ${
        styles.accentColor
      }; margin: 0;">Marcação Confirmada!</h2>
    </div>

    <p>Olá, ${userName || "Cliente"}! 🎉</p>
    <p>Temos o prazer de informar que a sua marcação foi <span class="success">APROVADA</span>. Estamos ansiosos para cuidar do seu veículo!</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Marcação</h3>
      <table>
        <tr>
          <td><strong>Serviço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚗</span>
              ${getServiceType(booking.service_type)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Data</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📅</span>
              ${formatDate(booking.date)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Horário</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏰</span>
              ${getTimeSlot(booking.time_slot, booking.custom_time)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Veículo</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚘</span>
              ${booking.car_model} (${booking.car_plate})
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Morada</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span>
              ${booking.address}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Preço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">💰</span>
              <strong>${getPrice(
                booking.service_type,
                booking.has_discount || false
              )}</strong>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: ${
      styles.secondaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Preparação para o Serviço</h4>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Certifique-se de que o veículo estará disponível no horário agendado</li>
        <li>Deixe as chaves em local combinado ou esteja presente para entregá-las</li>
        <li>Remova objetos pessoais valiosos do veículo</li>
        <li>Em caso de chuva, não se preocupe - nós entraremos em contacto</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/marcacoes" class="button">Ver Minhas Marcações</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Precisa reagendar ou cancelar?</strong><br>
        Por favor, avise-nos com pelo menos 24 horas de antecedência através do email <a href="mailto:geral@relusa.pt" style="color: ${
          styles.primaryColor
        };">geral@relusa.pt</a>
      </p>
    </div>
  `;

  return {
    subject: "✅ Marcação Confirmada - Relusa",
    html: baseLayout(content, "Marcação Confirmada - Relusa"),
  };
};

// Email de rejeição de agendamento
export const bookingRejectedEmailTemplate = (
  booking: Booking,
  userName: string
) => {
  const content = `
    <h2>Marcação Não Disponível</h2>
    <p>Olá, ${userName || "Cliente"}!</p>
    <p>Lamentamos informar que não conseguimos atender ao seu pedido de marcação para a data e horário solicitados.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Marcação</h3>
      <table>
        <tr>
          <td><strong>Serviço:</strong></td>
          <td>${getServiceType(booking.service_type)}</td>
        </tr>
        <tr>
          <td><strong>Data:</strong></td>
          <td>${formatDate(booking.date)}</td>
        </tr>
        <tr>
          <td><strong>Horário:</strong></td>
          <td>${getTimeSlot(booking.time_slot, booking.custom_time)}</td>
        </tr>
      </table>
    </div>
    
    <p>Isto pode ter ocorrido devido a uma das seguintes razões:</p>
    <ul>
      <li>Indisponibilidade na data e horário solicitados</li>
      <li>A área geográfica está fora da nossa zona de cobertura</li>
      <li>Condições meteorológicas adversas previstas</li>
    </ul>
    
    <p>Convidamos você a fazer uma nova marcação para uma data alternativa.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/marcacoes" class="button">Fazer Nova Marcação</a>
    </div>
    
    <p>Pedimos desculpa pelo inconveniente. Se tiver alguma dúvida, não hesite em contactar-nos através do email <a href="mailto:geral@relusa.pt" style="color: ${
      styles.primaryColor
    };">geral@relusa.pt</a>.</p>
    
    <p>Atenciosamente,<br>Equipa Relusa</p>
  `;

  return {
    subject: "Marcação Não Disponível - Relusa",
    html: baseLayout(content, "Marcação Não Disponível - Relusa"),
  };
};

// Email de início de serviço
export const serviceStartedEmailTemplate = (
  booking: Booking,
  userName: string
) => {
  const content = `
    <h2>Serviço Iniciado</h2>
    <p>Olá, ${userName || "Cliente"}!</p>
    <p>Informamos que o serviço de lavagem do seu veículo foi <span class="highlight">INICIADO</span>.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Marcação</h3>
      <table>
        <tr>
          <td><strong>Serviço:</strong></td>
          <td>${getServiceType(booking.service_type)}</td>
        </tr>
        <tr>
          <td><strong>Veículo:</strong></td>
          <td>${booking.car_model} (${booking.car_plate})</td>
        </tr>
        <tr>
          <td><strong>Morada:</strong></td>
          <td>${booking.address}</td>
        </tr>
        <tr>
          <td><strong>Início:</strong></td>
          <td>${formatTimestamp(booking.start_time)}</td>
        </tr>
      </table>
    </div>
    
    <p>O nosso técnico está agora a realizar o serviço solicitado. Você receberá uma notificação assim que o serviço estiver concluído.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/marcacoes" class="button">Ver Detalhes</a>
    </div>
    
    <p>Se tiver alguma dúvida ou necessitar de assistência adicional, não hesite em contactar-nos através do email <a href="mailto:geral@relusa.pt" style="color: ${
      styles.primaryColor
    };">geral@relusa.pt</a>.</p>
    
    <p>Atenciosamente,<br>Equipa Relusa</p>
  `;

  return {
    subject: "Serviço Iniciado - Relusa",
    html: baseLayout(content, "Serviço Iniciado - Relusa"),
  };
};

// Email de conclusão de serviço
export const serviceCompletedEmailTemplate = (
  booking: Booking,
  userName: string
) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.accentColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">✨</div>
      </div>
      <h2 style="color: ${
        styles.accentColor
      }; margin: 0;">Serviço Concluído!</h2>
    </div>

    <p>Olá, ${userName || "Cliente"}! 🌟</p>
    <p>O seu veículo está agora limpo e pronto para uso! Esperamos que fique satisfeito com o resultado do nosso serviço.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes do Serviço</h3>
      <table>
        <tr>
          <td><strong>Serviço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚗</span>
              ${getServiceType(booking.service_type)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Veículo</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚘</span>
              ${booking.car_model} (${booking.car_plate})
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Início</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🕐</span>
              ${formatTimestamp(booking.start_time)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Conclusão</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🏁</span>
              ${formatTimestamp(booking.end_time)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Duração</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏱️</span>
              ${calculateDuration(booking.start_time, booking.end_time)}
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: ${
      styles.secondaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Dicas de Manutenção</h4>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Evite lavar o carro nos próximos 2-3 dias para manter o efeito da proteção</li>
        <li>Em caso de chuva, não se preocupe - o tratamento é resistente à água</li>
        <li>Para manter o brilho por mais tempo, evite estacionar sob árvores</li>
        <li>Recomendamos uma nova lavagem a cada 2-3 semanas</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin-bottom: 20px;">Gostou do nosso serviço? Agende sua próxima lavagem!</p>
      <a href="https://www.relusa.pt/marcacoes" class="button">Agendar Nova Lavagem</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; text-align: center;">
        <strong>A sua opinião é importante!</strong><br>
        Se tiver algum feedback ou sugestão, não hesite em contactar-nos através do email <a href="mailto:geral@relusa.pt" style="color: ${
          styles.primaryColor
        };">geral@relusa.pt</a>
      </p>
    </div>
  `;

  return {
    subject: "✨ Serviço Concluído - Relusa",
    html: baseLayout(content, "Serviço Concluído - Relusa"),
  };
};

// Email de notificação de fidelidade (próxima da 5ª lavagem)
export const loyaltyReminderEmailTemplate = (
  user: User,
  loyaltyPoints: LoyaltyPoints
) => {
  const remainingBookings = 5 - (loyaltyPoints.bookings_count % 5);

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.primaryColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">🎁</div>
      </div>
      <h2 style="color: ${
        styles.primaryColor
      }; margin: 0;">Está Quase a Ganhar um Desconto!</h2>
    </div>

    <p>Olá, ${user.name || "Cliente"}! 🌟</p>
    <p>Temos boas notícias para si! Está muito próximo de ganhar um <span class="highlight">DESCONTO DE 50%</span> na sua próxima lavagem.</p>
    
    <div style="background-color: ${
      styles.secondaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Programa de Fidelidade</h4>
      <p style="margin: 10px 0;">Já realizou <strong>${
        loyaltyPoints.bookings_count
      }</strong> lavagens connosco. Falta apenas <strong>${remainingBookings}</strong> ${
    remainingBookings === 1 ? "lavagem" : "lavagens"
  } para atingir a 5ª lavagem e receber o seu desconto de 50%!</p>
      
      <div style="background-color: white; border-radius: 8px; padding: 20px; margin-top: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          ${Array(5)
            .fill(0)
            .map((_, i) => {
              const isCompleted = loyaltyPoints.bookings_count % 5 > i;
              return `
              <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${
                  isCompleted ? styles.accentColor : "#e2e8f0"
                }; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 0 auto;">
                  ${i + 1}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                  ${isCompleted ? "✓" : ""}
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
        <div style="height: 6px; background-color: #e2e8f0; border-radius: 3px; margin-top: 5px; position: relative;">
          <div style="height: 6px; background-color: ${
            styles.accentColor
          }; border-radius: 3px; width: ${
    (loyaltyPoints.bookings_count % 5) * 25
  }%;"></div>
        </div>
      </div>
    </div>
    
    <div style="background-color: white; border: 2px solid ${
      styles.primaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Como Funciona</h4>
      <p style="margin: 0;">A cada 5 lavagens, você ganha automaticamente um desconto de 50% na próxima lavagem.</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b;">
        O desconto é aplicado automaticamente na sua próxima marcação.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin-bottom: 20px;">Não perca esta oportunidade! Agende sua próxima lavagem agora.</p>
      <a href="https://www.relusa.pt/marcacoes" class="button">Agendar Lavagem</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; text-align: center;">
        <strong>Tem dúvidas sobre o programa?</strong><br>
        Entre em contacto através do email <a href="mailto:geral@relusa.pt" style="color: ${
          styles.primaryColor
        };">geral@relusa.pt</a>
      </p>
    </div>
  `;

  return {
    subject: "🎁 Falta Pouco para Seu Desconto de 50% - Relusa",
    html: baseLayout(content, "Programa de Fidelidade - Relusa"),
  };
};

// Email de desconto de fidelidade (na 5ª lavagem)
export const loyaltyDiscountEmailTemplate = (user: User) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.accentColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">🎉</div>
      </div>
      <h2 style="color: ${
        styles.accentColor
      }; margin: 0;">Parabéns! Você Ganhou 50% de Desconto!</h2>
    </div>

    <p>Olá, ${user.name || "Cliente"}! 🌟</p>
    <p>Você atingiu a 5ª lavagem e ganhou um <span class="success">DESCONTO DE 50%</span> na sua próxima marcação! Obrigado por confiar na Relusa para cuidar do seu veículo.</p>
    
    <div style="background-color: ${
      styles.secondaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">Detalhes do Desconto</h4>
      <ul style="margin: 0; padding-left: 20px;">
        <li>50% de desconto em qualquer tipo de lavagem</li>
        <li>Válido para sua próxima marcação</li>
        <li>Desconto aplicado automaticamente</li>
        <li>Sem prazo de validade</li>
      </ul>
    </div>
    
    <div style="background-color: #f9f9f9; border: 2px solid ${
      styles.accentColor
    }; border-radius: 12px; padding: 24px; margin: 25px 0; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h4 style="margin-top: 0; color: ${
        styles.accentColor
      }; font-size: 18px; letter-spacing: 0.5px;">Preços com Desconto Exclusivo</h4>
      <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px; flex-wrap: wrap;">
        <div style="background-color: white; border-radius: 8px; padding: 16px; min-width: 140px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="margin: 0; font-size: 15px; color: #475569; font-weight: 500;">Lavagem Completa</p>
          <div style="margin: 10px 0; position: relative; display: inline-block;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8; position: absolute; top: -10px; right: -15px;"><s>18€</s></p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: ${
              styles.accentColor
            };">9€</p>
          </div>
          <p style="margin: 5px 0 0; font-size: 13px; color: #10b981;">Poupa 9€</p>
        </div>
        <div style="background-color: white; border-radius: 8px; padding: 16px; min-width: 140px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="margin: 0; font-size: 15px; color: #475569; font-weight: 500;">Lavagem Exterior</p>
          <div style="margin: 10px 0; position: relative; display: inline-block;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8; position: absolute; top: -10px; right: -15px;"><s>12€</s></p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: ${
              styles.accentColor
            };">6€</p>
          </div>
          <p style="margin: 5px 0 0; font-size: 13px; color: #10b981;">Poupa 6€</p>
        </div>
      </div>
      <p style="margin: 20px 0 0; font-size: 14px; color: #64748b; font-style: italic;">Desconto de 50% aplicado automaticamente na sua próxima marcação</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin-bottom: 20px;">Aproveite agora o seu desconto!</p>
      <a href="https://www.relusa.pt/marcacoes" class="button">Agendar com Desconto</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; text-align: center;">
        <strong>Sabia que...</strong><br>
        Após usar este desconto, você começa um novo ciclo para ganhar outro desconto de 50% na sua 5ª lavagem!
      </p>
    </div>
  `;

  return {
    subject: "🎉 Parabéns! Seu Desconto de 50% Está Disponível - Relusa",
    html: baseLayout(content, "Desconto de Fidelidade - Relusa"),
  };
};

// Email de formulário de contacto
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const contactFormEmailTemplate = (data: ContactFormData) => {
  const content = `
    <h2>Nova Mensagem de Contacto</h2>
    <p>Recebeu uma nova mensagem através do formulário de contacto do website.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Mensagem</h3>
      <table>
        <tr>
          <td><strong>Nome:</strong></td>
          <td>${data.name}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td><a href="mailto:${data.email}" style="color: ${
    styles.primaryColor
  };">${data.email}</a></td>
        </tr>
        <tr>
          <td><strong>Telefone:</strong></td>
          <td>${data.phone || "Não fornecido"}</td>
        </tr>
        <tr>
          <td><strong>Assunto:</strong></td>
          <td>${getSubjectLabel(data.subject)}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${styles.primaryColor};">Mensagem:</h4>
      <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
    </div>
    
    <p>Para responder, pode usar o botão abaixo ou responder diretamente a este email.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(
    getSubjectLabel(data.subject)
  )}" class="button">Responder</a>
    </div>
  `;

  return {
    subject: `Nova Mensagem de Contacto: ${getSubjectLabel(data.subject)}`,
    html: baseLayout(content, "Nova Mensagem de Contacto - Relusa"),
  };
};

// Função para obter o label do assunto
const getSubjectLabel = (subjectValue: string): string => {
  const subjects: Record<string, string> = {
    info_geral: "Informações Gerais",
    marcacoes_personalizadas: "Marcações Personalizadas",
    legal: "Assuntos Legais",
    parcerias: "Parcerias Comerciais",
    reclamacao: "Reclamação",
    elogio_feedback: "Elogio e Feedback",
    sugestao: "Sugestão",
    faturacao: "Faturação e Pagamentos",
    outro: "Outro Assunto",
  };

  return subjects[subjectValue] || subjectValue;
};

// Template de notificação para administrador - Novo pedido de marcação
export const adminNewBookingNotificationTemplate = (
  booking: Booking,
  userName: string,
  userEmail: string
) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.primaryColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">📋</div>
      </div>
      <h2 style="color: ${
        styles.primaryColor
      }; margin: 0;">Novo Pedido de Marcação</h2>
    </div>

    <p>Foi recebido um novo pedido de marcação na plataforma Relusa.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes do Cliente</h3>
      <table>
        <tr>
          <td><strong>Nome</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">👤</span>
              ${userName}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📧</span>
              <a href="mailto:${userEmail}" style="color: ${
    styles.primaryColor
  };">${userEmail}</a>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Marcação</h3>
      <table>
        <tr>
          <td><strong>Serviço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚗</span>
              ${getServiceType(booking.service_type)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Data</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📅</span>
              ${formatDate(booking.date)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Horário</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏰</span>
              ${getTimeSlot(booking.time_slot, booking.custom_time)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Veículo</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚘</span>
              ${booking.car_model} (${booking.car_plate})
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Morada</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span>
              ${booking.address}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Preço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">💰</span>
              <strong>${getPrice(
                booking.service_type,
                booking.has_discount || false
              )}</strong>
              ${
                booking.has_discount
                  ? ' <span style="color: ' +
                    styles.accentColor +
                    '; font-size: 12px;">(Com desconto de fidelidade)</span>'
                  : ""
              }
            </div>
          </td>
        </tr>
        ${
          booking.notes
            ? `
        <tr>
          <td><strong>Notas</strong></td>
          <td>
            <div style="display: flex; align-items: start;">
              <span style="margin-right: 8px; margin-top: 2px;">📝</span>
              <span style="font-style: italic;">"${booking.notes}"</span>
            </div>
          </td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
    
    <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid ${
      styles.warningColor
    };">
      <p style="margin: 0; font-size: 14px;">
        <strong>⚠️ Ação Necessária:</strong><br>
        Este pedido está pendente de aprovação. Aceda ao painel de administração para aprovar ou rejeitar a marcação.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/admin" class="button">Gerir Marcações</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>ID da Marcação:</strong> ${booking.id}<br>
        <strong>Data de Criação:</strong> ${formatTimestamp(booking.created_at)}
      </p>
    </div>
  `;

  return {
    subject: `🔔 Novo Pedido de Marcação - ${userName}`,
    html: baseLayout(content, "Novo Pedido de Marcação - Relusa Admin"),
  };
};

// Template de notificação para administrador - Cancelamento de marcação
export const adminBookingCancelledNotificationTemplate = (
  booking: Booking,
  userName: string,
  userEmail: string
) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.dangerColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">❌</div>
      </div>
      <h2 style="color: ${
        styles.dangerColor
      }; margin: 0;">Marcação Cancelada</h2>
    </div>

    <p>Uma marcação foi cancelada pelo cliente na plataforma Relusa.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes do Cliente</h3>
      <table>
        <tr>
          <td><strong>Nome</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">👤</span>
              ${userName}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📧</span>
              <a href="mailto:${userEmail}" style="color: ${
    styles.primaryColor
  };">${userEmail}</a>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Detalhes da Marcação Cancelada</h3>
      <table>
        <tr>
          <td><strong>Serviço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚗</span>
              ${getServiceType(booking.service_type)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Data</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📅</span>
              ${formatDate(booking.date)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Horário</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏰</span>
              ${getTimeSlot(booking.time_slot, booking.custom_time)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Veículo</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚘</span>
              ${booking.car_model} (${booking.car_plate})
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Morada</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span>
              ${booking.address}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Status</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📊</span>
              <span style="color: ${
                styles.dangerColor
              }; font-weight: 600;">Cancelada pelo cliente</span>
            </div>
          </td>
        </tr>
        ${
          booking.notes
            ? `
        <tr>
          <td><strong>Notas</strong></td>
          <td>
            <div style="display: flex; align-items: start;">
              <span style="margin-right: 8px; margin-top: 2px;">📝</span>
              <span style="font-style: italic;">"${booking.notes}"</span>
            </div>
          </td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
    
    <div style="background-color: #fee2e2; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid ${
      styles.dangerColor
    };">
      <p style="margin: 0; font-size: 14px;">
        <strong>ℹ️ Informação:</strong><br>
        Esta marcação foi cancelada pelo cliente e foi automaticamente removida do sistema. Não é necessária nenhuma ação adicional.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/admin" class="button">Ver Painel de Administração</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>ID da Marcação:</strong> ${booking.id}<br>
        <strong>Data de Cancelamento:</strong> ${formatTimestamp(
          new Date().toISOString()
        )}
      </p>
    </div>
  `;

  return {
    subject: `🚫 Marcação Cancelada - ${userName}`,
    html: baseLayout(content, "Marcação Cancelada - Relusa Admin"),
  };
};

// Template de reagendamento de marcação
export const bookingRescheduledEmailTemplate = (
  booking: Booking,
  userName: string,
  oldDate: string,
  oldTimeSlot: string,
  oldCustomTime?: string
) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: ${
        styles.warningColor
      }; display: inline-block; border-radius: 50%; width: 80px; height: 80px; margin-bottom: 20px;">
        <div style="color: white; font-size: 40px; line-height: 80px;">📅</div>
      </div>
      <h2 style="color: ${
        styles.warningColor
      }; margin: 0;">Marcação Reagendada</h2>
    </div>

    <p>Olá, ${userName || "Cliente"}!</p>
    <p>Informamos que a sua marcação foi reagendada pela nossa equipa. Pedimos desculpa por qualquer inconveniente causado.</p>
    
    <div class="info-box" style="background-color: #fef3c7; border-left: 4px solid ${
      styles.warningColor
    };">
      <h3 style="margin-top: 0; color: ${
        styles.warningColor
      };">Dados Anteriores</h3>
      <table>
        <tr>
          <td><strong>Data</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📅</span>
              ${formatDate(oldDate)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Horário</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏰</span>
              ${getTimeSlot(oldTimeSlot, oldCustomTime)}
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div class="info-box">
      <h3 style="margin-top: 0; color: ${
        styles.accentColor
      };">Nova Marcação</h3>
      <table>
        <tr>
          <td><strong>Serviço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚗</span>
              ${getServiceType(booking.service_type)}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Data</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📅</span>
              <strong style="color: ${styles.accentColor};">${formatDate(
    booking.date
  )}</strong>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Horário</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">⏰</span>
              <strong style="color: ${styles.accentColor};">${getTimeSlot(
    booking.time_slot,
    booking.custom_time
  )}</strong>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Veículo</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚘</span>
              ${booking.car_model} (${booking.car_plate})
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Morada</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span>
              ${booking.address}
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>Preço</strong></td>
          <td>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">💰</span>
              <strong>${getPrice(
                booking.service_type,
                booking.has_discount || false
              )}</strong>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: ${
      styles.secondaryColor
    }; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: ${
        styles.primaryColor
      };">📋 Preparação para o Serviço</h4>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Certifique-se de que o veículo estará disponível no novo horário agendado</li>
        <li>Deixe as chaves em local combinado ou esteja presente para entregá-las</li>
        <li>Remova objetos pessoais valiosos do veículo</li>
        <li>Em caso de chuva, não se preocupe - nós entraremos em contacto</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.relusa.pt/marcacoes" class="button">Ver Minhas Marcações</a>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Precisa de mais alterações?</strong><br>
        Por favor, contacte-nos através do email <a href="mailto:geral@relusa.pt" style="color: ${
          styles.primaryColor
        };">geral@relusa.pt</a> ou telefone <a href="tel:+351932440827" style="color: ${
    styles.primaryColor
  };">932 440 827</a>
      </p>
    </div>
    
    <p>Agradecemos a sua compreensão e esperamos vê-lo na nova data agendada!</p>
    
    <p>Atenciosamente,<br>Equipa Relusa</p>
  `;

  return {
    subject: "📅 Marcação Reagendada - Relusa",
    html: baseLayout(content, "Marcação Reagendada - Relusa"),
  };
};
