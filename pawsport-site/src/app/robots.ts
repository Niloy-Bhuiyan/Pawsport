import type { MetadataRoute } from 'next';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawsport.example';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/portal'] }], sitemap: SITE + '/sitemap.xml' };
}

// fix
