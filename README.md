<div align="center">

# ᛞ Dagaz - Modern SvelteKit Starter

<img src="https://via.placeholder.com/1200x300/232733/FF9982?text=Dagaz:+Modern+SvelteKit+Starter" alt="Dagaz Preview" width="700">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00)](https://svelte.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-0EA5E9)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020)](https://pages.cloudflare.com/)
[![Minimal](https://img.shields.io/badge/Dependencies-Minimal-25C2A0)](https://github.com/miozu-com/dagaz)

</div>

<p align="center">
  <b>📦 Just 2 runtime dependencies • 🚀 Svelte 5 Runes • 🧩 Modular Architecture • 🌐 Cloudflare Ready</b>
</p>

## 🔥 Why Dagaz?

Dagaz is a professional SvelteKit starter built for **real-world** production websites. Unlike bloated templates, Dagaz follows a minimalist philosophy:

- **Modern architecture** - Leverages Svelte 5 Runes and functional patterns
- **Performance-optimized** - Fast load times with 95+ Lighthouse scores
- **Zero bloat** - Minimum runtime dependencies
- **Serverless by default** - Deploy globally with Cloudflare Pages
- **Developer experience** - Clean, maintainable code structure

## ✨ Top Features

### 1. 🧠 Svelte 5 Runes Architecture

```javascript
// Clean, reactive state management with Svelte 5 runes
export class ThemeReactiveState {
  _themeState = $state(false); // Light/dark mode toggle
  
  get isDark() { return this._themeState; }
  
  toggle() {
    this._themeState = !this._themeState;
    localStorage.setItem('app-theme', JSON.stringify(this._themeState));
  }
}
```

### 2. 🌙 Theme System

<img src="https://via.placeholder.com/600x120/232733/FF9982?text=Theme+Switching+Preview" alt="Theme Switching" width="600">

- Automatic system preference detection
- Theme persistence in localStorage
- Comprehensive CSS variables for consistent styling
- Light/Dark or any

### 3. 🌎 Multi-language Support

```svelte
<!-- Simple localization usage -->
<h1>{l10n.t('welcomeMessage')}</h1>
```

- Localization using svelte 5 reactivity
- Reach global audiences with built-in multi-language support
- Currently includes English, French, Ukrainian, and Chinese

### 4.  ???


### 5. 📝 Markdown Blog Engine

<img src="https://via.placeholder.com/600x120/232733/FF9982?text=Blog+Engine+Preview" alt="Blog Engine" width="600">

- Author content in intuitive Markdown
- Rich frontmatter support
- Tags, categories, and filtering
- Table of contents generation

### 6. 🚀 Performance Optimized

- Automatic image optimization
- Adaptive lazy loading
- Tailwind CSS for minimal CSS
- Optimized font loading
- Critical CSS extraction

### 7. 📱 PWA Support

- Service worker for offline access
- Installable web app
- Icon generation script
- Manifest configuration

### 8. 🔍 SEO Ready

```svelte
<Metadata
  title="Dagaz - Minimal SvelteKit Starter"
  description="Professional SvelteKit starter kit"
  canonicalUrl="https://example.com"
/>
```

- Comprehensive metadata management
- JSON-LD structured data
- OpenGraph and Twitter card support
- Automated sitemap generation

### 9. 🧩 Modular Component Library

<img src="https://via.placeholder.com/600x120/232733/FF9982?text=Component+Library+Preview" alt="Component Library" width="600">

- Button component with multiple variants
- Form controls with validation
- 20+ Icon components included
- Toast notifications
- Modal dialogs

### 10. 🎨 Canvas API Integration

```javascript
// Native Canvas API visualizations without external dependencies
function drawChart(ctx, data) {
  // Create custom visualizations using native browser APIs
}
```

- Create custom visualizations without dependencies
- Animation framework included
- Interactive data visualization helpers
- Performance optimized

## 📦 Getting Started

Prerequisites: Node.js 20+ and PNPM 8+

```bash
# Clone the repository
git clone https://github.com/miozu-com/dagaz.git my-project

# Navigate to project directory
cd my-project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🏗️ Project Structure

```
dagaz/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable UI components
│   │   ├── data/           # Content and translations
│   │   ├── features/       # Feature modules
│   │   ├── reactiveStates/  # State management
│   │   ├── settings/       # Global settings
│   │   └── utils/          # Utility functions
│   ├── routes/             # SvelteKit routes
│   ├── app.css            # Global styles
│   └── theme.css          # Theme variables
└── static/                # Static assets
```

## 🚀 Deployment

Deploy to Cloudflare Pages with a few clicks:

1. Push your code to GitHub
2. Connect to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `pnpm build`
   - **Output directory**: `.svelte-kit/cloudflare`

## 🤝 Contributing

Contributions are welcome! Please check out our [contribution guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Created by [Nicholas Glazer](https://github.com/nicholasglazer)
- Built with [SvelteKit](https://kit.svelte.dev/)
- Powered by [Cloudflare Pages](https://pages.cloudflare.com/)

---

<div align="center">
  <p>Need custom SvelteKit development? Contact <a href="https://nicgl.com">nicgl.com</a></p>
</div>
