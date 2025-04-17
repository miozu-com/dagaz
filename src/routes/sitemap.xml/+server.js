/**
 * Dynamic sitemap generator
 *
 * This server route generates a sitemap.xml file that helps search engines
 * discover and index all pages on your site.
 */
import {domain, author, appName} from '$settings/global';

// Your website domain name
const BASE_URL = domain;

export async function GET({fetch}) {
  try {
    // Fetch blog posts for dynamic URLs
    const response = await fetch('/api/blog.json');
    const data = await response.json();
    const posts = data.compPosts || [];

    // Basic static routes
    const staticRoutes = [
      {
        url: '',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'blog',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    // Create routes for blog posts
    const blogRoutes = posts.map(post => {
      const lastmod =
        post.meta?.modified_at ?
          new Date(post.meta.modified_at.replace(/\//g, '-')).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        url: `blog/${post.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod
      };
    });

    // Combine all routes
    const allRoutes = [...staticRoutes, ...blogRoutes];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    route => `
  <url>
    <loc>${BASE_URL}/${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

    // Return the XML with appropriate headers
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`Error generating sitemap: ${error.message}`, {status: 500});
  }
}
