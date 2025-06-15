import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware do Next.js
 * 
 * Atualmente configurado para permitir acesso a todas as rotas.
 * A verificação de autenticação é feita no lado do cliente através do ProtectedRoute component.
 * Esta abordagem permite melhor UX com loading states e redirecionamentos suaves.
 */
export async function middleware(req: NextRequest) {
  // Permitir acesso a todas as rotas - deixar a verificação para o ProtectedRoute
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

