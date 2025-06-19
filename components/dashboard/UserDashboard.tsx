"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import {
  Calendar,
  LogOut,
  Plus,
  Award,
  Gift,
  PartyPopper,
  Check,
  User as UserIcon,
} from "lucide-react";
import { parseISO, addHours, isBefore } from "date-fns";
import { Booking, LoyaltyPoints, User } from "@/lib/supabase/config";
import BookingCard from "./BookingCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserDashboardProps {
  session: any;
  onLogout: () => void;
  onNewBooking: () => void;
}

export default function UserDashboard({
  session,
  onLogout,
  onNewBooking,
}: UserDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null);

  // Procurar dados do utilizador e agendamentos
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Procurar perfil do utilizador
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          throw userError;
        }

        setUser(userData as User);

        // Procurar agendamentos
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", session.user.id)
          .order("date", { ascending: false });

        if (bookingsError) {
          throw bookingsError;
        }

        setBookings(bookingsData as Booking[]);

        // Procurar pontos de fidelidade
        const { data: loyaltyData, error: loyaltyError } = await supabase
          .from("loyalty_points")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (!loyaltyError) {
          setLoyalty(loyaltyData as LoyaltyPoints);
        }
      } catch {
        toast.error("Erro ao carregar os seus dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  // Verificar se o cancelamento está dentro do prazo permitido (até 4 horas antes)
  const canCancelBooking = (booking: Booking): boolean => {
    try {
      // Obter a data da marcação
      const bookingDate = parseISO(booking.date);

      // Determinar a hora estimada com base no time_slot
      let bookingHour = 9; // Padrão para manhã

      if (booking.time_slot === "afternoon") {
        bookingHour = 13;
      } else if (booking.time_slot === "evening") {
        bookingHour = 17;
      } else if (booking.time_slot === "custom" && booking.custom_time) {
        // Para horário personalizado, extrair a hora do formato "HH:MM"
        const timeParts = booking.custom_time.split(":");
        if (timeParts.length >= 1) {
          bookingHour = parseInt(timeParts[0], 10);
        }
      }

      // Definir a hora na data da marcação
      bookingDate.setHours(bookingHour, 0, 0, 0);

      // Calcular o limite para cancelamento (4 horas antes)
      const cancelDeadline = addHours(new Date(), 4);

      // Verificar se ainda está dentro do prazo (data da marcação é posterior ao prazo limite)
      return isBefore(cancelDeadline, bookingDate);
    } catch {
      return false;
    }
  };

  // Função para cancelar uma marcação
  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Encontrar a marcação
      const bookingToCancel = bookings.find((b) => b.id === bookingId);

      if (!bookingToCancel) {
        toast.error("Marcação não encontrada.");
        return;
      }

      // Verificar se está dentro do prazo de cancelamento
      if (!canCancelBooking(bookingToCancel)) {
        toast.error(
          "Não é possível cancelar esta marcação. Os cancelamentos só são permitidos até 4 horas antes do horário agendado."
        );
        return;
      }

      // Enviar notificação ao administrador antes de cancelar
      try {
        await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            type: "admin_booking_cancelled",
            data: bookingToCancel,
          }),
        });
      } catch (error) {
        console.error("Erro ao enviar notificação ao administrador:", error);
      }

      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) {
        throw error;
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      toast.success("Marcação cancelada com sucesso!");
    } catch (error: any) {
      toast.error(
        error.message || "Erro ao cancelar marcação. Tente novamente."
      );
    }
  };

  // Função para obter o progresso de fidelidade
  const getLoyaltyProgress = () => {
    const bookingsCount = loyalty?.bookings_count || 0;
    const currentCycle = bookingsCount % 5;
    return {
      completed: currentCycle,
      remaining: 5 - currentCycle,
      hasDiscount: bookingsCount > 0 && currentCycle === 0,
      almostDiscount: currentCycle === 4,
      percentage: currentCycle * 20,
    };
  };

  const loyaltyProgress = getLoyaltyProgress();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Cabeçalho do Dashboard */}
      <Card className="mb-8 overflow-hidden border-0 shadow-md bg-gradient-to-r from-primary/90 to-primary p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <UserIcon size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                Olá, {user?.name?.split(" ")[0] || "Cliente"}
              </h3>
              <p className="text-white/80">
                Bem-vindo ao seu painel de marcações
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="gap-2 hover:bg-white/30"
            >
              <LogOut size={16} />
              Sair
            </Button>
            <Button
              size="sm"
              onClick={onNewBooking}
              className="gap-2 bg-white text-primary hover:bg-white/90"
            >
              <Plus size={16} />
              Nova Marcação
            </Button>
          </div>
        </div>
      </Card>

      {/* Programa de Fidelidade */}
      <Card className="mb-8 overflow-hidden border shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-2">
          <div className="flex items-center">
            <Award size={24} className="text-primary mr-2" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Programa de Fidelidade
            </h4>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loyaltyProgress.almostDiscount ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-4 mb-6 flex items-center">
              <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full mr-3">
                <Gift
                  size={24}
                  className="text-green-600 dark:text-green-400 flex-shrink-0"
                />
              </div>
              <div>
                <h5 className="font-medium text-green-800 dark:text-green-300 text-lg">
                  Parabéns! Você tem um desconto disponível!
                </h5>
                <p className="text-green-700 dark:text-green-400">
                  Aproveite 50% de desconto na sua próxima lavagem. Agende agora
                  mesmo!
                </p>
              </div>
            </div>
          ) : loyaltyProgress.hasDiscount ? (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 mb-6 flex items-center">
              <div className="bg-amber-100 dark:bg-amber-800/30 p-2 rounded-full mr-3">
                <PartyPopper
                  size={24}
                  className="text-amber-600 dark:text-amber-400 flex-shrink-0"
                />
              </div>
              <div>
                <h5 className="font-medium text-amber-800 dark:text-amber-300 text-lg">
                  DESCONTO JÁ USADO - NOVO CICLO!
                </h5>
                <p className="text-amber-700 dark:text-amber-400">
                  Utilizou o seu desconto de 50%! Começou um novo ciclo de
                  fidelidade.
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Acumule pontos a cada lavagem e ganhe 50% de desconto na 5ª
                lavagem!
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {loyalty?.bookings_count || 0} lavagens
                </Badge>
                {loyaltyProgress.remaining < 5 &&
                  !loyaltyProgress.hasDiscount && (
                    <Badge variant="outline" className="bg-primary/5">
                      Faltam {loyaltyProgress.remaining}{" "}
                      {loyaltyProgress.remaining === 1 ? "lavagem" : "lavagens"}
                    </Badge>
                  )}
              </div>
            </div>

            <div className="w-full md:w-auto md:min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      i < loyaltyProgress.completed
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {i < loyaltyProgress.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-full overflow-hidden">
                <div
                  className="h-2 bg-primary rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${loyaltyProgress.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* As Suas Marcações */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-2">
          <div className="flex items-center">
            <Calendar size={20} className="text-primary mr-2" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              As Suas Marcações
            </h4>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Você ainda não tem marcações agendadas.
              </p>
              <Button onClick={onNewBooking} className="px-6">
                Agendar Lavagem
              </Button>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
