import {json} from '@sveltejs/kit';
import * as mdsvexLib from 'mdsvex';
import {createHighlighter, createCssVariablesTheme} from 'shiki';
import rehypeSlug from 'rehype-slug';

// Shared highlighter instance
let highlighter;

export async function GET() {
  try {
    const blogposts = await getBlogPosts();
    return json(blogposts);
  } catch (err) {
    console.error('Error in blog.json route:', err);
    return json({error: 'Failed to load blog posts', compPosts: []}, {status: 500});
  }
}

async function getBlogPosts() {
  try {
    // Create highlighter only once
    if (!highlighter) {
      try {
        const myTheme = createCssVariablesTheme({
          name: 'css-variables',
          variablePrefix: '--shiki-',
          variableDefaults: {},
          fontStyle: true
        });

        highlighter = await createHighlighter({
          themes: [myTheme],
          langs: [
            'css',
            'javascript',
            'typescript',
            'svelte',
            'html',
            'bash',
            'markdown',
            'json',
            'text'
          ]
        });
      } catch (err) {
        console.error('Error creating highlighter:', err);
        // Fallback highlighting function that doesn't throw errors
        highlighter = {
          codeToHtml: (code, opts) => `<pre class="fallback-highlight"><code>${code}</code></pre>`
        };
      }
    }

    // Use the correct glob pattern for Vite
    const paths = import.meta.glob('../../../lib/data/blogposts/**/*.md', {
      query: '?raw',
      import: 'default',
      eager: true
    });

    // Log the paths to help debug
    console.log('Blog post paths found:', Object.keys(paths));

    const rawPosts = [];

    // Process each path
    for (const [path, content] of Object.entries(paths)) {
      const pathSegments = path.split('/');
      const fileName = pathSegments[pathSegments.length - 1];
      const slug = fileName.replace('.md', '');

      console.log(`Processing: ${path}, slug: ${slug}`);

      if (slug) {
        rawPosts.push({
          path,
          slug,
          content
        });
      }
    }

    console.log(`Processing ${rawPosts.length} posts`);

    // Compile each post to HTML
    const compPosts = [];

    for (const post of rawPosts) {
      try {
        const result = await compileMarkdown(post);
        compPosts.push(result);
      } catch (error) {
        console.error(`Error processing post ${post.slug}:`, error);
        // Add a minimal valid post object instead of skipping
        compPosts.push({
          slug: post.slug,
          meta: {
            title: `Error in ${post.slug}`,
            description: "This post couldn't be processed correctly",
            published: true
          },
          code: `<p class="error">Error processing content: ${error.message}</p>`,
          toc: {id: post.slug, data: [], raw: []}
        });
      }
    }

    // Filter only published posts and sort by date (newest first)
    const publishedPosts = compPosts
      .filter(post => post.meta?.published)
      .sort((a, b) => {
        // Sort by created_at date, newest first
        const dateA =
          a.meta?.created_at ? new Date(a.meta.created_at.replace(/\//g, '-')) : new Date(0);
        const dateB =
          b.meta?.created_at ? new Date(b.meta.created_at.replace(/\//g, '-')) : new Date(0);
        return dateB - dateA;
      });

    console.log(`Found ${publishedPosts.length} published posts`);

    return {compPosts: publishedPosts};
  } catch (err) {
    console.error('Error in getBlogPosts:', err);
    throw err;
  }
}

async function compileMarkdown(post) {
  try {
    // Parse frontmatter
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const frontmatterMatch = post.content.match(frontmatterRegex);

    let meta = {};
    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatterLines = frontmatterMatch[1].trim().split('\n');

      for (const line of frontmatterLines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim();

          // Handle arrays in frontmatter (like tags, tabs)
          if (value.startsWith('[') && value.endsWith(']')) {
            meta[key.trim()] = value
              .slice(1, -1)
              .split(',')
              .map(item => item.trim());
          }
          // Handle string values
          else {
            // Remove quotes if present
            if (
              (value.startsWith("'") && value.endsWith("'")) ||
              (value.startsWith('"') && value.endsWith('"'))
            ) {
              meta[key.trim()] = value.slice(1, -1);
            } else {
              meta[key.trim()] = value;
            }
          }
        }
      }
    }

    // Set up MDSvex options
    const mdsvexOptions = {
      extensions: ['.md'],
      highlight: {
        highlighter: async (code, lang = 'text') => {
          try {
            return mdsvexLib.escapeSvelte(
              highlighter.codeToHtml(code, {
                lang: lang || 'text',
                theme: 'css-variables'
              })
            );
          } catch (err) {
            console.error(`Highlighting error for ${lang}:`, err);
            return `<pre class="error-highlight"><code>${code}</code></pre>`;
          }
        }
      },
      rehypePlugins: [rehypeSlug]
    };

    // Compile markdown to HTML
    let compiledContent;
    try {
      // Remove frontmatter before compiling
      const contentWithoutFrontmatter = post.content.replace(frontmatterRegex, '');

      // More aggressive cleaning of problematic content
      const cleanedContent = contentWithoutFrontmatter
        // Remove common function and reactive patterns that can cause rendering issues
        .replace(/\$derived\s*\(\(\)\s*=>\s*\{[\s\S]*?\}\);?/g, '')
        .replace(/\$effect\s*\(\(\)\s*=>\s*\{[\s\S]*?\}\);?/g, '')
        .replace(/function\s*\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/g, '')
        .replace(/^\(\)\s*=>\s*\{\s*try\s*\{/g, '')
        .replace(/return\s*\{\s*code\s*:\s*`/g, '')
        .replace(/`\s*,\s*map\s*:\s*\{\s*\}\s*\}\s*\}\s*catch\s*\(e\)\s*\{/g, '')
        .replace(/console\.log\(e\);\s*return\s*\{/g, '')
        .replace(/code\s*:\s*e\.toString\(\),\s*map\s*:\s*\{\s*\}\s*\}/g, '')
        .replace(/\}\s*\}/g, '')
        // Remove placeholder.com URLs completely and replace with reasonable defaults for images
        .replace(/https?:\/\/via\.placeholder\.com\/[^"'\s]*/g, '');

      const compiled = await mdsvexLib.compile(cleanedContent, mdsvexOptions);
      compiledContent = compiled.code;

      // Fix image markdown to ensure they don't try to link to placeholder
      compiledContent = compiledContent.replace(
        /!\[.*?\]\(https?:\/\/via\.placeholder\.com\/[^)]*\)/g,
        ''
      );
    } catch (error) {
      console.error(`MDSvex compile error for ${post.slug}:`, error);
      compiledContent = `<p class="error">Error compiling content: ${error.message}</p>`;
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = post.content.split(/\s+/).length;
    const readMinutes = Math.ceil(wordCount / 200);

    // Generate table of contents
    const toc = generateTOC(post.content, post.slug);

    return {
      slug: post.slug,
      meta: {...meta, readMin: readMinutes},
      code: compiledContent,
      toc
    };
  } catch (error) {
    console.error(`Error in compileMarkdown for ${post.slug}:`, error);
    throw error;
  }
}

function generateTOC(content, slug) {
  try {
    // Extract headings using regex
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];

    const headings = matches.map(match => {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-');

      return {
        level,
        text,
        id
      };
    });

    return {
      id: slug,
      data: headings,
      raw: matches.map(match => match[0])
    };
  } catch (error) {
    console.error(`Error generating TOC for ${slug}:`, error);
    return {id: slug, data: [], raw: []};
  }
}
