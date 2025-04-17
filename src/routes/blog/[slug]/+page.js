// src/routes/blog/[slug]/+page.js
import {error} from '@sveltejs/kit';

// Set to dynamic to ensure the latest content is fetched
export const prerender = false;

export async function load({params, fetch}) {
  try {
    const slug = params.slug;
    console.log(`Loading blog post with slug: ${slug}`);

    // Fetch the blog data from our API
    const response = await fetch('/api/blog.json');

    if (!response.ok) {
      console.error(`Failed to fetch blog data: ${response.status}`);
      throw error(response.status, 'Failed to load blog data');
    }

    const data = await response.json();

    if (data.error) {
      console.error('Error from API:', data.error);
      throw error(500, data.error);
    }

    const compPosts = data.compPosts || [];

    console.log(`Received ${compPosts.length} posts, looking for slug "${slug}"`);

    // Log all available slugs to help debug
    const availableSlugs = compPosts.map(p => p.slug);
    console.log(`Available slugs: ${availableSlugs.join(', ')}`);

    // Find the post with the matching slug
    const post = compPosts.find(p => p.slug === slug);

    if (!post) {
      console.error(
        `Post with slug "${slug}" not found. Available slugs: ${availableSlugs.join(', ')}`
      );
      throw error(404, `Post "${slug}" not found`);
    }

    // Make sure post has necessary properties
    const safePost = {
      slug: post.slug,
      meta: post.meta || {
        title: `${post.slug}`,
        description: '',
        tags: []
      },
      code: post.code || '<p>Content unavailable</p>',
      toc: post.toc || {id: post.slug, data: [], raw: []}
    };

    // Log the found post to help debug
    console.log(`Found post: ${safePost.slug}`, {
      hasTitle: !!safePost.meta?.title,
      hasCode: !!safePost.code,
      metaKeys: Object.keys(safePost.meta || {})
    });

    return {
      post: safePost
    };
  } catch (err) {
    console.error('Error in blog/[slug]/+page.js:', err);

    // If it's already an error object thrown by us, just rethrow it
    if (err.status && err.message) {
      throw err;
    }

    // Otherwise create a new error
    throw error(500, `Error loading blog post: ${err.message}`);
  }
}
