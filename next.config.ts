import type { NextConfig } from "next";

// Função para obter origens permitidas para CORS
const getCorsAllowedOrigins = () => {
  // Se estiver em desenvolvimento, permite todas as origens
  if (process.env.NODE_ENV === 'development') {
    return '*';
  }
  
  // Se tiver origens definidas no .env, usa-as
  if (process.env.CORS_ALLOWED_ORIGINS) {
    return process.env.CORS_ALLOWED_ORIGINS.split(',')[0];
  }
  
  // Valor padrão para produção
  return 'https://relusa.pt';
};

const nextConfig: NextConfig = {
  // Remover o header X-Powered-By para não expor que o site usa Next.js
  poweredByHeader: false,
  
  // Configurações de segurança para headers
  async headers() {
    return [
      {
        // Aplicar a todos os caminhos
        source: '/:path*',
        headers: [
          // Configurações de CORS
          {
            key: 'Access-Control-Allow-Origin',
            value: getCorsAllowedOrigins(),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
          
          // Headers de segurança
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
  
  // Configurações para imagens externas
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS 
      ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(',') 
      : [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'relusa.pt',
      },
    ],
  },
  
  // Outras configurações de segurança
  reactStrictMode: true,
};

export default nextConfig;
