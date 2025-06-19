import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware do Next.js
 *
 * Configura redirecionamentos e headers para SEO optimizado.
 * A verificação de autenticação é feita no lado do cliente através do ProtectedRoute component.
 * Esta abordagem permite melhor UX com loading states e redirecionamentos suaves.
 */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Redireccionar de relusa.pt para www.relusa.pt
  if (hostname === "relusa.pt") {
    url.host = "www.relusa.pt";
    url.protocol = "https:";

    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // Garantir que todas as outras requests usam HTTPS
  if (
    req.headers.get("x-forwarded-proto") === "http" &&
    hostname.includes("relusa.pt")
  ) {
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
