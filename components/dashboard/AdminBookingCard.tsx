"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Booking, supabase } from "@/lib/supabase/config";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  CheckSquare,
  User,
  CalendarClock,
  FileText,
  Upload,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import RescheduleDialog from "./RescheduleDialog";
import InvoiceUpload from "./InvoiceUpload";

interface AdminBookingCardProps {
  booking: Booking & {
    user_name?: string;
    user_email?: string;
  };
  onStatusChange: (
    bookingId: string,
    status: string,
    startTime?: Date,
    endTime?: Date
  ) => Promise<boolean>;
  onReschedule?: (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    oldDate: string,
    oldTimeSlot: string,
    newCustomTime?: string,
    oldCustomTime?: string
  ) => Promise<boolean>;
}

export default function AdminBookingCard({
  booking,
  onStatusChange,
  onReschedule,
}: AdminBookingCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "completed" | "pending" | "approved" | "rejected" | "started"
  >(booking.status);
  const [currentBooking, setCurrentBooking] = useState(booking);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [invoiceUploadOpen, setInvoiceUploadOpen] = useState(false);
  const [hasInvoice, setHasInvoice] = useState(false);
  const [checkingInvoice, setCheckingInvoice] = useState(false);

  // Verificar se já existe fatura para esta marcação
  useEffect(() => {
    const checkExistingInvoice = async () => {
      if (booking.status === "completed") {
        setCheckingInvoice(true);
        try {
          const { data, error } = await supabase
            .from("invoices")
            .select("id")
            .eq("booking_id", booking.id)
            .single();

          if (!error && data) {
            setHasInvoice(true);
          }
        } catch (error) {
          // Ignorar erros - pode não ter fatura ainda
        } finally {
          setCheckingInvoice(false);
        }
      }
    };

    checkExistingInvoice();
  }, [booking.id, booking.status]);

  // Função para lidar com o sucesso do upload da fatura
  const handleInvoiceUploadSuccess = () => {
    setHasInvoice(true);
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  // Função para formatar timestamp
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    try {
      const date = parseISO(timestamp);
      return format(date, "d 'de' MMMM, HH:mm", { locale: pt });
    } catch {
      return "Data inválida";
    }
  };

  // Função para calcular duração entre início e fim
  const calculateDuration = (
    startTime: string | null,
    endTime: string | null
  ) => {
    if (!startTime || !endTime) return "N/A";
    try {
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      const minutes = differenceInMinutes(end, start);

      if (minutes < 60) {
        return `${minutes} minutos`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${
          remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""
        }`;
      }
    } catch {
      return "N/A";
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
  const getStatusInfo = (statusValue: string) => {
    switch (statusValue) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <AlertCircle size={16} className="mr-1" />,
          text: "Pendente",
        };
      case "approved":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <CheckCircle size={16} className="mr-1" />,
          text: "Aprovada",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <XCircle size={16} className="mr-1" />,
          text: "Rejeitada",
        };
      case "started":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-300",
          icon: <Loader2 size={16} className="mr-1 animate-spin" />,
          text: "Em andamento",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <CheckCircle size={16} className="mr-1" />,
          text: "Concluída",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <AlertCircle size={16} className="mr-1" />,
          text: "Desconhecido",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  // Função para lidar com a mudança de status
  const handleStatusChange = async (
    newStatus: "completed" | "pending" | "approved" | "rejected" | "started"
  ) => {
    if (loading || newStatus === booking.status) return;

    setLoading(true);
    try {
      let startTime = currentBooking.start_time || null;
      let endTime = currentBooking.end_time || null;

      // Se o status for "started", regista o horário de início
      if (newStatus === "started") {
        startTime = new Date().toISOString();
      }

      // Se o status for "completed", regista o horário de término
      if (newStatus === "completed") {
        endTime = new Date().toISOString();
      }

      const success = await onStatusChange(
        currentBooking.id,
        newStatus,
        startTime ? new Date(startTime) : undefined,
        endTime ? new Date(endTime) : undefined
      );

      if (success) {
        // Atualizamos o estado local apenas após a operação ser concluída
        const updatedBooking = {
          ...currentBooking,
          status: newStatus,
          start_time: startTime,
          end_time: endTime,
        };
        setCurrentBooking(updatedBooking as typeof currentBooking);
        setStatus(newStatus);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com reagendamento
  const handleReschedule = async (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    newCustomTime?: string
  ) => {
    if (!onReschedule) return false;

    const oldDate = currentBooking.date;
    const oldTimeSlot = currentBooking.time_slot;
    const oldCustomTime = currentBooking.custom_time;

    const success = await onReschedule(
      bookingId,
      newDate,
      newTimeSlot,
      oldDate,
      oldTimeSlot,
      newCustomTime,
      oldCustomTime
    );

    if (success) {
      // Atualizar o estado local
      setCurrentBooking({
        ...currentBooking,
        date: newDate,
        time_slot: newTimeSlot as any,
        custom_time: newCustomTime,
      });
    }

    return success;
  };

  return (
    <Card
      className={`overflow-hidden border-l-4 ${statusInfo.color.replace(
        "bg-",
        "border-"
      )}`}
    >
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-2 pt-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color} border`}
            >
              {statusInfo.icon}
              {statusInfo.text}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              #{booking.id.substring(0, 8)}
            </span>
          </div>
          <div className="text-lg font-bold text-primary">{getPrice()}</div>
        </div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-2">
          {getServiceType()}
        </h4>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <User size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="ml-2">
              <p className="text-gray-700 dark:text-gray-300">
                {currentBooking.user_name || "Cliente"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentBooking.user_email || "Email não disponível"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="ml-2">
              <p className="text-gray-700 dark:text-gray-300">
                {formatDate(booking.date)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getTimeSlot()}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Car size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="ml-2">
              <p className="text-gray-700 dark:text-gray-300">
                {booking.car_model}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Matrícula: {booking.car_plate}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-gray-700 dark:text-gray-300">
              {booking.address}
            </p>
          </div>

          {(currentBooking.start_time || currentBooking.end_time) && (
            <div className="flex items-start">
              <Clock size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="ml-2">
                {currentBooking.start_time && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Início:</span>{" "}
                    {formatTimestamp(currentBooking.start_time)}
                  </p>
                )}
                {currentBooking.end_time && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Fim:</span>{" "}
                    {formatTimestamp(currentBooking.end_time)}
                  </p>
                )}
                {currentBooking.start_time && currentBooking.end_time && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Duração:</span>{" "}
                    {calculateDuration(
                      currentBooking.start_time,
                      currentBooking.end_time
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          {booking.notes && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Notas:</span> {booking.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Controlos de status */}
      <CardFooter className="p-6 pt-0">
        <div className="flex flex-col w-full gap-4">
          {/* Status controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                value={status}
                onValueChange={(value) =>
                  handleStatusChange(
                    value as
                      | "completed"
                      | "pending"
                      | "approved"
                      | "rejected"
                      | "started"
                  )
                }
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center">
                      <AlertCircle size={16} className="mr-2 text-yellow-600" />
                      Pendente
                    </div>
                  </SelectItem>
                  <SelectItem value="approved">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-blue-600" />
                      Aprovada
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center">
                      <XCircle size={16} className="mr-2 text-red-600" />
                      Rejeitada
                    </div>
                  </SelectItem>
                  <SelectItem value="started">
                    <div className="flex items-center">
                      <Play size={16} className="mr-2 text-purple-600" />
                      Iniciar Serviço
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center">
                      <CheckSquare size={16} className="mr-2 text-green-600" />
                      Concluir Serviço
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reschedule button - only show for pending and approved bookings */}
            {onReschedule &&
              (status === "pending" || status === "approved") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRescheduleDialogOpen(true)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <CalendarClock size={16} />
                  Reagendar
                </Button>
              )}
          </div>

          {/* Invoice upload button - only show for completed bookings */}
          {status === "completed" && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {hasInvoice ? "Fatura anexada" : "Sem fatura"}
                </span>
              </div>
              {!hasInvoice && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInvoiceUploadOpen(true)}
                  disabled={loading || checkingInvoice}
                  className="flex items-center gap-2"
                >
                  {checkingInvoice ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  Anexar Fatura
                </Button>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-2">
              <Loader2 size={16} className="animate-spin mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                A processar...
              </span>
            </div>
          )}
        </div>
      </CardFooter>

      {/* Reschedule Dialog */}
      {onReschedule && (
        <RescheduleDialog
          booking={currentBooking}
          open={rescheduleDialogOpen}
          onOpenChange={setRescheduleDialogOpen}
          onReschedule={handleReschedule}
        />
      )}

      {/* Invoice Upload Dialog */}
      <InvoiceUpload
        bookingId={booking.id}
        userId={booking.user_id}
        open={invoiceUploadOpen}
        onOpenChange={setInvoiceUploadOpen}
        onUploadSuccess={handleInvoiceUploadSuccess}
      />
    </Card>
  );
}
