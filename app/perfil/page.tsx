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
import { toast } from "sonner";
import { Trash2, Edit3 } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/components/auth/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, refreshUser } = useAuthContext();
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
    } else if (!authLoading && !user) {
      router.push("/marcacoes");
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validação específica para o campo telefone
    if (name === "phone") {
      // Remove todos os caracteres que não sejam números ou + no início
      let cleanedValue = value.replace(/[^\d+]/g, "");

      // Se há um +, deve estar apenas no início
      if (cleanedValue.includes("+")) {
        const plusCount = (cleanedValue.match(/\+/g) || []).length;
        if (plusCount > 1 || !cleanedValue.startsWith("+")) {
          // Remove todos os + se houver mais de um ou se não estiver no início
          cleanedValue = cleanedValue.replace(/\+/g, "");
        } else {
          // Garante que há apenas um + no início
          cleanedValue = "+" + cleanedValue.substring(1).replace(/\+/g, "");
        }
      }

      // Limita a 20 caracteres
      if (cleanedValue.length > 20) {
        cleanedValue = cleanedValue.substring(0, 20);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  return (
    <ProtectedRoute>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">O Meu Perfil</h1>
              <p className="text-muted-foreground">
                Gerir as suas informações pessoais.
              </p>
            </div>

            {authLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    A carregar dados do perfil...
                  </p>
                </div>
              </div>
            ) : (
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
                            placeholder="+351912345678"
                            maxLength={20}
                          />
                          <p className="text-xs text-muted-foreground">
                            Formato: +351912345678 (máx. 20 caracteres)
                          </p>
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
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
