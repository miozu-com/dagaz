export async function load({fetch}) {
  try {
    console.log('Fetching blog posts data...');
    const response = await fetch('/api/blog.json');

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('Error from API:', data.error);
      return {
        posts: [],
        error: data.error
      };
    }

    // Add some logging to debug the structure of posts
    console.log(`Retrieved ${data.compPosts?.length || 0} blog posts`);
    if (data.compPosts && data.compPosts.length > 0) {
      console.log('First post metadata:', data.compPosts[0].meta);

      // Check if posts have tabs and tags
      const hasTabs = data.compPosts.some(post => post.meta?.tabs?.length > 0);
      const hasTags = data.compPosts.some(post => post.meta?.tags?.length > 0);
      console.log(`Posts have tabs: ${hasTabs}, Posts have tags: ${hasTags}`);
    }

    return {posts: data.compPosts || []};
  } catch (err) {
    console.error('Error in blog/+page.js: ', err);
    return {
      posts: [],
      error: err.message
    };
  }
}
