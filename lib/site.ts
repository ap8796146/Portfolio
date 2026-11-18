// Public URL of the deployed site. Set NEXT_PUBLIC_SITE_URL in production
// (e.g. https://aryanpathak.dev) so canonical URLs, the sitemap and social
// share images point to the right domain.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
