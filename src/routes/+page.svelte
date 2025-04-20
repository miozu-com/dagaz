<script>
  import {fade, fly} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import {appName, author, domain} from '$settings/global';
  import DagazLogo from '$components/DagazLogo.svelte';
  import GitHubStars from '$components/GitHubStars.svelte';
  import InfiniteCarousel from '$components/InfiniteCarousel.svelte';
  import {Button} from '$components/jera';
  import {Markdown, Languages, Moon, ServerOff, Svelte, Tailwind} from '$components/icons';

  let {data} = $props();
  const l10n = data.l10n;

  // SEO data
  const domainName = domain;

  // Feature data with improved descriptions
  const features = [
    {
      name: 'trulyServerless',
      icon: ServerOff,
      description:
        'Deploy globally with zero server management. Enjoy automatic scaling, high availability, and lightning-fast CDN delivery.'
    },
    {
      name: 'markdownBlog',
      icon: Markdown,
      description:
        'Author content in intuitive Markdown with full Svelte component support. Create interactive posts that stand out from standard blogs.'
    },
    {
      name: 'darkLightTheme',
      icon: Moon,
      description:
        'Polished theme system with automatic OS preference detection. Customize colors to match your brand with minimal effort.'
    },
    {
      name: 'localization',
      icon: Languages,
      description:
        'Reach global audiences with built-in multi-language support. Add new languages without changing your codebase structure.'
    }
  ];

  // Enhanced tech stack items for carousel
  const techStack = [
    {name: 'SvelteKit 2.x', icon: Svelte, color: '#FF3E00'},
    {name: 'Tailwind 4', icon: Tailwind, color: '#38BDF8'},
    {name: 'Cloudflare', emoji: '☁️', color: '#F38020'},
    {name: 'PNPM', emoji: '📦', color: '#F69220'},
    {name: 'JavaScript', emoji: '⚡', color: '#F7DF1E'},
    {name: 'TypeScript', emoji: '🔷', color: '#3178C6'},
    {name: 'Canvas API', emoji: '🎨', color: '#E34F26'},
    {name: 'Svelte 5', emoji: '🔥', color: '#FF3E00'},
    {name: 'Vite', emoji: '⚡', color: '#646CFF'},
    {name: 'Ramda', emoji: '🧠', color: '#884499'},
    {name: 'Functional JS', emoji: '🧩', color: '#44AA88'},
    {name: 'ESBuild', emoji: '⚒️', color: '#FFCF00'}
  ];

  // Add USP list - why choose Dagaz
  const benefits = [
    "Modern frontend: Built with Svelte 5's runes for reactive state management & Tailwind 4",
    'Customizable: Extend with your own components and themes',
    'Performance-focused: Optimized for Core Web Vitals metrics',
    'Developer-friendly: Clean, modular architecture for maintainability'
  ];
</script>

<!-- SEO Metadata -->
<Metadata
  title="Dagaz - Minimal SvelteKit Starter for Landing Pages"
  description="A modern, minimal SvelteKit starter with just 2 dependencies. Perfect for business landing pages and content-focused sites."
  canonicalUrl={domainName}
  ogType="website"
  ogImage={`${domainName}/images/home-banner.jpg`}
  ogImageAlt={appName}
  robots="index, follow"
/>

<!-- JSON-LD Structured Data -->
<JsonLd
  type="WebSite"
  data={{
    name: appName,
    description: 'A modern, minimal SvelteKit starter with just 2 dependencies',
    url: domainName
  }}
/>

<!-- Organization Schema -->
<JsonLd
  type="Organization"
  data={{
    name: appName,
    url: domainName,
    logo: `${domainName}/icons/icon-192x192.png`,
    founder: {
      name: author
    }
  }}
/>

