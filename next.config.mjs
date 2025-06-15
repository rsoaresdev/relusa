// Função para obter origens permitidas para CORS
const getCorsAllowedOrigins = () => {
  // Se estiver em desenvolvimento, permite todas as origens
  if (process.env.NODE_ENV === "development") {
    return "*";
  }

  // Se tiver origens definidas no .env, usa-as
  if (process.env.CORS_ALLOWED_ORIGINS) {
    return process.env.CORS_ALLOWED_ORIGINS.split(",")[0];
  }

  // Valor padrão para produção
  return "https://relusa.pt";
};

const nextConfig = {
  // Remover o header X-Powered-By para não expor que o site usa Next.js
  poweredByHeader: false,

  // Configurações de segurança para headers
  async headers() {
    return [
      {
        // Aplicar a todos os caminhos
        source: "/:path*",
        headers: [
          // Configurações de CORS
          {
            key: "Access-Control-Allow-Origin",
            value: getCorsAllowedOrigins(),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },

          // Headers de segurança
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Configuração específica para a rota de callback OAuth
      {
        source: "/auth/callback",
        headers: [
          // Headers de segurança mais permissivos para a rota de callback
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://*.cdninstagram.com https://*.fbcdn.net https://www.google-analytics.com;
              font-src 'self';
              connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://www.google-analytics.com;
              frame-src 'self' https://*.instagram.com https://*.google.com https://accounts.google.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
      // Configuração padrão de CSP para outras rotas
      {
        source: "/((?!auth/callback).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://*.cdninstagram.com https://*.fbcdn.net https://www.google-analytics.com;
              font-src 'self';
              connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://www.google-analytics.com;
              frame-src 'self' https://*.instagram.com https://*.google.com https://accounts.google.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },

  // Configurações para imagens externas
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "relusa.pt",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
    ],
  },

  // Outras configurações de segurança
  reactStrictMode: true,
  
  // Configurações de redirecionamento para SEO
  async redirects() {
    return [
      // Redirecionar URLs sem barra final para URLs com barra final (exceto para rotas de autenticação)
      {
        source: '/:path((?!.+\\..+|_next|auth).*)',
        has: [
          {
            type: 'host',
            value: 'relusa.pt',
          },
        ],
        destination: '/:path/',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
