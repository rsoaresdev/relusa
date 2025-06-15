"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/supabase/config";
import { format, parseISO, addHours, isBefore } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Calendar,
  Car,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Clock,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => Promise<void>;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  // Função para obter o horário baseado no time_slot
  const getTimeSlot = () => {
    switch (booking.time_slot) {
      case "morning":
        return "Manhã (9h - 12h)";
      case "afternoon":
        return "Tarde (13h - 17h)";
      case "evening":
        return "Final do dia (17h - 19h)";
      case "custom":
        return booking.custom_time || "Horário personalizado";
      default:
        return "Horário não especificado";
    }
  };

  // Função para obter o tipo de serviço
  const getServiceType = () => {
    return booking.service_type === "complete"
      ? "Lavagem Completa (Interior + Exterior)"
      : "Lavagem Exterior";
  };

  // Função para obter o preço
  const getPrice = () => {
    // Verificar se tem desconto aplicado
    if (booking.has_discount) {
      // Aplicar 50% de desconto
      return booking.service_type === "complete" ? "9€" : "6€";
    }
    // Preço normal sem desconto
    return booking.service_type === "complete" ? "18€" : "12€";
  };

  // Função para obter a cor e texto do status
  const getStatusInfo = () => {
    switch (booking.status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertCircle size={14} className="mr-1" />,
          text: "Pendente",
        };
      case "approved":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle size={14} className="mr-1" />,
          text: "Aprovada",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle size={14} className="mr-1" />,
          text: "Rejeitada",
        };
      case "started":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <Loader2 size={14} className="mr-1 animate-spin" />,
          text: "Em andamento",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle size={14} className="mr-1" />,
          text: "Concluída",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle size={14} className="mr-1" />,
          text: "Desconhecido",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Verificar se o cancelamento está dentro do prazo permitido (até 4 horas antes)
  const canCancel = () => {
    try {
      const bookingDate = parseISO(booking.date);
      let bookingHour = 9;

      if (booking.time_slot === "afternoon") {
        bookingHour = 13;
      } else if (booking.time_slot === "evening") {
        bookingHour = 17;
      } else if (booking.time_slot === "custom" && booking.custom_time) {
        const timeParts = booking.custom_time.split(":");
        if (timeParts.length >= 1) {
          bookingHour = parseInt(timeParts[0], 10);
        }
      }

      bookingDate.setHours(bookingHour, 0, 0, 0);
      const cancelDeadline = addHours(new Date(), 4);
      return isBefore(cancelDeadline, bookingDate);
    } catch {
      return false;
    }
  };

  // Função para lidar com o cancelamento
  const handleCancel = async () => {
    if (!showConfirmCancel) {
      setShowConfirmCancel(true);
      return;
    }

    setLoading(true);
    try {
      await onCancel(booking.id);
      setShowConfirmCancel(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-all">
      <CardHeader className="p-4 pb-3 flex flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <Badge className={`${statusInfo.color} flex items-center px-2 py-1 text-xs`}>
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            #{booking.id.substring(0, 8)}
          </span>
        </div>
        <Badge className="bg-primary/10 text-primary font-medium">
          {getPrice()}
        </Badge>
      </CardHeader>

      <CardContent className="p-4">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Car size={18} className="text-primary" />
          {getServiceType()}
        </h4>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <Calendar size={18} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{formatDate(booking.date)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                <Clock size={12} />
                {getTimeSlot()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <Car size={18} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{booking.car_model}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Matrícula: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{booking.car_plate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <MapPin size={18} className="text-primary flex-shrink-0" />
            <p className="text-sm">{booking.address}</p>
          </div>

          {booking.notes && (
            <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <MessageSquare size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notas:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">&quot;{booking.notes}&quot;</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {booking.status === "pending" && (
        <CardFooter className="p-4 pt-0 flex justify-center">
          <div className="w-full">
            <Separator className="mb-4" />
            {!canCancel() ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3 flex items-start w-full">
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Não é possível cancelar esta marcação. Os cancelamentos só são permitidos até 4 horas antes do horário agendado.
                </p>
              </div>
            ) : showConfirmCancel ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full py-2"
                >
                  {loading && <Loader2 size={14} className="mr-2 animate-spin" />}
                  Confirmar Cancelamento
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmCancel(false)}
                  disabled={loading}
                  className="w-full py-2"
                >
                  Voltar
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full py-2 border-red-200 hover:border-red-300"
              >
                Cancelar Marcação
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
