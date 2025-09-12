import type { Post, SeoData } from './types';

export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    type: 'website' | 'article';
  };
  twitter: {
    card: 'summary_large_image' | 'summary';
    title: string;
    description: string;
    images: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

export function generateSEOMetadata(
  post: Post, 
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca'
): SEOMetadata {
  const seo = post.seo;
  const baseUrl = siteUrl.replace(/\/$/, '');
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  
  // Fallback values
  const title = seo?.title || post.title;
  const description = seo?.description || post.excerpt || '';
  const ogImage = seo?.ogImage?.url || post.featuredImage?.url || `${baseUrl}/og-default.jpg`;
  
  return {
    title,
    description,
    canonical: seo?.canonical || postUrl,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: postUrl,
      siteName: 'Cloud Renovation',
      images: [{
        url: ogImage,
        width: seo?.ogImage?.width || post.featuredImage?.width || 1200,
        height: seo?.ogImage?.height || post.featuredImage?.height || 630,
        alt: post.featuredImage?.alt || post.title,
      }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: [seo?.twitterImage?.url || ogImage],
    },
    robots: {
      index: !seo?.metaRobotsNoindex,
      follow: !seo?.metaRobotsNofollow,
    },
  };
}

export function generateBlogIndexSEO(siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca'): SEOMetadata {
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  return {
    title: 'Blog - Cloud Renovation',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    canonical: `${baseUrl}/blog`,
    openGraph: {
      title: 'Cloud Renovation Blog',
      description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
      url: `${baseUrl}/blog`,
      siteName: 'Cloud Renovation',
      images: [{
        url: `${baseUrl}/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: 'Cloud Renovation Blog',
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cloud Renovation Blog',
      description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
      images: [`${baseUrl}/og-blog.jpg`],
    },
  };
}

export function generateJSONLD(post: Post, siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca'): string {
  // If WordPress SEO plugin provides schema, use it
  if (post.seo?.schema) {
    return post.seo.schema;
  }

  // Otherwise generate basic Article schema
  const baseUrl = siteUrl.replace(/\/$/, '');
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.url,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Cloud Renovation Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cloud Renovation',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
  };

  return JSON.stringify(schema);
}

export function generateBreadcrumbJSONLD(
  post: Post, 
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca'
): string {
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${baseUrl}/blog`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `${baseUrl}/blog/${post.slug}`,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };

  return JSON.stringify(schema);
}