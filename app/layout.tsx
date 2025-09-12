import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Cloud Renovation Blog',
    template: '%s | Cloud Renovation'
  },
  description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
  keywords: ['home renovation', 'kitchen remodeling', 'bathroom renovation', 'home improvement', 'interior design'],
  authors: [{ name: 'Cloud Renovation Team' }],
  creator: 'Cloud Renovation',
  publisher: 'Cloud Renovation',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca',
    siteName: 'Cloud Renovation',
    title: 'Cloud Renovation Blog',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Cloud Renovation Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Renovation Blog',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}