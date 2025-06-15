import { NextResponse } from 'next/server';

export async function GET() {
  // URLs estáticas
  const baseUrl = 'https://www.relusa.pt';
  const staticPages = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contactos`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/termos`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/marcacoes`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9,
    },
  ];

  // Gerar XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  // Retornar resposta XML
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 