import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/auth";
import { PromoPopup } from "@/components/ui/promo-popup";
import { CookieConsent } from "@/components/ui/cookie-consent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Relusa - O seu carro não recusa",
  description:
    "Damos mais brilho a Gaia! Serviço premium de lavagem automóvel a seco em Vila Nova de Gaia. Relusa — o seu carro não recusa.",
  keywords:
    "lavagem a seco, lavagem carro, lavagem automóvel, lavar carro, carro, automóvel, ecológico, Vila Nova de Gaia, detalhe, interior, exterior, jantes, vidros",
  authors: [{ name: "Relusa" }],
  creator: "Relusa",
  publisher: "Relusa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.relusa.pt"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Relusa - Lavagem automóvel a seco",
    description:
      "Damos mais brilho a Gaia! Serviço premium de lavagem automóvel a seco em Vila Nova de Gaia. Relusa — o seu carro não recusa.",
    url: "https://www.relusa.pt",
    siteName: "Relusa",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "https://www.relusa.pt/og-image.png",
        width: 1200,
        height: 630,
        alt: "Relusa - Lavagem automóvel a seco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Relusa - Lavagem automóvel a seco",
    description:
      "Damos mais brilho a Gaia! Serviço premium de lavagem automóvel a seco em Vila Nova de Gaia. Relusa — o seu carro não recusa.",
    images: ["https://www.relusa.pt/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PromoPopup />
            <Header />
            <Analytics />
            <SpeedInsights />
            <Toaster richColors closeButton />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>

        {/* Schema.org JSON-LD */}
        <Script
          id="schema-org-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Relusa",
              description:
                "Lavagens automóvel a seco em Vila Nova de Gaia. Interior, exterior, jantes e vidros com detalhe profissional.",
              image: "https://www.relusa.pt/og-image.png",
              url: "https://www.relusa.pt",
              telephone: "+351932440827",
              email: "geral@relusa.pt",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Vila Nova de Gaia",
                addressRegion: "Porto",
                addressCountry: "PT",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "41.1238437",
                longitude: "-8.652259499999999",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "09:00",
                  closes: "19:00",
                },
              ],
              priceRange: "€€",
              sameAs: ["https://instagram.com/relusa.pt"],
            }),
          }}
        />
      </body>
    </html>
  );
}
