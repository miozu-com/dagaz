// Syntax highlighting utility for mdsvex using Shiki v3
import {escapeSvelte} from 'mdsvex';
import {createHighlighter, createCssVariablesTheme} from 'shiki';

// Cache the highlighter to avoid recreating it for each request
let highlighterPromise;

/**
 * Get or create the Shiki highlighter with CSS variables theme
 */
export async function getHighlighter() {
  if (!highlighterPromise) {
    // Create a CSS variables theme that will use your CSS variables
    const myTheme = createCssVariablesTheme({
      name: 'css-variables',
      variablePrefix: '--shiki-',
      variableDefaults: {},
      fontStyle: true
    });

    // Initialize once and cache - using correct Shiki v3 API
    highlighterPromise = createHighlighter({
      themes: [myTheme],
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

    // Generate HTML with Shiki
    const html = highlighter.codeToHtml(code, {
      lang: lang || 'text',
      theme: 'css-variables' // Use our CSS variables theme
    });

    // Replace the pre tag to add a data-language attribute for the badge
    const htmlWithLanguage = html.replace(
      '<pre class="shiki"',
      `<pre class="shiki" data-language="${lang}"`
    );

    // Escape Svelte syntax but DON'T wrap in {@html }
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
    // Return the HTML without any {@html } wrapper
    // Let mdsvex handle the HTML integration
    return html;
  };
}
