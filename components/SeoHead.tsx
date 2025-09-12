import Head from 'next/head';
import type { SEOMetadata } from '../lib/seo';

interface SeoHeadProps {
  seo: SEOMetadata;
  jsonLd?: string;
  breadcrumbJsonLd?: string;
}

export default function SeoHead({ seo, jsonLd, breadcrumbJsonLd }: SeoHeadProps) {
  return (
    <Head>
      {/* Basic meta tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      
      {/* Canonical URL */}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      
      {/* Robots */}
      {seo.robots && (
        <meta 
          name="robots" 
          content={`${seo.robots.index ? 'index' : 'noindex'}, ${seo.robots.follow ? 'follow' : 'nofollow'}`} 
        />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.openGraph.title} />
      <meta property="og:description" content={seo.openGraph.description} />
      <meta property="og:url" content={seo.openGraph.url} />
      <meta property="og:site_name" content={seo.openGraph.siteName} />
      <meta property="og:type" content={seo.openGraph.type} />
      
      {/* Open Graph Images */}
      {seo.openGraph.images.map((image, index) => (
        <meta key={index} property="og:image" content={image.url} />
      ))}
      {seo.openGraph.images[0]?.width && (
        <meta property="og:image:width" content={seo.openGraph.images[0].width.toString()} />
      )}
      {seo.openGraph.images[0]?.height && (
        <meta property="og:image:height" content={seo.openGraph.images[0].height.toString()} />
      )}
      {seo.openGraph.images[0]?.alt && (
        <meta property="og:image:alt" content={seo.openGraph.images[0].alt} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={seo.twitter.card} />
      <meta name="twitter:title" content={seo.twitter.title} />
      <meta name="twitter:description" content={seo.twitter.description} />
      {seo.twitter.images[0] && (
        <meta name="twitter:image" content={seo.twitter.images[0]} />
      )}
      
      {/* JSON-LD structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      
      {/* Breadcrumb JSON-LD */}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
      )}
      
      {/* Viewport and other essentials */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}