"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Settings, Trash2, Shield, Clock } from "lucide-react";
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

type ProfileTab = "info" | "security" | "bookings" | "danger";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
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
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Aprovada
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Rejeitada
          </span>
        );
      case "started":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            Em andamento
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Concluída
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <SimpleProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/80 to-primary p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                    <User size={48} className="text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {user?.name}
                    </h1>
                    <p className="text-white/80 mt-1">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700">
                  <nav className="p-4">
                    <ul className="space-y-1">
                      <li>
                        <button
                          onClick={() => setActiveTab("info")}
                          className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === "info"
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <User size={18} className="mr-3" />
                          Informações Pessoais
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("bookings")}
                          className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === "bookings"
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Clock size={18} className="mr-3" />
                          As Minhas Marcações
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("danger")}
                          className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === "danger"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          }`}
                        >
                          <Shield size={18} className="mr-3" />
                          Zona de Perigo
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  {activeTab === "info" && (
                    <div className="max-w-xl">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Informações Pessoais
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={user?.email || ""}
                              disabled
                              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              O email não pode ser alterado
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Nome
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="O seu nome completo"
                              required
                              className="border-gray-200 dark:border-gray-700"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="phone"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Telemóvel
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="O seu número de telemóvel"
                              className="border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full sm:w-auto"
                          disabled={updating}
                        >
                          {updating ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                              A guardar...
                            </>
                          ) : (
                            <>
                              <Settings size={16} className="mr-2" />
                              Guardar alterações
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  )}

                  {activeTab === "bookings" && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Minhas Marcações
                      </h2>

                      {bookings.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                          <Clock
                            size={40}
                            className="mx-auto text-gray-400 mb-4"
                          />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Ainda não tem marcações... O seu carro está a
                            sentir-se abandonado!
                          </p>
                          <Button onClick={() => router.push("/marcacoes")}>
                            Fazer uma marcação
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    {getBookingStatusBadge(booking.status)}
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      #{booking.id.substring(0, 8)}
                                    </span>
                                  </div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {booking.service_type === "complete"
                                      ? "Lavagem Completa (Interior + Exterior)"
                                      : "Lavagem Exterior"}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {formatDate(booking.date)}
                                  </p>
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span>
                                      {booking.car_model} ({booking.car_plate})
                                    </span>
                                    <span>{booking.address}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-primary">
                                    {booking.service_type === "complete"
                                      ? "18€"
                                      : "12€"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "danger" && (
                    <div>
                      <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">
                        Zona de Perigo
                      </h2>

                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
                          Apagar Conta
                        </h3>
                        <p className="text-red-600/80 dark:text-red-300/80 mb-6">
                          Ao apagar sua conta, todos os seus dados pessoais e
                          histórico de marcações serão permanentemente
                          removidos. Esta ação não pode ser desfeita.
                        </p>

                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                              A apagar...
                            </>
                          ) : (
                            <>
                              <Trash2 size={16} className="mr-2" />
                              Apagar minha conta
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleProtectedRoute>
  );
}
