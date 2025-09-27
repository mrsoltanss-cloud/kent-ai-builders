/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kent-ai-builders.vercel.app', // change to your final domain later
  generateRobotsTxt: true,
  sitemapSize: 45000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/api/*',
    '/admin*',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', disallow: '/' }, // optional: block LLM scrapers
    ],
    additionalSitemaps: [
      // add more if you create segmented sitemaps later
    ],
  },
  transform: async (config, path) => {
    // Boost importance for key pages
    let priority = 0.7;
    if (path === '/') priority = 1.0;
    if (path.startsWith('/guides')) priority = 0.9;
    if (path.startsWith('/locations')) priority = 0.9;
    if (path.startsWith('/services')) priority = 0.85;

    return {
      loc: path,
      changefreq: 'weekly',
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
