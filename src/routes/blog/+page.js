export async function load({fetch}) {
  try {
    console.log('Fetching blog posts data...');
    const response = await fetch('/api/blog.json');

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();
    console.log('posts', posts);

    return {posts: posts || []};
  } catch (err) {
    console.error('Error in blog/+page.js: ', err);
    return {
      posts: [],
      error: err.message
    };
  }
}
