import { createClient } from "@supabase/supabase-js";

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis de ambiente do Supabase não definidas. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

/**
 * Cliente Supabase configurado para a aplicação
 *
 * Configuração otimizada para manter sessões estáveis e sincronizadas entre tabs
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce", // Usar PKCE flow que é mais seguro e confiável
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    debug: process.env.NODE_ENV === "development",
    storageKey: "relusa-auth",
  },
  global: {
    headers: {
      "X-Client-Info": "relusa-webapp",
    },
  },
  // Configurações de rede para maior estabilidade
  realtime: {
    timeout: 60000, // 60 segundos
    heartbeatIntervalMs: 30000, // 30 segundos
  },
});

// Tipos para as tabelas do Supabase
export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  service_type: "exterior" | "complete";
  date: string;
  time_slot: "morning" | "afternoon" | "evening" | "custom";
  custom_time?: string;
  car_plate: string;
  car_model: string;
  address: string;
  status: "pending" | "approved" | "rejected" | "started" | "completed";
  notes?: string;
  nif?: string;
  start_time?: string | null;
  end_time?: string | null;
  has_discount?: boolean;
  is_foreign_plate?: boolean;
  created_at: string;
  updated_at: string;
};

export type LoyaltyPoints = {
  id: string;
  user_id: string;
  points: number;
  bookings_count: number;
  created_at: string;
  updated_at: string | null;
};

export type Invoice = {
  id: string;
  booking_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  customer_name: string;
  car_model: string;
  allow_publication: boolean;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Funções auxiliares simplificadas
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Erro ao obter dados do utilizador:", error);
      return null;
    }

    return user as User | null;
  } catch (error) {
    console.error("Erro inesperado ao obter utilizador:", error);
    return null;
  }
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao obter marcações:", error);
      return [];
    }

    return data as Booking[];
  } catch (error) {
    console.error("Erro inesperado ao obter marcações:", error);
    return [];
  }
};

export const getUserLoyalty = async (
  userId: string
): Promise<LoyaltyPoints | null> => {
  try {
    const { data, error } = await supabase
      .from("loyalty_points")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao obter pontos de fidelidade:", error);
      return null;
    }

    if (!data) {
      // Criar novo registo se não existir
      const { data: newData, error: insertError } = await supabase
        .from("loyalty_points")
        .insert([{ user_id: userId, points: 0, bookings_count: 0 }])
        .select()
        .single();

      if (insertError) {
        console.error("Erro ao criar pontos de fidelidade:", insertError);
        return null;
      }

      return newData as LoyaltyPoints;
    }

    return data as LoyaltyPoints;
  } catch (error) {
    console.error("Erro inesperado ao obter pontos de fidelidade:", error);
    return null;
  }
};

export const getUserInvoices = async (userId: string): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao obter faturas:", error);
      return [];
    }

    return data as Invoice[];
  } catch (error) {
    console.error("Erro inesperado ao obter faturas:", error);
    return [];
  }
};

export const getInvoiceSignedUrl = async (
  filePath: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from("invoices")
      .createSignedUrl(filePath, 60 * 60); // 1 hora

    if (error) {
      console.error("Erro ao gerar URL assinada:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Erro inesperado ao gerar URL assinada:", error);
    return null;
  }
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Erro ao verificar admin:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Erro inesperado ao verificar admin:", error);
    return false;
  }
};

// Funções para gestão de reviews
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao obter avaliações:", error);
      return [];
    }

    return data as Review[];
  } catch (error) {
    console.error("Erro inesperado ao obter avaliações:", error);
    return [];
  }
};

export const getBookingReview = async (
  userId: string,
  bookingId: string
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("booking_id", bookingId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao obter avaliação:", error);
      return null;
    }

    return data as Review | null;
  } catch (error) {
    console.error("Erro inesperado ao obter avaliação:", error);
    return null;
  }
};

export const getPublicReviews = async (): Promise<Review[]> => {
  try {
    // Sempre usar API route para consistência
    const response = await fetch("/api/reviews/public", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Erro ao obter avaliações públicas via API");
      return [];
    }

    const data = await response.json();
    return data.reviews as Review[];
  } catch (error) {
    console.error("Erro inesperado ao obter avaliações públicas:", error);
    return [];
  }
};

export const createReview = async (
  bookingId: string,
  rating: number,
  comment: string,
  allowPublication: boolean
): Promise<Review | null> => {
  try {
    // Primeiro, obter o utilizador autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Erro de autenticação:", authError);
      return null;
    }

    // Obter dados do booking para preencher automaticamente
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, users(name)")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Erro ao obter dados da marcação:", bookingError);
      return null;
    }

    // Verificar se o booking pertence ao utilizador autenticado
    if (booking.user_id !== user.id) {
      console.error("Utilizador não autorizado para esta marcação");
      return null;
    }

    // Verificar se o serviço foi concluído
    if (booking.status !== "completed") {
      console.error("Só é possível avaliar serviços concluídos");
      return null;
    }

    // Verificar se já existe uma avaliação para esta marcação
    const existingReview = await getBookingReview(user.id, bookingId);
    if (existingReview) {
      console.error("Já existe uma avaliação para esta marcação");
      return null;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          user_id: user.id,
          booking_id: bookingId,
          rating,
          comment: comment.trim() || null,
          customer_name: booking.users?.name || "Cliente",
          car_model: booking.car_model,
          allow_publication: allowPublication,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar avaliação:", error);
      return null;
    }

    return data as Review;
  } catch (error) {
    console.error("Erro inesperado ao criar avaliação:", error);
    return null;
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao obter todas as avaliações:", error);
      return [];
    }

    return data as Review[];
  } catch (error) {
    console.error("Erro inesperado ao obter todas as avaliações:", error);
    return [];
  }
};

export const updateReviewStatus = async (
  reviewId: string,
  isApproved?: boolean,
  isActive?: boolean
): Promise<boolean> => {
  try {
    const updateData: Partial<Review> = {};

    if (isApproved !== undefined) updateData.is_approved = isApproved;
    if (isActive !== undefined) updateData.is_active = isActive;

    // Para operações administrativas, usar RPC ou bypass RLS
    const { error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", reviewId);

    if (error) {
      console.error("Erro ao atualizar status da avaliação:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro inesperado ao atualizar status da avaliação:", error);
    return false;
  }
};

export const updateReview = async (
  reviewId: string,
  customerName: string,
  carModel: string,
  rating: number,
  comment: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("reviews")
      .update({
        customer_name: customerName,
        car_model: carModel,
        rating,
        comment: comment.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (error) {
      console.error("Erro ao atualizar avaliação:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro inesperado ao atualizar avaliação:", error);
    return false;
  }
};
