"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import {
  LogOut,
  Calendar,
  Users,
  Clock,
  Filter,
  RefreshCw,
  BarChart,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Booking, User, LoyaltyPoints } from "@/lib/supabase/config";
import AdminBookingCard from "./AdminBookingCard";
import { useEmailService } from "@/lib/hooks/useEmailService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminDashboardProps {
  session: any;
  onLogout: () => void;
}

export default function AdminDashboard({
  session,
  onLogout,
}: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("bookings");

  // Referência para controlar operações concorrentes
  const isUpdatingRef = useRef(false);

  // Hook de email
  const emailService = useEmailService();

  // Função para procurar dados - extraída para poder ser reutilizada
  const fetchData = useCallback(async (showToast = false) => {
    if (isUpdatingRef.current) return;

    try {
      isUpdatingRef.current = true;
      setRefreshing(true);

      // Procurar agendamentos com join para obter dados do utilizador
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          users:user_id (
            name,
            email
          )
        `
        )
        .order("date", { ascending: false });

      if (bookingsError) {
        throw bookingsError;
      }

      // Processar dados para adicionar user_name e user_email
      const processedBookings = bookingsData.map((booking: any) => ({
        ...booking,
        user_name: booking.users?.name || "Cliente",
        user_email: booking.users?.email || "",
      }));

      setBookings(processedBookings as Booking[]);

      // Procurar utilizadores
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) {
        throw usersError;
      }

      setUsers(usersData as User[]);

      if (showToast) {
        toast.success("Dados atualizados com sucesso");
      }
    } catch {
      toast.error("Erro ao carregar dados. Tente novamente.");
    } finally {
      setRefreshing(false);
      setLoading(false);
      isUpdatingRef.current = false;
    }
  }, []);

  // Procurar dados iniciais
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Aplicar filtros aos agendamentos
  useEffect(() => {
    if (!bookings.length) return;

    let filtered = [...bookings];

    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Filtrar por data
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === "today") {
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate.getTime() === today.getTime();
        });
      } else if (dateFilter === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate.getTime() === tomorrow.getTime();
        });
      } else if (dateFilter === "week") {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today && bookingDate <= nextWeek;
        });
      }
    }

    setFilteredBookings(filtered);
  }, [statusFilter, dateFilter, bookings]);

  // Função para atualizar o status de uma marcação
  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: string,
    startTime?: Date,
    endTime?: Date
  ) => {
    if (isUpdatingRef.current) {
      toast.error("Já existe uma operação em andamento. Aguarde um momento.");
      return false;
    }

    isUpdatingRef.current = true;

    try {
      // Preparar dados para atualização
      const updateData: any = {
        status: newStatus,
      };

      // Adicionar horário de início/fim se fornecidos
      if (startTime) {
        updateData.start_time = startTime.toISOString();
      }

      if (endTime) {
        updateData.end_time = endTime.toISOString();
      }

      // Atualizar no Supabase
      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId)
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("Marcação não encontrada");
      }

      const updatedBooking = data[0] as Booking;

      // Atualizar estado local sem causar loop infinito
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, ...updateData } : booking
        )
      );

      // Enviar email correspondente ao novo status
      switch (newStatus) {
        case "approved":
          await emailService.sendBookingApprovedEmail(updatedBooking);
          break;
        case "rejected":
          await emailService.sendBookingRejectedEmail(updatedBooking);
          break;
        case "started":
          await emailService.sendServiceStartedEmail(updatedBooking);
          break;
        case "completed":
          await emailService.sendServiceCompletedEmail(updatedBooking);

          // Quando uma reserva é concluída, verificar os pontos de fidelidade
          // e enviar emails de lembrete ou desconto conforme apropriado
          // Aguardar um momento para garantir que o trigger da base de dados atualizou os pontos
          setTimeout(async () => {
            // Buscar os pontos de fidelidade atualizados
            const { data: loyaltyData, error: loyaltyError } = await supabase
              .from("loyalty_points")
              .select("*")
              .eq("user_id", updatedBooking.user_id)
              .single();

            if (loyaltyError) return;

            const loyaltyPoints = loyaltyData as LoyaltyPoints;

            // Verificar se o cliente está na 4ª lavagem (próximo da 5ª)
            if (loyaltyPoints.bookings_count % 5 === 3) {
              // Enviar email de lembrete (na 4ª lavagem)
              await emailService.sendLoyaltyReminderEmail(
                updatedBooking.user_id
              );
            }
          }, 2000); // Esperar 2 segundos para garantir que o trigger foi executado

          break;
      }

      toast.success(
        `Status da marcação atualizado para ${getStatusText(newStatus)}`
      );

      // Se o status for "completed", recarregar os dados para mostrar os pontos atualizados
      if (newStatus === "completed") {
        // Aguardar um momento para garantir que as operações da base de dados sejam concluídas
        setTimeout(() => {
          fetchData(false);
        }, 2500); // Aumentado para 2.5 segundos para garantir que os emails de fidelidade sejam processados
      }

      return true;
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar status da marcação");
      return false;
    } finally {
      isUpdatingRef.current = false;
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovada";
      case "rejected":
        return "Rejeitada";
      case "started":
        return "Em andamento";
      case "completed":
        return "Concluída";
      default:
        return "Desconhecido";
    }
  };

  // Calcular estatísticas para o dashboard
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const todayCount = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  }).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg p-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <BarChart size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Painel de Administração
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Bem-vindo, {session?.user?.email || "Administrador"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Marcações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingCount}
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock
                  size={20}
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Marcações Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {todayCount}
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Calendar
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Serviços Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCount}
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Users
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="bookings"
        className="mt-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          <TabsTrigger
            value="bookings"
            className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md transition-all"
          >
            <Calendar size={16} />
            Marcações
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md transition-all"
          >
            <Users size={16} />
            Clientes
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da Tab de Marcações */}
        <TabsContent value="bookings">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400 mr-2">
              <Filter size={18} className="mr-2" />
              <span className="font-medium">Filtros:</span>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovadas</SelectItem>
                  <SelectItem value="rejected">Rejeitadas</SelectItem>
                  <SelectItem value="started">Em andamento</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data
              </label>
              <Select
                value={dateFilter}
                onValueChange={(value) => setDateFilter(value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Todas as datas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as datas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="tomorrow">Amanhã</SelectItem>
                  <SelectItem value="week">Próximos 7 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Marcações */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nenhuma marcação encontrada com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <AdminBookingCard
                  key={booking.id}
                  booking={booking}
                  onStatusChange={handleUpdateBookingStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Conteúdo da Tab de Clientes */}
        <TabsContent value="users">
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left border-b border-gray-200 dark:border-gray-600">
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telemóvel
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data de Registo
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marcações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      Nenhum cliente registado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const userBookings = bookings.filter(
                      (booking) => booking.user_id === user.id
                    );
                    const completedBookings = userBookings.filter(
                      (booking) => booking.status === "completed"
                    ).length;

                    // Gerar iniciais para o avatar
                    const initials = user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "??";

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-primary/10">
                              <AvatarFallback className="text-xs text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {user.phone || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {format(parseISO(user.created_at), "dd/MM/yyyy", {
                            locale: pt,
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {userBookings.length}
                            </span>
                            {completedBookings > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                              >
                                {completedBookings} concluídas
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
