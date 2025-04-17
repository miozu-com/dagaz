/**
 * Dynamic robots.txt generator
 *
 * This server route generates a robots.txt file that provides instructions
 * to search engine crawlers about what pages they can or cannot request
 * from your site.
 */

import {domain} from '$settings/global';

// Your efault URL
const BASE_URL = domain;

export function GET() {
  // Create robots.txt content with basic rules and sitemap reference
  const robotsTxt = `# robots.txt for ${BASE_URL}
User-agent: *
Allow: /

# Disallow certain paths if needed
# Disallow: /api/

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml
`;

  // Return the content with appropriate headers
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=3600'
    }
  });
}
