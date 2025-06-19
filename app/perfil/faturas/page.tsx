"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Receipt,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
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
    return serviceType === "complete" ? "Pack Completo" : "Lavagem Exterior";
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
        variant: "secondary" as const,
        icon: <Clock size={14} />,
      };
    }

    if (booking.invoice) {
      return {
        label: "Fatura disponível",
        variant: "success" as const,
        icon: <FileText size={14} />,
      };
    }

    return {
      label: "Em processamento",
      variant: "warning" as const,
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
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
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
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 hover:bg-muted/50">
              <Link href="/perfil" className="gap-2">
                <ArrowLeft size={16} />
                Voltar ao Perfil
              </Link>
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Receipt className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Minhas Faturas
                </h1>
                <p className="text-muted-foreground">
                  Gerencie e descarregue as suas faturas
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Total
                    </p>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {allBookings.length}
                    </p>
                  </div>
                  <FileText
                    className="text-muted-foreground flex-shrink-0"
                    size={16}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Em Progresso
                    </p>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {inProgressBookings.length}
                    </p>
                  </div>
                  <Clock className="text-blue-500 flex-shrink-0" size={16} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      A Processar
                    </p>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {completedWithoutInvoice.length}
                    </p>
                  </div>
                  <AlertCircle
                    className="text-yellow-500 flex-shrink-0"
                    size={16}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Disponíveis
                    </p>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {completedWithInvoice.length}
                    </p>
                  </div>
                  <Download
                    className="text-green-500 flex-shrink-0"
                    size={16}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Todas</span>
                <span className="sm:hidden">Todas</span>
                <span className="ml-1">({allBookings.length})</span>
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Em Progresso</span>
                <span className="sm:hidden">Progresso</span>
                <span className="ml-1">({inProgressBookings.length})</span>
              </TabsTrigger>
              <TabsTrigger value="processing" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">A Processar</span>
                <span className="sm:hidden">Processar</span>
                <span className="ml-1">({completedWithoutInvoice.length})</span>
              </TabsTrigger>
              <TabsTrigger value="available" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Disponíveis</span>
                <span className="sm:hidden">Pronto</span>
                <span className="ml-1">({completedWithInvoice.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
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

            <TabsContent value="inprogress">
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

            <TabsContent value="processing">
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

            <TabsContent value="available">
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
    variant: "success" | "warning" | "secondary";
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
      <Card className="shadow-sm">
        <CardContent className="p-12 text-center">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma marcação encontrada
          </h3>
          <p className="text-muted-foreground mb-6">
            Não existem marcações nesta categoria.
          </p>
          <Button asChild>
            <Link href="/marcacoes">Fazer Nova Marcação</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const status = getInvoiceStatus(booking);

        return (
          <Card
            key={booking.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {getServiceType(booking.service_type)}
                  </h3>
                  <div className="flex items-center justify-between xs:justify-end gap-2">
                    <Badge
                      variant={
                        status.variant as
                          | "default"
                          | "destructive"
                          | "outline"
                          | "secondary"
                          | null
                          | undefined
                      }
                      className="flex items-center gap-1 text-xs"
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                    <div className="text-right xs:hidden">
                      <div className="text-lg font-bold text-primary">
                        {getPrice(
                          booking.service_type,
                          booking.has_discount || false
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span className="truncate">{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} className="flex-shrink-0" />
                    <span className="truncate">
                      {getTimeSlot(booking.time_slot, booking.custom_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Car size={14} className="flex-shrink-0" />
                    <span className="truncate">
                      {booking.car_model} ({booking.car_plate})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="truncate">{booking.address}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 pt-2 border-t border-border">
                  <div className="hidden xs:block">
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {getPrice(
                        booking.service_type,
                        booking.has_discount || false
                      )}
                    </div>
                    {booking.has_discount && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Desconto aplicado
                      </Badge>
                    )}
                  </div>

                  <div className="w-full xs:w-auto">
                    {booking.invoice ? (
                      <Button
                        onClick={() => onDownloadInvoice(booking.invoice!)}
                        disabled={downloadingInvoice === booking.invoice.id}
                        className="gap-2 w-full xs:w-auto text-xs sm:text-sm"
                        size="sm"
                      >
                        {downloadingInvoice === booking.invoice.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span className="hidden sm:inline">
                              A descarregar...
                            </span>
                            <span className="sm:hidden">Descarregando...</span>
                          </>
                        ) : (
                          <>
                            <Download size={14} />
                            <span className="hidden sm:inline">
                              Descarregar Fatura
                            </span>
                            <span className="sm:hidden">Download</span>
                          </>
                        )}
                      </Button>
                    ) : booking.status === "completed" ? (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full xs:w-auto text-xs sm:text-sm"
                        size="sm"
                      >
                        <span className="hidden sm:inline">
                          Fatura em processamento
                        </span>
                        <span className="sm:hidden">Processando</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full xs:w-auto text-xs sm:text-sm"
                        size="sm"
                      >
                        <span className="hidden sm:inline">
                          Aguarda conclusão
                        </span>
                        <span className="sm:hidden">Aguardando</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
