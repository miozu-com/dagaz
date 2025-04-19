import {error} from '@sveltejs/kit';

export async function load({params, fetch}) {
  try {
    const slug = params.slug;
    // Updated API path to use the blog-local API endpoint
    const response = await fetch(`/blog/api/${slug}.json`);

    if (!response.ok) {
      throw error(response.status, `Failed to load blog post: ${slug}`);
    }

    const post = await response.json();

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
