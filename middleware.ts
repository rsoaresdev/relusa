import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lidar especificamente com requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    // Criar uma resposta vazia com status 200
    const response = new NextResponse(null, { status: 200 });
    
    // Adicionar headers CORS necessários
    response.headers.set('Access-Control-Allow-Origin', 
      process.env.NODE_ENV === 'production' ? 'https://relusa.pt' : '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }
  
  // Para outras requisições, continuar normalmente
  return NextResponse.next();
}

// Configurar quais caminhos devem passar pelo middleware
export const config = {
  // Aplicar apenas a rotas da API
  matcher: '/api/:path*',
}; 