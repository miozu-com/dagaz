<script>
  import {onMount} from 'svelte';
  import {fade, slide} from 'svelte/transition';
  import Divider from '$components/Divider.svelte';
  import DagazLogo from '$components/DagazLogo.svelte';
  import {Select} from '$components/jera';
  import ThemeSwitcher from '$features/theme/ThemeSwitcher.svelte';
  import {author, githubRepo, codebergRepo, appName} from '$lib/settings/global';
  import {locales} from '$lib/data/locales.js';
  import {mainRoutes, externalRoutes} from '$lib/settings/routes';

  let {footerEl = $bindable(), l10n, theme} = $props();
  const year = new Date().getFullYear();

  // Logo styling
  const logoSize = 28;
  const logoColor = 'currentColor';

  // Status state
  let statusExpanded = $state(false);
  let performance = $state({
    pageLoad: 0,
    domComplete: 0,
    firstPaint: 0
  });
  let swStatus = $state('checking');
  let online = $state(true);

  function toggleStatus() {
    statusExpanded = !statusExpanded;
  }

  // System status data
  let statusItems = $state([]);

  // Create locale options for the Select component
  const localeOptions = $derived(
    Object.entries(locales).map(([value, locale]) => ({
      value,
      label: `${locale.flag} ${locale.label}`
    }))
  );

  // External links handler - based on the configuration in routes.js
  function getExternalUrl(key) {
    switch (key) {
      case 'github':
        return githubRepo;
      case 'codeberg':
        return codebergRepo;
      default:
        return null;
    }
  }

  // Handle locale change
  function handleLocaleChange(option) {
    l10n.value = option.value;
  }

  onMount(() => {
    // Check online status
    online = navigator.onLine;
    window.addEventListener('online', () => (online = true));
    window.addEventListener('offline', () => (online = false));

    // Check service worker status
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        swStatus = 'active';
      } else {
        swStatus = 'inactive';
      }
    } else {
      swStatus = 'unsupported';
    }

    // Performance metrics - fixed to check for API availability
    if (window.performance) {
      setTimeout(() => {
        // Check if timing API is available
        if (window.performance.timing) {
          const perfData = window.performance.timing;
          performance.pageLoad = perfData.loadEventEnd - perfData.navigationStart;
          performance.domComplete = perfData.domComplete - perfData.domLoading;
        }

        // Check if Performance Entry API is available
        if (
          window.performance.getEntriesByType &&
          typeof window.performance.getEntriesByType === 'function'
        ) {
          try {
            const paintMetrics = window.performance.getEntriesByType('paint');
            if (paintMetrics && paintMetrics.length) {
              const firstPaint = paintMetrics.find(
                entry => entry.name === 'first-contentful-paint'
              );
              if (firstPaint) {
                performance.firstPaint = Math.round(firstPaint.startTime);
              }
            }
          } catch (e) {
            console.warn('Error accessing performance metrics:', e);
          }
        }

        updateStatusItems();
      }, 0);
    }

    return () => {
      window.removeEventListener('online', () => (online = true));
      window.removeEventListener('offline', () => (online = false));
    };
  });

  function updateStatusItems() {
    statusItems = [
      {
        id: 'online',
        label: online ? 'Online' : 'Offline',
        value: online ? 'Connected' : 'Disconnected',
        color: online ? '#6dd672' : '#ff9837'
      },
      {
        id: 'sw',
        label: 'Service Worker',
        value:
          swStatus === 'active' ? 'Active'
          : swStatus === 'inactive' ? 'Inactive'
          : 'Unsupported',
        color: swStatus === 'active' ? '#6dd672' : '#ff9837'
      },
      {
        id: 'perf',
        label: 'Page Load',
        value: `${performance.pageLoad}ms`,
        color:
          performance.pageLoad < 1000 ? '#6dd672'
          : performance.pageLoad < 3000 ? '#e8d176'
          : '#eb3137'
      },
      {
        id: 'fp',
        label: 'First Paint',
        value: `${performance.firstPaint}ms`,
        color:
          performance.firstPaint < 1000 ? '#6dd672'
          : performance.firstPaint < 3000 ? '#e8d176'
          : '#eb3137'
      },
      {
        id: 'dom',
        label: 'DOM Complete',
        value: `${performance.domComplete}ms`,
        color:
          performance.domComplete < 1000 ? '#6dd672'
          : performance.domComplete < 3000 ? '#e8d176'
          : '#eb3137'
      }
    ];
  }

  $effect(() => {
    if (online !== undefined || swStatus !== 'checking' || performance.pageLoad > 0) {
      updateStatusItems();
    }
  });
</script>

