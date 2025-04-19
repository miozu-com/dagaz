import {error} from '@sveltejs/kit';

export async function load({params, fetch}) {
  try {
    const slug = params.slug;
    const response = await fetch('/api/blog.json');

    if (!response.ok) {
      throw error(response.status, 'Failed to load blog data');
    }

    const posts = await response.json();

    // Find the post with the matching slug
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      throw error(404, `Post "${slug}" not found`);
    }

    return {
      post
    };
  } catch (err) {
    // If it's already an error object thrown by us, just rethrow it
    if (err.status && err.message) {
      throw err;
    }

    // Otherwise create a new error
    throw error(500, `Error loading blog post: ${err.message}`);
  }
}
