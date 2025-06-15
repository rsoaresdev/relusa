import { MetadataRoute } from 'next';

type ChangeFrequency = 'daily' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'weekly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URLs estáticas
  const staticRoutes = [
    {
      url: 'https://relusa.pt',
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: 'https://relusa.pt/sobre',
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: 'https://relusa.pt/contactos',
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: 'https://relusa.pt/termos',
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: 'https://relusa.pt/privacidade',
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: 'https://relusa.pt/marcacoes',
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
  ];

  return [...staticRoutes];
} 