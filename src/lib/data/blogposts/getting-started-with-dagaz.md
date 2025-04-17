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

Dagaz is a minimal SvelteKit starter designed for landing pages and content-focused sites. It prioritizes speed, simplicity, and maintainability by keeping dependencies to a minimum.

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

export const githubRepo = 'https://github.com/yourusername/my-project';
export const codebergRepo = ''; // Optional

export const appName = 'My Company';
export const domain = 'https://example.com';
```

## Step 3: Create Your Landing Pages

Dagaz uses SvelteKit's routing system. The main landing page is located at `src/routes/+page.svelte`.

Here's an example of a simple landing page:

```svelte
<script>
  import {fade} from 'svelte/transition';
  import {Button} from '$components/jera';
  import Metadata from '$features/seo/Metadata.svelte';
  import {appName, domain} from '$settings/global';
  
  // Get localization from props
  let {data} = $props();
  const l10n = data.l10n;
</script>

<!-- SEO Metadata -->
<Metadata
  title="My Company - Professional Services"
  description="We offer expert services in web development and design"
  canonicalUrl={domain}
/>

<div class="home-container" in:fade={{duration: 300}}>
  <section class="hero-section">
    <h1 class="title">My Company</h1>
    <p class="subtitle">Professional web development services</p>

    <div class="cta-buttons">
      <Button variant="primary" onclick={() => window.location.href = '/services'}>
        Our Services
      </Button>

      <Button variant="secondary" onclick={() => window.location.href = '/contact'}>
        Contact Us
      </Button>
    </div>
  </section>

  <section class="features-section">
    <h2 class="section-title">What We Offer</h2>

    <div class="features-grid">
      <div class="feature-card">
        <h3>Web Development</h3>
        <p>Custom websites built with modern technologies</p>
      </div>
      <div class="feature-card">
        <h3>UI/UX Design</h3>
        <p>Beautiful, intuitive interfaces that convert</p>
      </div>
      <div class="feature-card">
        <h3>SEO Optimization</h3>
        <p>Improve your visibility in search results</p>
      </div>
    </div>
  </section>
</div>

<style>
  .home-container {
    @apply w-full max-w-5xl mx-auto px-6;
  }

  .hero-section {
    @apply flex flex-col items-center justify-center text-center py-16 md:py-24;
  }

  .title {
    @apply text-5xl font-bold mb-3 text-base14;
  }

  .subtitle {
    @apply text-xl text-base3 mb-10 max-w-2xl mx-auto;
  }

  .features-section {
    @apply py-12 px-4 bg-base1/30 rounded-lg mb-16;
  }

  .features-grid {
    @apply grid grid-cols-1 md:grid-cols-3 gap-6;
  }

  .feature-card {
    @apply p-6 bg-base1/40 rounded-lg text-center;
    @apply transition-all hover:-translate-y-1 hover:shadow-md;
  }
</style>
```

To create additional pages, add new files to the routes directory:

- `src/routes/about/+page.svelte` for an About page
- `src/routes/services/+page.svelte` for a Services page
- `src/routes/contact/+page.svelte` for a Contact page

## Step 4: Customize the Theme

Dagaz includes a built-in theme system. Modify colors in `src/theme.css`:

```css
@theme {
  --color-base0: #232733; /* Background */
  --color-base1: #2c3040; /* Lighter background */
  --color-base7: #fafdfb; /* Foreground */
  --color-base14: #ff9982; /* Primary accent - update to match your brand */
  /* Additional color variables */
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

1. Push your project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/my-project.git
git push -u origin main
```

2. Log in to Cloudflare and navigate to **Pages**
3. Click **Create a project**
4. Connect your GitHub account and select your repository
5. Configure build settings:
   - **Project name**: `my-project`
   - **Production branch**: `main`
   - **Build command**: `pnpm build`
   - **Output directory**: `.svelte-kit/cloudflare`
6. Click **Save and Deploy**

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

1. Update `src/lib/data/locales.js`:

```javascript
export const locales = {
  en: {locale: 'en', label: 'English', flag: '🇺🇸'},
  fr: {locale: 'fr', label: 'Français', flag: '🇫🇷'},
  es: {locale: 'es', label: 'Español', flag: '🇪🇸'}
};
```

2. Add translations in `src/lib/data/translations.js`:

```javascript
export default {
  en: {
    welcomeMessage: 'Welcome to our site',
    contactUs: 'Contact Us'
  },
  fr: {
    welcomeMessage: 'Bienvenue sur notre site',
    contactUs: 'Contactez-nous'
  },
  es: {
    welcomeMessage: 'Bienvenido a nuestro sitio',
    contactUs: 'Contáctenos'
  }
};
```

3. Use translations in your components:

```svelte
<h1>{l10n.t('welcomeMessage')}</h1>
```

## Next Steps

Now that your site is up and running, consider:

1. Adding your company's logo and branding elements
2. Creating additional pages for your services or products
3. Setting up a Cloudflare
4. Adding analytics (Plausible, Fathom, or Simple Analytics work well)
5. Customizing the SEO settings for better search visibility

---

*Created by [Nicholas Glazer](https://nicgl.com), frontend architect specializing in minimal, high-performance sites. Need help with your project? [Get in touch](https://nicgl.com/links).*
