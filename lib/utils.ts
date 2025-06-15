import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { supabase } from "./supabase/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera URL absoluta para o site
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.relusa.pt";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Gera URL para imagem Open Graph dinâmica
 */
export function getOgImageUrl({
  title,
  description,
  mode = "light",
}: {
  title?: string;
  description?: string;
  mode?: "light" | "dark";
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.relusa.pt";
  const params = new URLSearchParams();

  if (title) params.set("title", title);
  if (description) params.set("description", description);
  if (mode) params.set("mode", mode);

  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Formata data para o formato ISO para SEO
 */
export function formatDateForSeo(date: Date): string {
  return date.toISOString();
}

/**
 * Gera slug a partir de uma string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Gera metadados estruturados para JSON-LD
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  price: number;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Relusa",
      image: "https://www.relusa.pt/og-image.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vila Nova de Gaia",
        addressRegion: "Porto",
        addressCountry: "PT",
      },
      telephone: "+351932440827",
      priceRange: "€€",
    },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "EUR",
    },
    image: service.image,
  };
}

/**
 * Valida se uma matrícula está no formato português válido
 * Formatos válidos:
 * - XX-XX-XX (onde XX pode ser números ou letras)
 * - Letras à esquerda (AA-00-00)
 * - Letras no meio (00-AA-00)
 * - Letras à direita (00-00-AA)
 * - Letras à esquerda e direita (AA-00-AA)
 */
export function validatePortugueseLicensePlate(licensePlate: string): boolean {
  // Remover espaços em branco e normalizar
  const plate = licensePlate.trim().toUpperCase();

  // Verificar se está vazio
  if (!plate) {
    return false;
  }

  // Verificar o formato geral XX-XX-XX
  const generalFormat = /^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/;
  if (!generalFormat.test(plate)) {
    return false;
  }

  // Dividir a matrícula em partes
  const parts = plate.split("-");
  if (parts.length !== 3) {
    return false;
  }

  // Verificar os formatos específicos
  const isLetter = (str: string) => /^[A-Z]{2}$/.test(str);
  const isNumber = (str: string) => /^[0-9]{2}$/.test(str);

  // Formato 1: Letras à esquerda (AA-00-00)
  const format1 =
    isLetter(parts[0]) && isNumber(parts[1]) && isNumber(parts[2]);

  // Formato 2: Letras no meio (00-AA-00)
  const format2 =
    isNumber(parts[0]) && isLetter(parts[1]) && isNumber(parts[2]);

  // Formato 3: Letras à direita (00-00-AA)
  const format3 =
    isNumber(parts[0]) && isNumber(parts[1]) && isLetter(parts[2]);

  // Formato 4: Letras à esquerda e direita (AA-00-AA)
  const format4 =
    isLetter(parts[0]) && isNumber(parts[1]) && isLetter(parts[2]);

  return format1 || format2 || format3 || format4;
}

/**
 * Formata uma matrícula para o formato padrão XX-XX-XX
 */
export function formatLicensePlate(licensePlate: string): string {
  // Remover todos os espaços e hífens
  const cleaned = licensePlate.replace(/[\s-]/g, "").toUpperCase();

  // Se o comprimento não for 6, retornar a string original
  if (cleaned.length !== 6) {
    return licensePlate;
  }

  // Formatar como XX-XX-XX
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`;
}

// Gerar opções de horários de 30 em 30 minutos das 8:00 às 20:00
export const generateTimeOptions = (): string[] => {
  const options = [];
  for (let hour = 8; hour <= 20; hour++) {
    options.push(`${hour}:00`);
    if (hour < 20) {
      options.push(`${hour}:30`);
    }
  }
  return options;
};

// Função para determinar a janela horária com base na hora personalizada
export const getTimeSlotFromCustomTime = (
  time: string
): "morning" | "afternoon" | "evening" => {
  const hour = parseInt(time.split(":")[0]);
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 13 && hour < 17) return "afternoon";
  return "evening";
};

// Interface para disponibilidade de horários
export interface TimeSlotAvailability {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  availableCustomTimes: string[];
}

// Função para verificar disponibilidade de horários para uma data específica
export const checkDateAvailability = async (
  date: Date
): Promise<TimeSlotAvailability> => {
  const formattedDate = format(date, "yyyy-MM-dd");

  // Procurar todas as marcações para a data
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("date", formattedDate)
    .not("status", "in", '("pending", "rejected", "completed")');

  if (error) {
    throw error;
  }

  // Inicializar contadores por janela horária
  const slotCount = {
    morning: 0,
    afternoon: 0,
    evening: 0,
  };

  // Set para armazenar horários personalizados já reservados
  const reservedCustomTimes = new Set<string>();

  // Contar marcações por janela horária
  bookings.forEach((booking: any) => {
    if (booking.time_slot === "custom") {
      if (booking.custom_time) {
        reservedCustomTimes.add(booking.custom_time);
        const slot = getTimeSlotFromCustomTime(booking.custom_time);
        slotCount[slot]++;
      }
    } else {
      slotCount[booking.time_slot as keyof typeof slotCount]++;
    }
  });

  // Gerar lista de horários disponíveis
  const allTimeOptions = generateTimeOptions();
  const availableCustomTimes = allTimeOptions.filter((time) => {
    if (reservedCustomTimes.has(time)) return false;
    const slot = getTimeSlotFromCustomTime(time);
    return slotCount[slot] < 1;
  });

  // Verificar disponibilidade por janela (máximo 1 por janela, 3 por dia)
  const totalBookings = Object.values(slotCount).reduce((a, b) => a + b, 0);
  const hasReachedDailyLimit = totalBookings >= 3;

  return {
    morning: !hasReachedDailyLimit && slotCount.morning < 1,
    afternoon: !hasReachedDailyLimit && slotCount.afternoon < 1,
    evening: !hasReachedDailyLimit && slotCount.evening < 1,
    availableCustomTimes,
  };
};

// Função para verificar disponibilidade de vários dias
export const checkMonthAvailability = async (month: Date): Promise<Date[]> => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const formattedStartDate = format(startOfMonth, "yyyy-MM-dd");
  const formattedEndDate = format(endOfMonth, "yyyy-MM-dd");

  // Procurar todas as marcações do mês
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("date", formattedStartDate)
    .lte("date", formattedEndDate)
    .not("status", "in", '("pending", "rejected", "completed")');

  if (error) {
    throw error;
  }

  // Agrupar marcações por data
  const bookingsByDate = bookings.reduce(
    (acc: { [key: string]: any[] }, booking: any) => {
      if (!acc[booking.date]) {
        acc[booking.date] = [];
      }
      acc[booking.date].push(booking);
      return acc;
    },
    {}
  );

  // Encontrar datas sem disponibilidade
  const unavailableDates: Date[] = [];

  Object.entries(bookingsByDate).forEach(([date, dayBookings]) => {
    if (dayBookings.length >= 3) {
      unavailableDates.push(new Date(date));
    }
  });

  return unavailableDates;
};
