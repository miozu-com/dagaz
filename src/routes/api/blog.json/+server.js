// src/routes/api/blog.json/+server.js
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
    // Create highlighter only once with enhanced configuration
    if (!highlighter) {
      try {
        // Create a theme using CSS variables for dynamic switching
        const myTheme = createCssVariablesTheme({
          name: 'css-variables',
          variablePrefix: '--shiki-',
          variableDefaults: {},
          fontStyle: true
        });

        // Initialize highlighter with more language support
        highlighter = await createHighlighter({
          themes: [myTheme],
          langs: [
            'css',
            'javascript',
            'typescript',
            'jsx',
            'tsx',
            'svelte',
            'html',
            'xml',
            'bash',
            'shell',
            'markdown',
            'json',
            'yaml',
            'sql',
            'rust',
            'python',
            'php',
            'go',
            'c',
            'cpp',
            'java',
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
    // Parse frontmatter with improved handling
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const frontmatterMatch = post.content.match(frontmatterRegex);

    let meta = {};
    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatterLines = frontmatterMatch[1].trim().split('\n');

      for (const line of frontmatterLines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();

          // Handle arrays in frontmatter (like tags, tabs)
          if (value.startsWith('[') && value.endsWith(']')) {
            meta[key] = value
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
              meta[key] = value.slice(1, -1);
            } else {
              meta[key] = value;
            }
          }
        }
      }
    }

    // Set up MDSvex options with enhanced highlighting
    const mdsvexOptions = {
      extensions: ['.md'],
      highlight: {
        highlighter: async (code, lang = 'text') => {
          try {
            // Auto-detect Svelte content
            const svelteTags = [
              '<script',
              '<style',
              '{#if',
              '{#each',
              '{:else}',
              '$state',
              '$props'
            ];
            if (!lang || lang === 'text') {
              for (const tag of svelteTags) {
                if (code.includes(tag)) {
                  lang = 'svelte';
                  break;
                }
              }
            }

            // Auto-detect JavaScript
            if (!lang || lang === 'text') {
              const jsPatterns = [
                'function',
                'const ',
                'let ',
                'var ',
                '=>',
                'return',
                'import',
                'export',
                'class ',
                'new ',
                'async ',
                'await '
              ];
              for (const pattern of jsPatterns) {
                if (code.includes(pattern)) {
                  lang = 'javascript';
                  break;
                }
              }
            }

            // Create HTML with language data attribute for CSS styling
            const html = highlighter.codeToHtml(code, {
              lang: lang || 'text',
              theme: 'css-variables'
            });

            // Add language identification to pre tag
            const enhancedHtml = html.replace(
              '<pre class="',
              `<pre data-language="${lang || 'text'}" class="`
            );

            return mdsvexLib.escapeSvelte(enhancedHtml);
          } catch (err) {
            console.error(`Highlighting error for ${lang}:`, err);
            return `<pre class="error-highlight" data-language="${lang || 'text'}"><code>${code}</code></pre>`;
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

      // Cleaning of problematic content
      const cleanedContent = contentWithoutFrontmatter
        // Remove placeholder.com URLs completely and replace with reasonable defaults for images
        .replace(/https?:\/\/via\.placeholder\.com\/[^"'\s]*/g, '');

      const compiled = await mdsvexLib.compile(cleanedContent, mdsvexOptions);
      compiledContent = compiled.code;

      // Fix image markdown to ensure they don't try to link to placeholder
      compiledContent = compiledContent.replace(
        /!\[.*?\]\(https?:\/\/via\.placeholder\.com\/[^)]*\)/g,
        ''
      );

      // Improve code block readability with line numbering for longer blocks
      compiledContent = compiledContent.replace(
        /<pre([^>]*)>([\s\S]*?)<\/pre>/g,
        (match, attrs, content) => {
          // Count number of lines in the code block
          const lineCount = (content.match(/\n/g) || []).length;

          // Only add line numbers for blocks with 5+ lines
          if (lineCount >= 5) {
            return `<pre${attrs} data-line-numbers="true">${content}</pre>`;
          }

          return match;
        }
      );
    } catch (error) {
      console.error(`MDSvex compile error for ${post.slug}:`, error);
      compiledContent = `<p class="error">Error compiling content: ${error.message}</p>`;
    }

    // Calculate read time (improved formula: 200 words per minute for normal text, slower for code)
    const wordCount = post.content.split(/\s+/).length;
    const codeBlockCount = (post.content.match(/```/g) || []).length / 2;
    const codeComplexity = codeBlockCount * 50; // Add 50 words equivalent for each code block
    const adjustedWordCount = wordCount + codeComplexity;
    const readMinutes = Math.max(1, Math.ceil(adjustedWordCount / 200));

    // Generate table of contents with improved heading processing
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
    // Extract headings using regex - improved to catch more heading formats
    const headingRegex = /^(#{1,6})\s+(.+?)(?:\s*{#([a-z0-9-]+)})?$/gm;
    const matches = [...content.matchAll(headingRegex)];

    const headings = matches.map(match => {
      const level = match[1].length;
      const text = match[2].trim();

      // Try to get custom ID from {#custom-id} format if present
      let id = match[3] || null;

      // If no custom ID, generate one from the text
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '') // Remove special chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-'); // Replace multiple hyphens with single
      }

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