<footer bind:this={footerEl} class="footer">
  <Divider />
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-branding">
        <a href="/" class="footer-logo">
          <DagazLogo size={logoSize} color={logoColor} />
          <span class="footer-name">{appName}</span>
        </a>

        <!-- Internal navigation links -->
        <div class="footer-nav">
          {#each mainRoutes as route}
            <a href={route.path} class="footer-link">
              {route.translate ? l10n.t(route.label) : route.label}
            </a>
          {/each}
        </div>
      </div>

      <div class="footer-tools">
        <ThemeSwitcher {theme} />
        <Select
          options={localeOptions}
          value={l10n.value}
          onChange={handleLocaleChange}
          class="locale-select"
          buttonVariant="sm"
        />

        <!-- Status Indicator Button -->
        <button
          class="status-indicator"
          onclick={toggleStatus}
          aria-expanded={statusExpanded}
          aria-label="Toggle system status"
        >
          <div class="status-dot" style="background-color: {online ? '#6dd672' : '#ff9837'}"></div>
        </button>
      </div>

      <!-- External links section -->
      <div class="footer-links">
        {#each externalRoutes as route}
          {@const url = getExternalUrl(route.key)}
          {#if url}
            <a href={url} class="footer-link" target="_blank" rel="noopener noreferrer">
              {route.translate ? l10n.t(route.key) : route.key}
            </a>
          {/if}
        {/each}
      </div>
    </div>

    {#if statusExpanded}
      <div class="status-panel" in:slide={{duration: 200}} out:slide={{duration: 150}}>
        <div class="status-items">
          {#each statusItems as item (item.id)}
            <div class="status-item" style="--status-color: {item.color}">
              <div class="item-label">{item.label}</div>
              <div class="item-value">
                <span>{item.value}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="footer-legal">
      <p class="copyright">{l10n.t('copyright', {year})}&nbsp;{author}</p>
      <p class="built-with">{l10n.t('builtWith')}</p>
    </div>
  </div>
</footer>

<style lang="postcss">
  @import '$theme/theme.css' theme(reference);

  .footer {
    @apply w-full mt-auto bg-base0;
  }

  .footer-container {
    @apply max-w-7xl mx-auto px-4 py-4;
  }

  .footer-content {
    @apply flex flex-wrap justify-between items-center mb-2 gap-3;
  }

  .footer-branding {
    @apply flex items-center flex-wrap gap-4;
  }

  .footer-logo {
    @apply flex items-center gap-2 no-underline text-base14;
  }

  .footer-name {
    @apply font-medium;
  }

  .footer-nav {
    @apply flex gap-4;
  }

  .footer-links {
    @apply flex gap-4;
  }

  .footer-link {
    @apply text-sm text-base5/80 hover:text-base14 transition-colors;
  }

  .footer-legal {
    @apply flex flex-wrap justify-between text-xs text-base3 gap-2;
  }

  .footer-tools {
    @apply flex items-center gap-3 order-last sm:order-none w-full sm:w-auto justify-end sm:ml-auto sm:mr-4;
  }

  .copyright,
  .built-with {
    @apply py-1;
  }

  /* Status Indicator Styles */
  .status-indicator {
    @apply flex items-center justify-center h-8 w-8 rounded-full;
    @apply bg-base1 hover:bg-base2 transition-colors;
    @apply focus:outline-none focus:ring-2 focus:ring-base14/50;
  }

  .status-dot {
    @apply h-3 w-3 rounded-full;
    @apply transition-colors duration-300;
    @apply shadow-sm;
  }

  /* Status Panel Styles */
  .status-panel {
    @apply my-5 p-2.5;
    @apply bg-base0;
    @apply border border-base4/10;
  }

  .status-items {
    @apply flex flex-wrap justify-evenly gap-2.5;
    @apply px-2 py-1;
  }

  .status-item {
    @apply flex flex-col items-start;
    @apply px-2.5 py-0.5;
    @apply border-l-1 border-base2;
  }

  .item-label {
    @apply text-base3 mb-1 text-xs;
  }

  .item-value {
    @apply flex text-base10 text-sm;
  }

  .perf-details {
    @apply flex justify-center gap-4 mt-3 pt-2;
    @apply text-xs text-base3 border-t border-base3/10;
  }

  /* Locale select styles */
  :global(.footer-tools .locale-select) {
    @apply w-auto;
  }

  :global(.footer-tools .locale-select .select-trigger) {
    @apply py-1 px-2 text-sm;
  }

  @media (max-width: 640px) {
    .footer-content {
      @apply flex-col gap-3 items-start;
    }

    .footer-nav,
    .footer-links {
      @apply mb-2 mr-auto;
    }

    .footer-tools {
      @apply mr-0 ml-0 mt-2;
    }

    .footer-legal {
      @apply flex-col items-start gap-1;
    }

    .status-items {
      @apply flex-col;
    }

    .status-item {
      @apply w-full;
    }

    .perf-details {
      @apply flex-col gap-1 items-center;
    }
  }
</style>
