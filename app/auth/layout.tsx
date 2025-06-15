import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticação | Relusa",
  description: "Faça login ou crie uma conta para agendar serviços de lavagem de carros.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
