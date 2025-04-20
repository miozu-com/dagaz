// Syntax highlighting utility for mdsvex using Shiki
import {escapeSvelte} from 'mdsvex';
import * as shiki from 'shiki';

// Cache the highlighter to avoid recreating it for each request
let highlighterPromise;

/**
 * Get or create the Shiki highlighter
 */
export async function getHighlighter() {
  if (!highlighterPromise) {
    // Initialize once and cache
    highlighterPromise = shiki.getHighlighter({
      theme: 'github-dark', // Using a dark theme that matches your color scheme better
      langs: [
        'javascript',
        'typescript',
        'svelte',
        'jsx',
        'tsx',
        'html',
        'css',
        'json',
        'bash',
        'markdown',
        'python',
        'scss',
        'less',
        'yaml'
      ]
    });
  }

  return highlighterPromise;
}

/**
 * Highlight code using Shiki with proper language detection and data attributes
 */
export async function highlightCode(code, lang = 'text') {
  try {
    const highlighter = await getHighlighter();

    // Get language identifier, fallback to text if not supported
    const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';

    // Generate HTML with Shiki
    const html = highlighter.codeToHtml(code, {
      lang: language
    });

    // Replace the pre tag to add a data-language attribute for the badge
    const htmlWithLanguage = html.replace(
      '<pre class="shiki"',
      `<pre class="shiki" data-language="${lang}"`
    );

    // Escape Svelte syntax but DON'T wrap in {@html } - this is what causes rendering issues
    return escapeSvelte(htmlWithLanguage);
  } catch (err) {
    console.error('Highlighting error:', err);
    // Fallback to basic escaping if highlighting fails
    return `<pre class="shiki" data-language="${lang}"><code>${escapeSvelte(code)}</code></pre>`;
  }
}

/**
 * Create a mdsvex-compatible highlighter function
 */
export function createMdsvexHighlighter() {
  return async (code, lang) => {
    const html = await highlightCode(code, lang);

    // This is critical: return the HTML without any {@html } wrapper
    // Let mdsvex handle the HTML integration
    return html;
  };
}
