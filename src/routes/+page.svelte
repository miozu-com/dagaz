<script>
  import {fade} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import {appName, author, domain} from '$settings/global';
  import DagazLogo from '$components/DagazLogo.svelte';
  import InfiniteCarousel from '$components/InfiniteCarousel.svelte';
  import {Button} from '$components/jera';
  import {Markdown, Languages, Moon, ServerOff, Svelte, Tailwind} from '$components/icons';

  let {data} = $props();
  const l10n = data.l10n;

  // SEO data
  const domainName = domain;

  const features = [
    {
      name: 'trulyServerless',
      icon: ServerOff,
      description: 'trulyServerlessDesc'
    },
    {
      name: 'markdownBlog',
      icon: Markdown,
      description: 'markdownBlogDesc'
    },
    {
      name: 'darkLightTheme',
      icon: Moon,
      description: 'darkLightThemeDesc'
    },
    {
      name: 'localization',
      icon: Languages,
      description: 'localizationDesc'
    }
  ];

  // The technology stack items for the carousel
  const techStack = [
    {name: l10n.t('svelteKit'), icon: Svelte, color: '#FF3E00'},
    {name: l10n.t('tailwind'), icon: Tailwind, color: '#38BDF8'},
    {name: l10n.t('cloudflare'), emoji: '☁️', color: '#F38020'},
    {name: l10n.t('pnpm'), emoji: '📦', color: '#F69220'},
    {name: 'JavaScript', emoji: '⚡', color: '#F7DF1E'},
    {name: 'TypeScript', emoji: '🔷', color: '#3178C6'},
    {name: 'Canvas API', emoji: '🎨', color: '#E34F26'},
    {name: 'Svelte 5', emoji: '🔥', color: '#FF3E00'},
    {name: 'Vite', emoji: '⚡', color: '#646CFF'},
    {name: 'Ramda', emoji: '🧠', color: '#884499'},
    {name: 'Functional JS', emoji: '🧩', color: '#44AA88'},
    {name: 'ESBuild', emoji: '⚒️', color: '#FFCF00'}
  ];
</script>

<!-- SEO Metadata -->
<Metadata
  title={l10n.t('pageTitle')}
  description={l10n.t('mainSubtitle')}
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
    description: l10n.t('mainSubtitle'),
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

<div class="home-container" in:fade={{duration: 300}}>
  <section class="hero-section">
    <div class="hero-content">
      <div class="logo-wrapper">
        <DagazLogo size={80} color="#ff9982" class="logo-icon animate-pulse" />
      </div>

      <h1 class="title">Dagaz</h1>
      <p class="subtitle">{l10n.t('mainSubtitle')}</p>

      <div class="cta-buttons">
        <Button variant="primary" onclick={() => (window.location.href = '/blog')}>
          {l10n.t('viewBlog')}
        </Button>

        <Button
          variant="secondary"
          onclick={() => window.open('https://github.com/miozu-com/dagaz', '_blank')}
        >
          {l10n.t('github')}
        </Button>
      </div>
    </div>
  </section>

  <section class="features-section">
    <h2 class="section-title">{l10n.t('keyFeatures')}</h2>

    <div class="features-grid">
      {#each features as feature, i}
        <div class="feature-card" in:fade={{duration: 300, delay: 100 + i * 100}}>
          <div class="feature-icon">
            <svelte:component this={feature.icon} size={36} />
          </div>
          <h3 class="feature-name">{l10n.t(feature.name)}</h3>
          <p class="feature-description">{l10n.t(feature.description)}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="tech-section">
    <h2 class="section-title">{l10n.t('builtWithModernTech')}</h2>

    <!-- Replace the static tech grid with the carousel -->
    <InfiniteCarousel
      items={techStack}
      speed={40}
      gap={24}
      pauseOnHover={true}
      class="tech-carousel"
    />
  </section>
</div>

<style lang="postcss">
  @import '../theme.css' theme(reference);

  .home-container {
    @apply w-full max-w-5xl mx-auto px-6;
  }

  .hero-section {
    @apply flex flex-col items-center justify-center text-center py-16 md:py-24;
  }

  .hero-content {
    @apply max-w-3xl;
  }

  .logo-wrapper {
    @apply flex justify-center mb-6;
  }

  .logo-icon {
    animation-duration: 3s;
  }

  .title {
    @apply text-5xl font-bold mb-3 text-base14;
  }

  .subtitle {
    @apply text-xl text-base3 mb-10 max-w-2xl mx-auto;
  }

  .cta-buttons {
    @apply flex flex-wrap justify-center gap-4;
  }

  .features-section {
    @apply py-12 px-4 bg-base1/30 rounded-lg mb-16;
  }

  .section-title {
    @apply text-2xl font-bold text-center mb-10 text-base14;
  }

  .features-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-6;
  }

  .feature-card {
    @apply flex flex-col items-center p-6 bg-base1/40 rounded-lg;
    @apply transition-all hover:-translate-y-1 hover:shadow-md;
    @apply text-center;
  }

  .feature-icon {
    @apply text-base14 mb-4;
  }

  .feature-name {
    @apply text-xl font-semibold mb-2 text-base7;
  }

  .feature-description {
    @apply text-sm text-base3;
  }

  .tech-section {
    @apply pb-16;
  }

  /* Add some margin/padding for the carousel */
  .tech-carousel {
    @apply my-8 px-2;
  }
</style>
