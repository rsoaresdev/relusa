import { useState, useEffect } from "react";
import { supabase, LoyaltyPoints } from "@/lib/supabase/config";

interface UseLoyaltyPointsReturn {
  hasDiscount: boolean;
  loyalty: LoyaltyPoints | null;
  loading: boolean;
  error: string | null;
}

export const useLoyaltyPoints = (
  userId: string | null
): UseLoyaltyPointsReturn => {
  const [hasDiscount, setHasDiscount] = useState(false);
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (!userId) {
        setHasDiscount(false);
        setLoyalty(null);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const { data, error: loyaltyError } = await supabase
          .from("loyalty_points")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (loyaltyError && loyaltyError.code !== "PGRST116") {
          setError("Erro ao carregar pontos de fidelidade");
          return;
        }

        if (data) {
          setLoyalty(data as LoyaltyPoints);
          const hasLoyaltyDiscount =
            data.bookings_count > 0 && data.bookings_count % 5 === 4;
          setHasDiscount(hasLoyaltyDiscount);
        }
      } catch (err) {
        setError("Erro ao carregar pontos de fidelidade");
        console.error("Erro ao buscar loyalty points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyPoints();
  }, [userId]);

  return {
    hasDiscount,
    loyalty,
    loading,
    error,
  };
};
