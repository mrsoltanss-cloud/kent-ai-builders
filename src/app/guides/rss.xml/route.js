export const dynamic = 'force-static';

const SITE = 'https://kent-ai-builders.vercel.app'; // update when domain changes

// Add any new guides here
const GUIDES = [
  {
    slug: 'repointing-cost-kent',
    title: 'Repointing Cost in Kent (2025 Guide)',
    description:
      'Full breakdown of brick repointing costs in Kent. Prices per m², factors, and instant AI estimates.',
  },
  {
    slug: 'roof-repair-cost-kent',
    title: 'Roof Repair Cost in Kent (2025 Guide)',
    description:
      'Leak fixes, valley lead replacement, and new tiles — average pricing for Kent homeowners.',
  },
  {
    slug: 'loft-conversion-cost-kent',
    title: 'Loft Conversion Cost in Kent (2025 Guide)',
    description:
      'Rooflight, dormer, hip-to-gable and mansard — how much they cost in 2025.',
  },
];

export async function GET() {
  const items = GUIDES.map((g) => {
    const url = `${SITE}/guides/${g.slug}`;
    return `
      <item>
        <title><![CDATA[${g.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <description><![CDATA[${g.description}]]></description>
      </item>
    `;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[TradeSure Guides]]></title>
      <link>${SITE}/guides</link>
      <description><![CDATA[Cost guides & advice for Kent homeowners]]></description>
      <language>en-gb</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
