"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Booking, Invoice } from "@/lib/supabase/config";
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
  User,
  CalendarClock,
  FileText,
  Upload,
  Download,
} from "lucide-react";
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
  invoice?: Invoice;
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
  onDownloadInvoice?: (
    invoiceId: string,
    fileName: string,
    filePath: string
  ) => void;
  downloadingInvoice?: string | null;
  onInvoiceUploaded?: () => void;
}

export default function AdminBookingCard({
  booking,
  invoice,
  onStatusChange,
  onReschedule,
  onDownloadInvoice,
  downloadingInvoice,
  onInvoiceUploaded,
}: AdminBookingCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "completed" | "pending" | "approved" | "rejected" | "started"
  >(booking.status);
  const [currentBooking, setCurrentBooking] = useState(booking);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [invoiceUploadOpen, setInvoiceUploadOpen] = useState(false);
  // Função para lidar com o sucesso do upload da fatura
  const handleInvoiceUploadSuccess = () => {
    // Refresh será feito pelo componente pai
    onInvoiceUploaded?.();
  };

  // Função para obter ações permitidas baseadas no status atual
  const getAvailableActions = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return ["approved", "rejected"];
      case "approved":
        return ["started", "rejected"];
      case "started":
        return ["completed"];
      case "rejected":
      case "completed":
        return []; // Estados finais
      default:
        return [];
    }
  };

  // Função para verificar se pode reagendar
  const canReschedule = () => {
    return ["pending", "approved"].includes(status);
  };

  // Função para verificar se pode anexar/descarregar fatura
  const canManageInvoice = () => {
    return status === "completed";
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
      className={`overflow-hidden border-l-4 shadow-md hover:shadow-lg transition-shadow ${statusInfo.color.replace(
        "bg-",
        "border-"
      )}`}
    >
      {/* Cabeçalho com informação principal */}
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center ${statusInfo.color} border shadow-sm`}
            >
              {statusInfo.icon}
              {statusInfo.text}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono">#{booking.id.substring(0, 8)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {booking.nif && (
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                NIF: {booking.nif}
              </span>
            )}
            <div className="text-2xl font-bold text-primary">{getPrice()}</div>
          </div>
        </div>
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
          {getServiceType()}
        </h4>
      </CardHeader>

      <CardContent className="p-6">
        {/* Layout em grid para melhor organização */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Coluna 1: Informações do Cliente */}
          <div className="space-y-4">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide border-b pb-2">
              👤 Cliente
            </h5>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentBooking.user_name || "Cliente"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentBooking.user_email || "Email não disponível"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Car size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.car_model}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.car_plate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Agendamento e Localização */}
          <div className="space-y-4">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide border-b pb-2">
              📅 Agendamento
            </h5>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(booking.date)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTimeSlot()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white break-words">
                    {booking.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 3: Execução e Extras */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide border-b pb-2">
              ⚙️ Execução
            </h5>

            <div className="space-y-3">
              {(currentBooking.start_time || currentBooking.end_time) && (
                <div className="flex items-start space-x-3">
                  <Clock
                    size={16}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    {currentBooking.start_time && (
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">Início:</span>{" "}
                        {formatTimestamp(currentBooking.start_time)}
                      </p>
                    )}
                    {currentBooking.end_time && (
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">Fim:</span>{" "}
                        {formatTimestamp(currentBooking.end_time)}
                      </p>
                    )}
                    {currentBooking.start_time && currentBooking.end_time && (
                      <p className="text-sm text-primary font-medium">
                        Duração:{" "}
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
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">📝 Notas:</span>{" "}
                    {booking.notes}
                  </p>
                </div>
              )}

              {!currentBooking.start_time &&
                !currentBooking.end_time &&
                !booking.notes && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Sem informações de execução
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Controlos e Ações */}
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-6">
        <div className="w-full space-y-4">
          {/* Ações principais baseadas no status */}
          {getAvailableActions(status).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Ações Disponíveis
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {getAvailableActions(status).map((action) => {
                  const actionConfig = {
                    approved: {
                      label: "✅ Aprovar Marcação",
                      variant: "default" as const,
                      className:
                        "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
                    },
                    rejected: {
                      label: "❌ Rejeitar Marcação",
                      variant: "destructive" as const,
                      className: "shadow-sm",
                    },
                    started: {
                      label: "🚗 Iniciar Serviço",
                      variant: "default" as const,
                      className:
                        "bg-purple-600 hover:bg-purple-700 text-white shadow-sm",
                    },
                    completed: {
                      label: "🏁 Concluir Serviço",
                      variant: "default" as const,
                      className:
                        "bg-green-600 hover:bg-green-700 text-white shadow-sm",
                    },
                  };

                  const config =
                    actionConfig[action as keyof typeof actionConfig];

                  return (
                    <Button
                      key={action}
                      variant={config.variant}
                      size="default"
                      onClick={() => handleStatusChange(action as any)}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 font-medium ${config.className}`}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : null}
                      {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Barra de separação quando há ações principais e secundárias */}
          {getAvailableActions(status).length > 0 &&
            onReschedule &&
            canReschedule() && (
              <div className="border-t border-gray-200 dark:border-gray-600"></div>
            )}

          {/* Ações secundárias e informações */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Ações secundárias */}
            <div className="flex flex-wrap gap-2">
              {onReschedule && canReschedule() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRescheduleDialogOpen(true)}
                  disabled={loading}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                >
                  <CalendarClock size={16} />
                  Reagendar
                </Button>
              )}
            </div>

            {/* Informação de loading */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span>A processar...</span>
              </div>
            )}
          </div>

          {/* Gestão de faturas - apenas para serviços concluídos */}
          {canManageInvoice() && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-600"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Gestão de Fatura
                  </span>
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-600 ml-4"></div>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {invoice ? "✅ Disponível" : "⏳ Pendente"}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Informações da fatura */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={14} className="text-purple-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Status da Fatura:
                      </span>
                      <span
                        className={`font-semibold ${
                          invoice ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {invoice ? "Fatura anexada" : "Aguarda processamento"}
                      </span>
                    </div>

                    {invoice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                        Criada em:{" "}
                        {format(
                          parseISO(invoice.created_at),
                          "dd/MM/yyyy 'às' HH:mm",
                          {
                            locale: pt,
                          }
                        )}
                      </div>
                    )}

                    {!invoice && booking.nif && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 ml-6">
                        NIF fornecido: {booking.nif}
                      </div>
                    )}
                  </div>

                  {/* Ações de fatura */}
                  <div className="flex justify-end items-center gap-2">
                    {invoice && onDownloadInvoice && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onDownloadInvoice(
                            invoice.id,
                            invoice.file_name,
                            invoice.file_path
                          )
                        }
                        disabled={downloadingInvoice === invoice.id}
                        className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                      >
                        {downloadingInvoice === invoice.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        Descarregar
                      </Button>
                    )}

                    {!invoice && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInvoiceUploadOpen(true)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300"
                      >
                        <Upload size={16} />
                        Anexar Fatura
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
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
