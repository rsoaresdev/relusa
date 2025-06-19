"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-destructive/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">
              Erro de Autenticação
            </CardTitle>
            <CardDescription>
              Ocorreu um problema durante o processo de autenticação.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Isto pode acontecer se o link expirou ou se houve um problema
              temporário com o serviço. Por favor, tente novamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/marcacoes")}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Se o problema persistir, contacte o suporte através de{" "}
              <a
                href="mailto:geral@relusa.pt"
                className="text-primary hover:underline"
              >
                geral@relusa.pt
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
