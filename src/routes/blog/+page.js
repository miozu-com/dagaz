export async function load({fetch}) {
  try {
    console.log('Fetching blog posts data...');
    const response = await fetch('/api/blog.json');

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received blog data with ${data.compPosts?.length || 0} posts`);

    if (data.error) {
      console.error('Error from API:', data.error);
      return {
        posts: [],
        error: data.error
      };
    }

    // Ensure we always return an array, even if the API response structure changes
    const posts = data.compPosts || [];

    console.log('Post slugs:', posts.map(p => p.slug).join(', '));

    return {posts};
  } catch (err) {
    console.error('Error in blog/+page.js: ', err);
    return {
      posts: [],
      error: err.message
    };
  }
}
