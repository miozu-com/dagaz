---
published: true
featured: true
slug: getting-started-with-dagaz
title: Getting Started with Dagaz - A Minimal SvelteKit Starter
description: Set up a fast, maintainable SvelteKit landing page with minimal dependencies and maximum flexibility
created_at: '2025/4/16 14:45'
modified_at: '2025/4/16 10:30'
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

Dagaz is a minimal SvelteKit starter designed for landing pages and content-focused sites. It prioritizes speed, simplicity, and maintainability with a functional programming approach.

This guide will walk you through setting up a new project with Dagaz and customizing it for your needs.

## Prerequisites

Before we begin, make sure you have:

- [Node.js](https://nodejs.org/) 20.x or later
- [pnpm](https://pnpm.io/) 8.x or later
- A [GitHub](https://github.com/) account (for deployment)
- A [Cloudflare](https://dash.cloudflare.com/sign-up) account (for hosting)

## Step 1: Clone and Install

Start by cloning the repository:

```bash
# Clone the repository
git clone https://github.com/miozu-com/dagaz.git my-project

# Navigate to the project directory
cd my-project

# Install dependencies
pnpm install
```

The installation process should be quick - Dagaz has just two runtime dependencies.

## Step 2: Configure Basic Settings

Let's customize the basic settings:

```javascript
// src/lib/settings/global.js
export const author = 'Your Name';
export const contact = 'contact@example.com';
export const appName = 'My Company';
export const domain = 'https://example.com';
```

## Step 3: Create Your Landing Pages

Dagaz uses SvelteKit's routing system. The main landing page is located at `src/routes/+page.svelte`. To create additional pages, simply add new files to the routes directory:

- `src/routes/about/+page.svelte` for an About page
- `src/routes/services/+page.svelte` for a Services page
- `src/routes/contact/+page.svelte` for a Contact page

## Understanding Key Features
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

To add multiple languages:

1. Update `src/lib/data/locales.js` with your language options
2. Add translations in `src/lib/data/translations.js`
3. Use translations in your components:

```svelte
<h1>{l10n.t('welcomeMessage')}</h1>
```

## Next Steps

Now that your site is up and running, consider:

1. Adding your company's logo and branding elements
2. Creating additional pages for your services or products
3. Setting up analytics (Plausible, Fathom, or Simple Analytics work well)
4. Customizing the SEO settings for better search visibility

---

*Created by [Nicholas Glazer](https://nicgl.com), frontend architect specializing in minimal, high-performance sites. Need help with your project? [Get in touch](https://nicgl.com/links).*