<div class="home-page" in:fade={{duration: 300}}>
  <!-- Hero Section -->
  <section class="hero">
    <div in:fly={{y: 30, duration: 500, delay: 140}} class="hero-content">
      <DagazLogo size={70} color={'var(--color-base14)'} />

      <h1 class="hero-title">Dagaz</h1>

      <p class="hero-tagline">A minimal SvelteKit starter for business landing pages</p>

      <p class="hero-description">
        Built with just two runtime dependencies, Dagaz provides a solid foundation for developing
        fast, maintainable web projects without the bloat.
      </p>

      <div class="hero-actions">
        <Button variant="primary" href="/blog">View Blog</Button>

        <GitHubStars repo="miozu-com/dagaz" />
      </div>
    </div>
  </section>

  <!-- USP Section -->
  <section class="usp-section">
    <div class="container">
      <div class="usp-content">
        <h2 class="section-title">Why Choose Dagaz?</h2>

        <ul class="benefits-list">
          {#each benefits as benefit}
            <li class="benefit-item">{benefit}</li>
          {/each}
        </ul>

        <p class="usp-cta">
          Perfect for business websites, landing pages, portfolios, and content-focused sites.
        </p>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features-section">
    <div class="container">
      <h2 class="section-title">Key Features</h2>

      <div class="features-grid">
        {#each features as feature, i}
          <div class="feature-card" in:fly={{y: 20, duration: 400, delay: 100 + i * 100}}>
            <div class="feature-icon">
              <svelte:component this={feature.icon} size={36} />
            </div>

            <div class="feature-content">
              <h3 class="feature-name">{l10n.t(feature.name)}</h3>
              <p class="feature-description">{feature.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Getting Started Section -->
  <section class="getting-started">
    <div class="container">
      <h2 class="section-title">Getting Started is Simple</h2>

      <div class="code-sample">
        <pre><code
            >git clone https://github.com/miozu-com/dagaz.git my-project
cd my-project
pnpm install
pnpm dev</code
          ></pre>
      </div>

      <p class="code-description">Ready to go in under a minute. No configuration needed.</p>

      <Button
        variant="primary"
        onclick={() => window.open('https://github.com/miozu-com/dagaz', '_blank')}
      >
        Clone Repository
      </Button>
    </div>
  </section>

  <!-- Tech Stack Section -->
  <section class="tech-section">
    <div class="container">
      <h2 class="section-title">Built With Modern Tech</h2>

      <InfiniteCarousel
        items={techStack}
        speed={40}
        gap={24}
        pauseOnHover={true}
        class="tech-carousel"
      />
    </div>
  </section>

  <!-- Footer CTA -->
  <section class="footer-cta">
    <div class="container">
      <h2 class="cta-title">Start Building Your Project Today</h2>
      <p class="cta-description">
        Join the growing community of developers using Dagaz for their projects.
      </p>

      <div class="cta-buttons">
        <Button
          variant="primary"
          onclick={() => window.open('https://github.com/miozu-com/dagaz', '_blank')}
        >
          View on GitHub
        </Button>

        <Button
          variant="secondary"
          onclick={() => (window.location.href = '/blog/getting-started-with-dagaz')}
        >
          Read Documentation
        </Button>
      </div>
    </div>
  </section>
</div>

<style lang="postcss">
  @import '../theme.css' theme(reference);

  .home-page {
    @apply w-full;
  }

  .container {
    @apply max-w-6xl mx-auto px-6 py-12 md:py-24;
  }

  /* Hero Section */
  .hero {
    @apply pt-12 pb-20 md:pt-20 md:pb-32 bg-base0 relative overflow-hidden;
    &::before {
      content: '';
      @apply absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-base14/5 to-transparent opacity-70;
    }

    &::after {
      content: '';
      @apply absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base1/40 to-transparent;
    }

    .hero-content {
      @apply flex flex-col items-center max-w-7xl text-center;
      @apply relative z-10;
    }

    .hero-title {
      @apply text-5xl md:text-6xl font-bold mb-4 text-base14;
      letter-spacing: -0.02em;
    }

    .hero-tagline {
      @apply text-xl md:text-2xl text-base7 mb-5 font-medium;
    }

    .hero-description {
      @apply text-base4 mb-10 max-w-2xl mx-auto text-lg leading-relaxed;
    }

    .hero-actions {
      @apply flex flex-wrap justify-center gap-4;
    }
  }

  .github-stars {
    @apply ml-2 bg-base2/50 px-2 py-0.5 rounded-full text-xs flex items-center gap-1;
  }

  /* USP Section */
  .usp-section {
    @apply bg-base1/50 border-y border-base2/30;
  }

  .usp-content {
    @apply max-w-3xl mx-auto;
  }

  .benefits-list {
    @apply space-y-3 mb-8 mx-auto;
  }

  .benefit-item {
    @apply flex items-start pl-6 relative text-base5 font-medium;

    &::before {
      content: '→';
      @apply absolute left-0 text-base14 font-normal;
    }
  }

  .usp-cta {
    @apply text-center text-base4 italic;
  }

  /* Features Section */
  .features-section {
    @apply bg-base0;
  }

  .section-title {
    @apply text-3xl font-bold text-center mb-16 text-base14;
    @apply relative inline-block mx-auto;

    &::after {
      content: '';
      @apply absolute bottom-0 left-1/2 w-16 h-px bg-base14/30 -translate-x-1/2 -bottom-3;
    }
  }

  .features-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12;
  }

  .feature-card {
    @apply flex gap-5 p-6 rounded-md;
    @apply transition-all;
    @apply bg-gradient-to-br from-base1/60 to-base1/20;
    @apply border border-base3/5;
  }

  .feature-icon {
    @apply text-base14 flex-shrink-0 mt-1;
  }

  .feature-content {
    @apply flex-1;
  }

  .feature-name {
    @apply text-xl font-semibold mb-3 text-base7;
  }

  .feature-description {
    @apply text-base4 text-base5 leading-relaxed;
  }

  /* Getting Started Section */
  .getting-started {
    @apply bg-base1/30 border-y border-base2/30 text-center;
  }

  .code-sample {
    @apply max-w-2xl mx-auto mb-6 bg-base0 rounded-md p-6 border border-base3/10;
    @apply text-left overflow-auto;
  }

  .code-sample pre {
    @apply m-0 text-base5;
  }

  .code-sample code {
    @apply font-mono text-base6;
  }

  .code-description {
    @apply mb-8 text-base4;
  }

  /* Tech Stack Section */
  .tech-section {
    @apply bg-base0;
  }

  .tech-carousel {
    @apply my-12;
    @apply max-w-5xl mx-auto;
  }

  /* Footer CTA */
  .footer-cta {
    @apply bg-gradient-to-b from-base1/30 to-base1/70 border-t border-base2/30 text-center;
  }

  .cta-title {
    @apply text-2xl md:text-3xl font-bold mb-4 text-base7;
  }

  .cta-description {
    @apply text-base4 mb-8 max-w-xl mx-auto;
  }

  .cta-buttons {
    @apply flex flex-wrap justify-center gap-4;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .hero-title {
      @apply text-4xl;
    }

    .section-title {
      @apply text-2xl mb-10;
    }

    .feature-card {
      @apply flex-col;
    }

    .feature-icon {
      @apply mb-4;
    }

    .container {
      @apply py-10;
    }
  }
</style>
