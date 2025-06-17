"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  Car,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";
import {
  getUserBookings,
  getUserInvoices,
  getInvoiceSignedUrl,
  type Booking,
  type Invoice,
} from "@/lib/supabase/config";
import { useAuthContext } from "@/components/auth/AuthProvider";
import SimpleProtectedRoute from "@/components/auth/SimpleProtectedRoute";

type BookingWithInvoice = Booking & {
  invoice?: Invoice;
};

export default function InvoicesPage() {
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState<BookingWithInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Procurar marcações e faturas em paralelo
        const [bookingsData, invoicesData] = await Promise.all([
          getUserBookings(user.id),
          getUserInvoices(user.id),
        ]);

        // Combinar marcações com faturas
        const bookingsWithInvoices: BookingWithInvoice[] = bookingsData.map(
          (booking) => {
            const invoice = invoicesData.find(
              (inv) => inv.booking_id === booking.id
            );
            return { ...booking, invoice };
          }
        );

        setBookings(bookingsWithInvoices);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
  const getTimeSlot = (timeSlot: string, customTime?: string) => {
    switch (timeSlot) {
      case "morning":
        return "Manhã (9h - 12h)";
      case "afternoon":
        return "Tarde (13h - 17h)";
      case "evening":
        return "Final do dia (17h - 19h)";
      case "custom":
        return customTime || "Horário personalizado";
      default:
        return "Horário não especificado";
    }
  };

  // Função para obter o tipo de serviço
  const getServiceType = (serviceType: string) => {
    return serviceType === "complete"
      ? "Lavagem Completa (Interior + Exterior)"
      : "Lavagem Exterior";
  };

  // Função para obter o preço
  const getPrice = (serviceType: string, hasDiscount: boolean) => {
    if (hasDiscount) {
      return serviceType === "complete" ? "9€" : "6€";
    }
    return serviceType === "complete" ? "18€" : "12€";
  };

  // Função para obter o status da fatura
  const getInvoiceStatus = (booking: BookingWithInvoice) => {
    if (booking.status !== "completed") {
      return {
        label: "Em progresso",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <Clock size={14} />,
      };
    }

    if (booking.invoice) {
      return {
        label: "Fatura disponível",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: <FileText size={14} />,
      };
    }

    return {
      label: "Em processamento",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: <AlertCircle size={14} />,
    };
  };

  // Função para fazer download da fatura
  const handleDownloadInvoice = async (invoice: Invoice) => {
    setDownloadingInvoice(invoice.id);

    try {
      const signedUrl = await getInvoiceSignedUrl(invoice.file_path);
      if (!signedUrl) {
        throw new Error("Não foi possível gerar URL da fatura");
      }

      // Criar elemento âncora temporário para download
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = invoice.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Fatura descarregada com sucesso!");
    } catch (error) {
      console.error("Erro ao descarregar fatura:", error);
      toast.error("Erro ao descarregar fatura");
    } finally {
      setDownloadingInvoice(null);
    }
  };

  // Filtrar marcações por categoria
  const allBookings = bookings;
  const inProgressBookings = bookings.filter((b) => b.status !== "completed");
  const completedWithoutInvoice = bookings.filter(
    (b) => b.status === "completed" && !b.invoice
  );
  const completedWithInvoice = bookings.filter(
    (b) => b.status === "completed" && b.invoice
  );

  if (loading) {
    return (
      <SimpleProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600 dark:text-gray-400">
                  A carregar as suas faturas...
                </p>
              </div>
            </div>
          </div>
        </div>
      </SimpleProtectedRoute>
    );
  }

  return (
    <SimpleProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              As Minhas Faturas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Consulte todas as suas marcações e descarregue as faturas
              disponíveis
            </p>
          </div>

          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todas">
                Todas ({allBookings.length})
              </TabsTrigger>
              <TabsTrigger value="progresso">
                Em Progresso ({inProgressBookings.length})
              </TabsTrigger>
              <TabsTrigger value="processamento">
                Em Processamento ({completedWithoutInvoice.length})
              </TabsTrigger>
              <TabsTrigger value="faturas">
                Com Fatura ({completedWithInvoice.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todas" className="mt-6">
              <BookingsList
                bookings={allBookings}
                onDownloadInvoice={handleDownloadInvoice}
                downloadingInvoice={downloadingInvoice}
                formatDate={formatDate}
                getTimeSlot={getTimeSlot}
                getServiceType={getServiceType}
                getPrice={getPrice}
                getInvoiceStatus={getInvoiceStatus}
              />
            </TabsContent>

            <TabsContent value="progresso" className="mt-6">
              <BookingsList
                bookings={inProgressBookings}
                onDownloadInvoice={handleDownloadInvoice}
                downloadingInvoice={downloadingInvoice}
                formatDate={formatDate}
                getTimeSlot={getTimeSlot}
                getServiceType={getServiceType}
                getPrice={getPrice}
                getInvoiceStatus={getInvoiceStatus}
              />
            </TabsContent>

            <TabsContent value="processamento" className="mt-6">
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <AlertCircle size={16} className="inline mr-2" />
                  As faturas estão em processamento e podem demorar até 5 dias
                  úteis para ficarem disponíveis.
                </p>
              </div>
              <BookingsList
                bookings={completedWithoutInvoice}
                onDownloadInvoice={handleDownloadInvoice}
                downloadingInvoice={downloadingInvoice}
                formatDate={formatDate}
                getTimeSlot={getTimeSlot}
                getServiceType={getServiceType}
                getPrice={getPrice}
                getInvoiceStatus={getInvoiceStatus}
              />
            </TabsContent>

            <TabsContent value="faturas" className="mt-6">
              <BookingsList
                bookings={completedWithInvoice}
                onDownloadInvoice={handleDownloadInvoice}
                downloadingInvoice={downloadingInvoice}
                formatDate={formatDate}
                getTimeSlot={getTimeSlot}
                getServiceType={getServiceType}
                getPrice={getPrice}
                getInvoiceStatus={getInvoiceStatus}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SimpleProtectedRoute>
  );
}

// Componente para renderizar a lista de marcações
interface BookingsListProps {
  bookings: BookingWithInvoice[];
  onDownloadInvoice: (invoice: Invoice) => void;
  downloadingInvoice: string | null;
  formatDate: (date: string) => string;
  getTimeSlot: (timeSlot: string, customTime?: string) => string;
  getServiceType: (serviceType: string) => string;
  getPrice: (serviceType: string, hasDiscount: boolean) => string;
  getInvoiceStatus: (booking: BookingWithInvoice) => {
    label: string;
    color: string;
    icon: React.ReactNode;
  };
}

function BookingsList({
  bookings,
  onDownloadInvoice,
  downloadingInvoice,
  formatDate,
  getTimeSlot,
  getServiceType,
  getPrice,
  getInvoiceStatus,
}: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma marcação encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Não há marcações nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const invoiceStatus = getInvoiceStatus(booking);

        return (
          <Card key={booking.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${invoiceStatus.color} border`}
                  >
                    {invoiceStatus.icon}
                    <span className="ml-1">{invoiceStatus.label}</span>
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{booking.id.substring(0, 8)}
                  </span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {getPrice(
                    booking.service_type,
                    booking.has_discount || false
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">
                {getServiceType(booking.service_type)}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getTimeSlot(booking.time_slot, booking.custom_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {booking.car_model}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.car_plate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <p className="text-gray-700 dark:text-gray-300">
                  {booking.address}
                </p>
              </div>

              {booking.nif && (
                <div className="flex items-start gap-3">
                  <FileText
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      NIF: {booking.nif}
                    </p>
                  </div>
                </div>
              )}

              {booking.invoice && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Fatura disponível
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadInvoice(booking.invoice!)}
                      disabled={downloadingInvoice === booking.invoice.id}
                      className="flex items-center gap-2"
                    >
                      {downloadingInvoice === booking.invoice.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      Descarregar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
