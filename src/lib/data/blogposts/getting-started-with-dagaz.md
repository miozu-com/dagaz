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

Each page can use the same pattern:

```svelte
<script>
  import {fade} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  
  // Get localization from props
  let {data} = $props();
  const l10n = data.l10n;
</script>

<!-- SEO Metadata -->
<Metadata
  title="Page Title | My Company"
  description="Page description here"
/>

<div in:fade={{duration: 300}}>
  <!-- Your page content here -->
</div>
```

## Step 4: Customize the Theme

Dagaz includes a built-in theme system. Modify colors in `src/theme.css`:

```css
@theme {
  --color-base0: #232733; /* Background */
  --color-base14: #ff9982; /* Primary accent */
  /* Additional colors... */
}
```

## Step 5: Run Locally

Test your site locally:

```bash
pnpm dev
```

Visit `http://localhost:5173` in your browser to see your site in action.

## Step 6: Deploy to Cloudflare Pages

Deploy your site to Cloudflare Pages:

1. Push your project to GitHub
2. Log in to Cloudflare and navigate to **Pages**
3. Click **Create a project**
4. Connect your GitHub account and select your repository
5. Configure build settings:
   - **Build command**: `pnpm build`
   - **Output directory**: `.svelte-kit/cloudflare`

After a few minutes, your site will be live at `https://my-project.pages.dev`.

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
