"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star, MessageSquare, X, Car } from "lucide-react";
import { toast } from "sonner";
import { createReview, Booking } from "@/lib/supabase/config";

interface ReviewAlertProps {
  booking: Booking;
  customerName: string;
  customerEmail: string;
  onDismiss: () => void;
  onReviewSubmitted: (bookingId: string) => void;
}

export default function ReviewAlert({
  booking,
  customerName,
  customerEmail,
  onDismiss,
  onReviewSubmitted,
}: ReviewAlertProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [allowPublication, setAllowPublication] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleDismiss = () => {
    onDismiss();
  };

  // Formatar data do serviço
  const formatServiceDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma classificação de 1 a 5 estrelas.");
      return;
    }

    if (comment.length > 50) {
      toast.error("O comentário não pode exceder 50 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const review = await createReview(
        booking.id,
        rating,
        comment,
        allowPublication
      );

      if (review) {
        // Enviar email de agradecimento via API
        try {
          const response = await fetch("/api/reviews/thank-you-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reviewId: review.id,
              userEmail: customerEmail,
              userName: customerName,
              rating,
              comment: comment || undefined,
            }),
          });

          if (!response.ok) {
            console.error("Erro ao enviar email de agradecimento");
          }
        } catch (error) {
          console.error("Erro ao enviar email de agradecimento:", error);
          // Não mostrar erro ao utilizador pois a avaliação foi criada com sucesso
        }

        toast.success("Obrigado pela sua avaliação!");
        setShowDialog(false);
        onReviewSubmitted(booking.id);
      } else {
        // Verificar possíveis causas do erro
        toast.error(
          "Não foi possível submeter a avaliação. Verifique se o serviço foi concluído e se ainda não fez uma avaliação para esta marcação."
        );
      }
    } catch (error) {
      console.error("Erro ao submeter avaliação:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const serviceType =
    booking.service_type === "complete"
      ? "Lavagem Completa"
      : "Lavagem Exterior";

  if (showDialog) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Avaliar o Serviço
            </DialogTitle>
            <DialogDescription>
              Como avalia o serviço de {serviceType.toLowerCase()} realizado no
              seu {booking.car_model}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Classificação por estrelas */}
            <div className="space-y-2">
              <Label>Classificação *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rating === 1 && "Muito Insatisfeito"}
                  {rating === 2 && "Insatisfeito"}
                  {rating === 3 && "Neutro"}
                  {rating === 4 && "Satisfeito"}
                  {rating === 5 && "Muito Satisfeito"}
                </p>
              )}
            </div>

            {/* Comentário */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comentário (máx. 50 caracteres)</Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deixe o seu comentário (opcional)"
                maxLength={50}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Opcional</span>
                <span>{comment.length}/50</span>
              </div>
            </div>

            {/* Dados automáticos */}
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">Dados da Avaliação</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                <p>
                  <strong>Nome:</strong> {customerName}
                </p>
                <p>
                  <strong>Serviço:</strong> {serviceType}
                </p>
                <p>
                  <strong>Veículo:</strong> {booking.car_model}
                </p>
                <p>
                  <strong>Matrícula:</strong> {booking.car_plate}
                </p>
                <p>
                  <strong>Data:</strong> {formatServiceDate(booking.date)}
                </p>
              </div>
            </div>

            {/* Autorização para publicação */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="allow-publication"
                checked={allowPublication}
                onCheckedChange={(checked) =>
                  setAllowPublication(checked as boolean)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="allow-publication"
                  className="text-sm font-normal cursor-pointer"
                >
                  Autorizo a publicação desta avaliação na página inicial do
                  site
                </Label>
                <p className="text-xs text-muted-foreground">
                  A sua avaliação só será publicada após aprovação do
                  administrador
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmitReview}
              disabled={submitting || rating === 0}
            >
              {submitting ? "A submeter..." : "Submeter Avaliação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50 text-green-800">
      <Star className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>Serviço Concluído - Avalie a sua experiência!</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1 text-green-600 hover:text-green-800 hover:bg-green-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>
              {serviceType} foi concluído. Que tal partilhar a sua experiência?
            </span>
          </div>

          {/* Detalhes do serviço */}
          <div className="bg-white/70 p-3 rounded border border-green-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Serviço:</strong> {serviceType}
              </div>
              <div>
                <strong>Data:</strong> {formatServiceDate(booking.date)}
              </div>
              <div>
                <strong>Veículo:</strong> {booking.car_model}
              </div>
              <div>
                <strong>Matrícula:</strong> {booking.car_plate}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setShowDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Avaliar Agora
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
