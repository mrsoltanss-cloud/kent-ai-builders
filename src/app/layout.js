import './globals.css';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://kent-ai-builders.vercel.app'), // change when you move to final domain
  title: {
    default: 'TradeSure — Kent’s AI-Powered Builder',
    template: '%s | TradeSure',
  },
  description:
    'Get instant, fair AI-powered estimates and verified local builders in Kent. Fully insured, guaranteed work, and free site surveys.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'TradeSure',
    url: 'https://kent-ai-builders.vercel.app',
    title: 'TradeSure — Kent’s AI-Powered Builder',
    description:
      'Instant estimates • Verified builders • Guaranteed work. Serving Kent.',
    images: [
      {
        url: '/images/hero-kitchen.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSure — AI-Powered Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeSure — Kent’s AI-Powered Builder',
    description:
      'Instant estimates • Verified builders • Guaranteed work. Serving Kent.',
    images: ['/images/hero-kitchen.jpg'],
  },
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TradeSure',
    url: 'https://kent-ai-builders.vercel.app',
    logo: 'https://kent-ai-builders.vercel.app/images/hero-kitchen.jpg',
    sameAs: [
      // add socials when ready
    ],
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'TradeSure',
    url: 'https://kent-ai-builders.vercel.app',
    areaServed: 'Kent, UK',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Kent',
      addressCountry: 'GB',
    },
    telephone: '+447000000000',
    priceRange: '££',
    image: ['https://kent-ai-builders.vercel.app/images/hero-kitchen.jpg'],
    openingHours: 'Mo-Sa 08:00-18:00',
  };

  return (
    <html lang="en">
      <body>{children}</body>
      {/* Organization + LocalBusiness JSON-LD */}
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="localbusiness-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        strategy="afterInteractive"
      />
    </html>
  );
}
