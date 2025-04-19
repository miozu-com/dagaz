import {json} from '@sveltejs/kit';
import {pipe, sort, descend, prop, split, last, replace, toPairs, filter, map, is} from 'ramda';

async function getBlogPosts() {
  const paths = import.meta.glob('/src/lib/data/blogposts/*.md', {eager: true});

  const getSlugFromPath = pipe(split('/'), last, replace('.md', ''));

  return pipe(
    toPairs,
    filter(([path, file]) => {
      return file.metadata.published && is(Object, file) && getSlugFromPath(path);
    }),
    map(([path, file]) => ({
      slug: getSlugFromPath(path),
      meta: {
        ...file.metadata,
        title: file.metadata.title || 'Untitled Post',
        description: file.metadata.description || '',
        tags: file.metadata.tags || [],
        tabs: file.metadata.tabs || [],
        created_at: file.metadata.created_at || '',
        modified_at: file.metadata.modified_at || '',
        readMin: calculateReadTime(file.metadata.description || '')
      }
    })),
    sort(descend(post => new Date(post.meta.created_at)))
  )(paths);
}

// Calculate approximate read time based on text content
function calculateReadTime(content) {
  if (!content) return 1;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function GET() {
  const blogposts = await getBlogPosts();
  return json(blogposts);
}
