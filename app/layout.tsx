import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relusa - O teu carro não recusa",
  description:
    "Lavagens automóvel a seco na zona de Gaia. Interior, exterior, jantes e vidros com detalhe profissional. Relusa — o seu carro não recusa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} antialiased`}>
        <Toaster richColors closeButton />
        <main>{children}</main>
      </body>
    </html>
  );
}
