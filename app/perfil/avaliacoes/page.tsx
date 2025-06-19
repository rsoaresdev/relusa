"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Star, Info } from "lucide-react";
import {
  getUserReviews,
  Review,
  getUserBookings,
  Booking,
} from "@/lib/supabase/config";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import ReviewAlert from "@/components/reviews/ReviewAlert";

export default function ReviewsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedBookings, setDismissedBookings] = useState<string[]>([]);

  // Função para recarregar dados quando uma avaliação é submetida
  const handleReviewSubmitted = async () => {
    try {
      const [userReviews, userBookings] = await Promise.all([
        getUserReviews(user!.id),
        getUserBookings(user!.id),
      ]);
      setReviews(userReviews);
      setBookings(userBookings);
      toast.success("Avaliação submetida com sucesso!");
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    }
  };

  // Função para dispensar um alerta de avaliação
  const handleDismissReview = (bookingId: string) => {
    setDismissedBookings((prev) => [...prev, bookingId]);
  };

  useEffect(() => {
    if (user && !authLoading) {
      // Carregar avaliações e marcações do utilizador
      const loadData = async () => {
        try {
          const [userReviews, userBookings] = await Promise.all([
            getUserReviews(user.id),
            getUserBookings(user.id),
          ]);
          setReviews(userReviews);
          setBookings(userBookings);
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

  // Função para obter marcações que podem ser avaliadas
  const getBookingsToReview = () => {
    const reviewedBookingIds = new Set(
      reviews.map((review) => review.booking_id)
    );
    return bookings.filter(
      (booking) =>
        booking.status === "completed" &&
        !reviewedBookingIds.has(booking.id) &&
        !dismissedBookings.includes(booking.id)
    );
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

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
      </div>
    );
  };

  // Função para obter o status da avaliação
  const getReviewStatusBadge = (review: Review) => {
    if (!review.is_active) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          Inativa
        </span>
      );
    }

    if (!review.is_approved) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
          Pendente Aprovação
        </span>
      );
    }

    if (review.allow_publication) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
          Publicada
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200">
        Aprovada (Privada)
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">As Minhas Avaliações</h1>
              <p className="text-muted-foreground">
                Veja todas as avaliações que submeteu.
              </p>
            </div>

            {/* Aviso sobre edição */}
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Informação Importante</AlertTitle>
              <AlertDescription>
                Após submeter uma avaliação, esta não pode ser editada nem
                apagada. Para mais informações, consulte os nossos{" "}
                <a href="/termos" className="underline hover:no-underline">
                  Termos de Uso
                </a>
                .
              </AlertDescription>
            </Alert>

            {loading && authLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    A carregar avaliações...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Secção para avaliar serviços pendentes */}
                {getBookingsToReview().length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Avaliar Serviços Concluídos
                      </CardTitle>
                      <CardDescription>
                        Avalie os serviços que ainda não foram avaliados.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {getBookingsToReview().map((booking) => (
                        <ReviewAlert
                          key={booking.id}
                          booking={booking}
                          customerName={user?.name || "Cliente"}
                          customerEmail={user?.email || ""}
                          onDismiss={() => handleDismissReview(booking.id)}
                          onReviewSubmitted={() => handleReviewSubmitted()}
                        />
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Histórico de avaliações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Histórico de Avaliações
                    </CardTitle>
                    <CardDescription>
                      Todas as avaliações que submeteu para os nossos serviços.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Nenhuma avaliação encontrada
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Ainda não submeteu nenhuma avaliação. As avaliações
                          aparecem após completar um serviço.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border border-border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-base mb-1">
                                  {review.car_model}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Avaliado em {formatDate(review.created_at)}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                {getReviewStatusBadge(review)}
                              </div>
                            </div>

                            {/* Classificação */}
                            <div className="mb-3">
                              {renderStars(review.rating)}
                            </div>

                            {/* Comentário */}
                            {review.comment && (
                              <div className="mb-3">
                                <p className="text-sm italic text-gray-700">
                                  &quot;{review.comment}&quot;
                                </p>
                              </div>
                            )}

                            {/* Informações adicionais */}
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>
                                <strong>Cliente:</strong> {review.customer_name}
                              </p>
                              {review.allow_publication && (
                                <p>
                                  <strong>Publicação autorizada:</strong> Sim
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
