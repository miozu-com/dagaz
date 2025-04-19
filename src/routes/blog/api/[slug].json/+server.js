import {json} from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import * as mdsvexLib from 'mdsvex';

/**
 * Handles GET requests for blog posts by reading and parsing Markdown files
 */
export async function GET({params}) {
  const {slug} = params;

  try {
    // Define path to blog posts
    const postsDirectory = path.join(process.cwd(), 'src', 'lib', 'data', 'blogposts');

    // Try both .md extension and no extension (in case the slug already includes it)
    let filePath = path.join(postsDirectory, `${slug}.md`);

    // If the file doesn't exist with .md, try checking if slug already includes the extension
    if (!fs.existsSync(filePath) && !slug.endsWith('.md')) {
      // Maybe the slug already includes the extension?
      const altPath = path.join(postsDirectory, slug);
      if (fs.existsSync(altPath)) {
        filePath = altPath;
      }
    }

    // Log the file path we're trying to access for debugging
    console.log(`Looking for blog post at: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return new Response(JSON.stringify({error: 'Post not found', path: filePath}), {
        status: 404,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log(`File content length: ${fileContent.length} characters`);

    // Extract frontmatter and content
    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

    if (!frontmatterMatch) {
      console.error('No frontmatter found in file');
      return new Response(JSON.stringify({error: 'Invalid post format - no frontmatter found'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    const frontmatterContent = frontmatterMatch[1];
    const bodyContent = fileContent.slice(frontmatterMatch[0].length);

    // Parse frontmatter
    const meta = parseFrontmatter(frontmatterContent);
    console.log('Parsed frontmatter:', meta);

    // Make sure post is published
    if (!meta.published) {
      return new Response(JSON.stringify({error: 'Post not published'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Create full metadata with defaults
    const fullMeta = {
      ...meta,
      title: meta.title || 'Untitled Post',
      description: meta.description || '',
      tags: meta.tags || [],
      tabs: meta.tabs || [],
      created_at: meta.created_at || '',
      modified_at: meta.modified_at || '',
      readMin: calculateReadTime(bodyContent)
    };

    // Generate table of contents
    const toc = generateTableOfContents(bodyContent);

    // Properly compile the markdown with mdsvex instead of just returning raw markdown
    const compiled = await mdsvexLib.compile(bodyContent, {
      smartypants: true,
      remarkPlugins: [],
      rehypePlugins: []
    });

    // Return the complete post data
    return json({
      slug,
      meta: fullMeta,
      code: compiled.code, // Return the properly compiled svelte code
      toc
    });
  } catch (err) {
    console.error(`Error loading blog post '${slug}':`, err);

    return new Response(
      JSON.stringify({
        error: 'Failed to load blog post',
        message: err.message,
        stack: err.stack
      }),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      }
    );
  }
}

/**
 * Parse frontmatter content into an object
 */
function parseFrontmatter(content) {
  const meta = {};

  // Split into lines and process each line
  content.split('\n').forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;

    // Find the first colon to separate key and value
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle different value types
    if (value === 'true') {
      // Boolean true
      meta[key] = true;
    } else if (value === 'false') {
      // Boolean false
      meta[key] = false;
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Array values
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      // String with single quotes
      meta[key] = value.slice(1, -1);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      // String with double quotes
      meta[key] = value.slice(1, -1);
    } else {
      // Regular string value
      meta[key] = value;
    }
  });

  return meta;
}

/**
 * Generate a table of contents from Markdown content
 */
function generateTableOfContents(content) {
  const headings = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({level, text, id});
  }

  return {id: 'toc', data: headings};
}

/**
 * Calculate approximate read time based on content length
 */
function calculateReadTime(content) {
  if (!content) return 1;

  // Average reading speed: 200 words per minute
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
