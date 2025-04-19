export async function load({fetch}) {
  try {
    const response = await fetch('/blog/api/posts.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();

    return {posts: posts || []};
  } catch (err) {
    return {
      posts: [],
      error: err.message
    };
  }
}
