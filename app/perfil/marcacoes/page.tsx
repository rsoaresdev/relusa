"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Clock, Star, AlertCircle } from "lucide-react";
import {
  getUserBookings,
  Booking,
  getUserReviews,
  Review,
} from "@/lib/supabase/config";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [existingReviews, setExistingReviews] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (user && !authLoading) {
      // Carregar marcações e avaliações do utilizador
      const loadData = async () => {
        try {
          const [userBookings, userReviews] = await Promise.all([
            getUserBookings(user.id),
            getUserReviews(user.id),
          ]);

          setBookings(userBookings);
          setReviews(userReviews);

          // Criar set de marcações com avaliações
          const reviewsSet = new Set(
            userReviews.map((review) => review.booking_id)
          );
          setExistingReviews(reviewsSet);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          toast.error("Erro ao carregar dados.");
        } finally {
          setLoading(false);
        }
      };

      loadData();
    } else if (!authLoading && !user) {
      router.push("/marcacoes");
    }
  }, [user, authLoading, router]);

  // Função para obter o status da marcação
  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            Pendente
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Aprovada
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
            Rejeitada
          </span>
        );
      case "started":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            Em andamento
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
            Concluída
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border">
            Desconhecido
          </span>
        );
    }
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  // Função para encontrar avaliação de uma marcação
  const findReviewForBooking = (bookingId: string): Review | undefined => {
    return reviews.find((review) => review.booking_id === bookingId);
  };

  // Função para agrupar marcações por mês
  const groupBookingsByMonth = () => {
    const grouped: { [key: string]: Booking[] } = {};

    bookings.forEach((booking) => {
      const date = parseISO(booking.date);
      const monthKey = format(date, "yyyy-MM", { locale: pt });

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(booking);
    });

    // Ordenar por mês (mais recente primeiro)
    const sortedKeys = Object.keys(grouped).sort().reverse();

    return sortedKeys.map((monthKey) => ({
      monthKey,
      monthLabel: format(parseISO(monthKey + "-01"), "MMMM 'de' yyyy", {
        locale: pt,
      }),
      bookings: grouped[monthKey].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));
  };

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">({rating}/5)</span>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">As Minhas Marcações</h1>
              <p className="text-muted-foreground">
                Veja todas as suas marcações passadas e atuais.
              </p>
            </div>

            {loading && authLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    A carregar marcações...
                  </p>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Histórico de Marcações
                  </CardTitle>
                  <CardDescription>
                    Veja todas as suas marcações passadas e atuais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhuma marcação encontrada
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ainda não fez nenhuma marcação.
                      </p>
                      <Button
                        onClick={() => router.push("/marcacoes")}
                        variant="outline"
                      >
                        Fazer Primeira Marcação
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Alerta geral para avaliações pendentes */}
                      {bookings.some(
                        (booking) =>
                          booking.status === "completed" &&
                          !existingReviews.has(booking.id)
                      ) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-800">
                              Tem serviços por avaliar
                            </h4>
                          </div>
                          <p className="text-blue-700 text-sm mb-3">
                            Ajude-nos a melhorar! Avalie os serviços concluídos
                            e partilhe a sua experiência.
                          </p>
                          <Button
                            onClick={() => router.push("/perfil/avaliacoes")}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Ir para Avaliações
                          </Button>
                        </div>
                      )}

                      {/* Marcações agrupadas por mês */}
                      {groupBookingsByMonth().map(
                        ({ monthKey, monthLabel, bookings: monthBookings }) => (
                          <div key={monthKey} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                              {monthLabel}
                            </h3>

                            <div className="space-y-3">
                              {monthBookings.map((booking) => {
                                const review = findReviewForBooking(booking.id);

                                return (
                                  <div
                                    key={booking.id}
                                    className="border border-border rounded-lg p-3 sm:p-4"
                                  >
                                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-3 mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm sm:text-base truncate">
                                          {booking.service_type === "exterior"
                                            ? "Lavagem Exterior"
                                            : "Lavagem Completa"}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                          {formatDate(booking.date)}
                                        </p>
                                      </div>
                                      <div className="flex-shrink-0">
                                        {getBookingStatusBadge(booking.status)}
                                      </div>
                                    </div>

                                    <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 text-xs sm:text-sm">
                                      <div>
                                        <p className="flex items-center gap-2">
                                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                          <span className="truncate">
                                            {booking.time_slot === "custom"
                                              ? booking.custom_time
                                              : booking.time_slot === "morning"
                                              ? "Manhã (9h-12h)"
                                              : booking.time_slot ===
                                                "afternoon"
                                              ? "Tarde (12h-17h)"
                                              : "Noite (17h-20h)"}
                                          </span>
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground truncate">
                                          {booking.car_model} -{" "}
                                          {booking.car_plate}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Mostrar avaliação se existir */}
                                    {review && (
                                      <div className="mt-3 pt-3 border-t border-green-200 bg-green-50 rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-sm font-medium text-green-800">
                                            A sua avaliação:
                                          </span>
                                          {renderStars(review.rating)}
                                        </div>
                                        {review.comment && (
                                          <p className="text-sm text-green-700 italic">
                                            &quot;{review.comment}&quot;
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {booking.notes && (
                                      <div className="mt-3 pt-3 border-t border-border">
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                          <strong>Notas:</strong>{" "}
                                          {booking.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
