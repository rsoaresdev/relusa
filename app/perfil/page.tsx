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
import { User, Trash2, Calendar, Edit3, Clock } from "lucide-react";
import { supabase, getUserBookings, Booking } from "@/lib/supabase/config";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, refreshUser } = useAuthContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (user && !authLoading) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });

      // Carregar marcações do utilizador
      const loadBookings = async () => {
        try {
          const userBookings = await getUserBookings(user.id);
          setBookings(userBookings);
        } catch (error) {
          console.error("Erro ao carregar marcações:", error);
          toast.error("Erro ao carregar marcações.");
        } finally {
          setLoading(false);
        }
      };

      loadBookings();
    } else if (!authLoading && !user) {
      router.push("/marcacoes");
    }
  }, [user, authLoading, router]);

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

      // Refresh user data
      await refreshUser();
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
      await signOut();

      toast.success("Conta apagada com sucesso.");
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

  return (
    <ProtectedRoute>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
              <p className="text-muted-foreground">
                Gerir as suas informações pessoais e marcações.
              </p>
            </div>

            {loading && authLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    A carregar dados do perfil...
                  </p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-11">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Perfil</span>
                    <span className="xs:hidden">Info</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Marcações</span>
                    <span className="xs:hidden">Lista</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Perfil */}
                <TabsContent value="profile">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Edit3 className="w-5 h-5" />
                          Informações Pessoais
                        </CardTitle>
                        <CardDescription>
                          Atualize as suas informações pessoais aqui.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nome Completo</Label>
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="O seu nome completo"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Telefone</Label>
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+351 xxx xxx xxx"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={user?.email || ""}
                              disabled
                              className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                              O email não pode ser alterado.
                            </p>
                          </div>
                          <Button type="submit" disabled={updating}>
                            {updating ? "A atualizar..." : "Atualizar Perfil"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Zona de perigo */}
                    <Card className="border-destructive/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                          <Trash2 className="w-5 h-5" />
                          Zona de Perigo
                        </CardTitle>
                        <CardDescription>
                          Ações irreversíveis relacionadas com a sua conta.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                        >
                          {deleting ? "A apagar..." : "Apagar Conta"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab Marcações */}
                <TabsContent value="bookings">
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
                        <div className="space-y-4">
                          {bookings.map((booking) => (
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
                                        : booking.time_slot === "afternoon"
                                        ? "Tarde (12h-17h)"
                                        : "Noite (17h-20h)"}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground truncate">
                                    {booking.car_model} - {booking.car_plate}
                                  </p>
                                </div>
                              </div>
                              {booking.notes && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    <strong>Notas:</strong> {booking.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
