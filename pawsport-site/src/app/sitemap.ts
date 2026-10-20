import type { MetadataRoute } from 'next';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawsport.example';
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/","/destinations","/plan-builder","/how-it-works","/pricing","/for-teams","/partners","/resources","/contact","/start","/start/quick","/for-teams/demo","/partners/apply","/privacy","/terms"].map((p) => ({ url: SITE + p, changeFrequency: 'monthly', priority: p === '/' ? 1 : 0.7 }));
}

// updated
