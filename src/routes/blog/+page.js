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

    return {posts: data.compPosts || []};
  } catch (err) {
    console.error('Error in blog/+page.js: ', err);
    return {
      posts: [],
      error: err.message
    };
  }
}
