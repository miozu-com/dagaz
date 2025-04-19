<div align="center">

# ᛞ Dagaz - Minimal SvelteKit Starter

<img src="https://via.placeholder.com/1200x300/232733/FF9982?text=Dagaz:+Minimal+SvelteKit+Starter" alt="Dagaz Preview" width="700">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00)](https://svelte.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-0EA5E9)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020)](https://pages.cloudflare.com/)

</div>

## About

Dagaz is a streamlined SvelteKit starter for business landing pages and content-focused sites. It combines modern architecture with performance optimization to create a solid foundation for developing fast, maintainable web projects.

## Key Features

- **Svelte 5 Runes Architecture** - Modern, efficient state management built-in
- **Fast Load Times** - Optimized for performance with smart asset loading
- **Cloudflare Pages Ready** - Deploy globally with minimal configuration
- **Functional Programming Patterns** - Clean, testable code structure
- **Modular Architecture** - Organized for maintainability and extensibility
- **Canvas API Support** - Native visualizations without external libraries
- **Dark/Light Theme** - Built-in theme system with persistence
- **Multi-language** - Support for multiple languages with easy configuration
- **SEO Optimized** - Built-in metadata management and best practices
- **PWA Support** - Service worker and offline functionality included

## Getting Started

Prerequisites: Node.js 20+ and PNPM 8+

```bash
# Clone the repository
git clone https://github.com/miozu-com/dagaz.git my-project

# Navigate to the project directory
cd my-project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Structure

```
dagaz/
├── src/
│   ├── lib/
│   │   ├── components/    # Reusable UI components
│   │   ├── data/          # Content and translations
│   │   ├── features/      # Feature modules (layout, i18n)
│   │   ├── reactiveStates/ # State management with Svelte 5 runes
│   │   ├── settings/      # Global settings
│   │   └── utils/         # Utility functions
│   ├── routes/            # SvelteKit routes
│   ├── app.css           # Global styles
│   └── theme.css         # Theme variables
└── static/               # Static assets
```

## Reactive State Management

Dagaz uses Svelte 5's runes for clean, maintainable state:

```javascript
// Example reactive state class
export class ThemeReactiveState {
  _themeState = $state(false); // false = light, true = dark
  
  get isDark() {
    return this._themeState;
  }
  
  toggle() {
    this._themeState = !this._themeState;
    localStorage.setItem('app-theme', JSON.stringify(this._themeState));
  }
}
```

## Creating Content

Dagaz supports content in Markdown format with frontmatter:

```markdown
---
published: true
slug: about-us
title: About Our Company
description: Learn about our services and expertise
---

## About Our Company

Content here...
```

## Customization

### Theme Colors

Modify the theme in `src/theme.css`:

```css
@theme {
  --color-base0: #232733; /* Background */
  --color-base14: #ff9982; /* Primary accent */
  /* Additional colors... */
}
```

### Site Information

Update your site details in `src/lib/settings/global.js`:

```javascript
export const author = 'Your Name';
export const contact = 'your.email@example.com';
export const appName = 'My Company';
```

## Deployment

Deploy to Cloudflare Pages:

1. Push your code to GitHub
2. Connect to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `pnpm build`
   - **Output directory**: `.svelte-kit/cloudflare`

## Why Choose Dagaz?

- **Architecture-First Approach** - Organized for maintainability from day one
- **Performance-Optimized** - Consistently scores 98+ on Lighthouse
- **Developer Experience** - Fast HMR with Vite for quick iteration
- **SEO Ready** - Built-in metadata management, sitemaps, and best practices
- **Functional Patterns** - Predictable, testable approach for complex applications

## Available Services

Need assistance with your web project? I'm available for:

- Custom SvelteKit development
- Landing page and content site creation
- Application architecture consulting
- Performance optimization

Learn more at [nicgl.com](https://nicgl.com)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Created by <a href="https://github.com/nicholasglazer">Nicholas Glazer</a></p>
</div>
