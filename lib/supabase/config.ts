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
 * Configuração simplificada e confiável para evitar problemas de autenticação
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce", // Usar PKCE flow que é mais seguro e confiável
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    debug: false,
  },
  global: {
    headers: {
      "X-Client-Info": "relusa-webapp",
    },
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
