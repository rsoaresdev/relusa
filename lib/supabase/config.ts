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
 * Configurações otimizadas:
 * - persistSession: true - Mantém a sessão no localStorage
 * - autoRefreshToken: true - Renova automaticamente os tokens
 * - detectSessionInUrl: true - Processa URLs de callback automaticamente
 * - flowType: 'implicit' - Usar implicit flow para compatibilidade com OAuth
 * - debug: false - Desativa logs desnecessários
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit", // Voltar para implicit para OAuth funcionar
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "supabase.auth.token",
    debug: false, // Desativar debug para eliminar logs excessivos
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

// Cache simples para evitar chamadas desnecessárias
const userCache = new Map<string, { user: User; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Funções auxiliares otimizadas
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Erro ao obter sessão:", sessionError);
      return null;
    }

    if (!session?.user) {
      return null;
    }

    const userId = session.user.id;

    // Verificar cache
    const cached = userCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.user;
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Erro ao obter dados do utilizador:", userError);
      return null;
    }

    // Atualizar cache
    if (user) {
      userCache.set(userId, { user: user as User, timestamp: Date.now() });
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
      // PGRST116 = no rows returned
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

// Função para limpar cache quando necessário
export const clearUserCache = (userId?: string) => {
  if (userId) {
    userCache.delete(userId);
  } else {
    userCache.clear();
  }
};

// Função centralizada de logout para garantir limpeza completa
export const performLogout = async (): Promise<void> => {
  try {
    // Limpar cache de utilizadores
    clearUserCache();

    // Fazer logout no Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao fazer logout:", error);
    }

    // Limpar localStorage manualmente (backup)
    if (typeof window !== "undefined") {
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem(
        "sb-" + supabaseUrl.split("//")[1].split(".")[0] + "-auth-token"
      );
    }

    // Forçar refresh da página para garantir limpeza completa do estado
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Erro inesperado no logout:", error);
    // Em caso de erro, forçar refresh mesmo assim
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
};
