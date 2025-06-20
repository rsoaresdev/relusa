import { useState, useEffect } from "react";
import { supabase, User, Booking, LoyaltyPoints } from "@/lib/supabase/config";

interface UseUserDataReturn {
  user: User | null;
  bookings: Booking[];
  loyalty: LoyaltyPoints | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useUserData = (userId: string | null): UseUserDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userId) {
      setUser(null);
      setBookings([]);
      setLoyalty(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Fazer todas as chamadas em paralelo
      const [userResult, bookingsResult, loyaltyResult] = await Promise.allSettled([
        supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single(),
        supabase
          .from("bookings")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false }),
        supabase
          .from("loyalty_points")
          .select("*")
          .eq("user_id", userId)
          .single()
      ]);

      // Processar resultados
      if (userResult.status === "fulfilled" && !userResult.value.error) {
        setUser(userResult.value.data as User);
      }

      if (bookingsResult.status === "fulfilled" && !bookingsResult.value.error) {
        setBookings(bookingsResult.value.data as Booking[]);
      }

      if (loyaltyResult.status === "fulfilled" && !loyaltyResult.value.error) {
        setLoyalty(loyaltyResult.value.data as LoyaltyPoints);
      }
    } catch (err) {
      setError("Erro ao carregar dados do utilizador");
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return {
    user,
    bookings,
    loyalty,
    loading,
    error,
    refreshData,
  };
}; 