"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Trash2,
  Calendar,
  Receipt,
  Edit3,
  FileText,
  Clock,
} from "lucide-react";
import {
  supabase,
  getCurrentUser,
  User as UserType,
  getUserBookings,
  Booking,
  performLogout,
} from "@/lib/supabase/config";
import SimpleProtectedRoute from "@/components/auth/SimpleProtectedRoute";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          router.push("/marcacoes");
          return;
        }

        setUser(userData);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
        });

        // Procurar marcações do utilizador
        const userBookings = await getUserBookings(userData.id);
        setBookings(userBookings);
      } catch {
        toast.error("Erro ao carregar perfil. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");

      // Atualizar o estado do utilizador
      setUser({
        ...user,
        name: formData.name,
        phone: formData.phone,
      });
    } catch (error: any) {
      toast.error(
        error.message || "Erro ao atualizar perfil. Tente novamente."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (
      !window.confirm(
        "Tem certeza que deseja apagar a sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      // Primeiro apagar dados do utilizador
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (userError) throw userError;

      // Depois terminar sessão
      await performLogout();

      toast.success("Conta apagada com sucesso.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao apagar conta. Tente novamente.");
      setDeleting(false);
    }
  };

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

  // Filtrar marcações por categoria
  const allBookings = bookings;
  const pendingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "approved"
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SimpleProtectedRoute>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Meu Perfil
                </h1>
                <p className="text-muted-foreground">
                  Gerencie as suas informações pessoais e marcações
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de Marcações
                    </p>
                    <p className="text-2xl font-bold">{allBookings.length}</p>
                  </div>
                  <Calendar className="text-muted-foreground" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold">
                      {pendingBookings.length}
                    </p>
                  </div>
                  <Clock className="text-blue-500" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Concluídas</p>
                    <p className="text-2xl font-bold">
                      {completedBookings.length}
                    </p>
                  </div>
                  <FileText className="text-green-500" size={20} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="bookings">
                Minhas Marcações ({allBookings.length})
              </TabsTrigger>
              <TabsTrigger value="danger">Zona de Perigo</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 size={20} />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Atualize as suas informações pessoais aqui.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Número de Telemóvel</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (apenas leitura)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={updating}
                      className="w-full md:w-auto"
                    >
                      {updating ? "A atualizar..." : "Atualizar Perfil"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} />
                    Minhas Marcações
                  </CardTitle>
                  <CardDescription>
                    Histórico das suas marcações e respetivos estados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar
                        size={48}
                        className="mx-auto text-muted-foreground mb-4"
                      />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Ainda não tem marcações
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Faça a sua primeira marcação para aparecer aqui.
                      </p>
                      <Button asChild>
                        <a href="/marcacoes">Fazer Marcação</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-border/50 rounded-lg p-6 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground">
                                  {booking.service_type === "complete"
                                    ? "Pack Completo"
                                    : "Lavagem Exterior"}
                                </h3>
                                {getBookingStatusBadge(booking.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  <span>{formatDate(booking.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {booking.service_type === "complete"
                                  ? "18€"
                                  : "12€"}
                              </div>
                              {booking.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="mt-2"
                                >
                                  <a href="/perfil/faturas">
                                    <Receipt size={14} className="mr-2" />
                                    Ver Fatura
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="danger">
              <Card className="shadow-sm border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 size={20} />
                    Zona de Perigo
                  </CardTitle>
                  <CardDescription>
                    Ações irreversíveis na sua conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 border border-destructive/20 rounded-lg bg-destructive/5">
                      <h3 className="font-semibold text-destructive mb-2">
                        Apagar Conta
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Esta ação apagará permanentemente a sua conta e todos os
                        dados associados. Esta ação não pode ser desfeita.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                      >
                        {deleting ? "A apagar..." : "Apagar Conta"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SimpleProtectedRoute>
  );
}
