---
published: true
featured: true
slug: getting-started-with-dagaz
title: Getting Started with Dagaz - A Modern SvelteKit Starter
description: Set up a high-performance SvelteKit site with minimal dependencies using the Dagaz starter kit
created_at: '2025/4/16 14:45'
modified_at: '2025/4/20 10:30'
tabs:
  - tutorial
  - development
tags:
  - svelte
  - sveltekit
  - landing-page
  - minimalist
keywords:
  - minimal sveltekit starter
  - landing page development
  - svelte 5 runes
  - business website starter
---

# Getting Started with Dagaz

Dagaz is a minimal SvelteKit starter for creating modern websites with a focus on performance and maintainability. This guide walks you through setting up your first Dagaz project.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [pnpm](https://pnpm.io/) 8.x or later 
- [Git](https://git-scm.com/) for version control

## Quick Start

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

Your site will be available at `http://localhost:5173`.

## Project Structure

Dagaz follows a modular architecture pattern:

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── data/           # Content and translations
│   ├── features/       # Feature modules
│   ├── reactiveStates/  # State management
│   ├── settings/       # Global settings
│   └── utils/          # Utility functions
├── routes/             # SvelteKit routes
├── app.css            # Global styles
└── theme.css          # Theme variables
```

## Key Concepts

### Reactive State Classes

Dagaz uses Svelte 5's runes for state management:

```javascript
// src/lib/reactiveStates/theme.svelte.js
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

This approach keeps your state logic separate from UI components, making your code more maintainable.

### Multi-language Support

Adding multiple languages is straightforward:

1. Update languages in `src/lib/data/locales.js`
2. Add translations in `src/lib/data/translations.js`
3. Use translations in components:

```svelte
<h1>{l10n.t('welcomeMessage')}</h1>
```

### Theming System

Dagaz includes a complete light/dark theme system:

```css
/* Customize themes in src/lib/themes/miozuDark.js */
export default {
  name: 'Miozu Dark',
  colors: {
    base0: '#232733', // background
    base14: '#ff9982', // accent
    // Additional colors...
  }
};
```

The theme automatically persists in localStorage and respects system preferences.

## Customizing Your Site

### Basic Settings

Edit `src/lib/settings/global.js`:

```javascript
export const author = 'Your Name';
export const contact = 'contact@example.com';
export const appName = 'My Company';
export const domain = 'https://example.com';
```

### Creating Pages

Add new pages using SvelteKit's file-based routing:

- `src/routes/about/+page.svelte` for an About page
- `src/routes/services/+page.svelte` for a Services page
- `src/routes/contact/+page.svelte` for a Contact page

## Deployment

Deploy to Cloudflare Pages:

1. Push your code to GitHub
2. Connect to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `pnpm build`
   - **Output directory**: `.svelte-kit/cloudflare`

## Next Steps

With your basic site set up, consider:

1. Adding your company's branding elements
2. Creating content for your key pages
3. Setting up analytics (Plausible, Fathom, etc.)
4. Customizing the theme to match your brand

---

*For detailed documentation and examples, visit the [Dagaz GitHub repository](https://github.com/miozu-com/dagaz).*
