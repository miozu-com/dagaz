<script>
  import {tick, onMount, onDestroy} from 'svelte';
  import {appName} from '$lib/settings/global';
  import Header from '$features/layout/Header.svelte';
  import Footer from '$features/layout/Footer.svelte';
  import '../app.css';

  let {children, data} = $props();

  let headerEl = $state(null);
  let footerEl = $state(null);
  let contentEl = $state(null);
  let innerHeight = $state(0);
  let innerWidth = $state(0);
  let headerHeight = $state(0);
  let footerHeight = $state(0);

  // Calculate content height based on header height
  let contentHeight = $derived(innerHeight - headerHeight);

  // Flag to track if we are using resize observer
  let usingResizeObserver = $state(false);
  let resizeObserver;

  async function updateSizes() {
    await tick();
    headerHeight = headerEl?.offsetHeight || 0;

    data.s.pageSize = {
      h: innerHeight - headerHeight,
      w: innerWidth
    };
  }

  // Setup ResizeObserver if available - more efficient than window resize
  function setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && headerEl) {
      usingResizeObserver = true;

      resizeObserver = new ResizeObserver(() => {
        updateSizes();
      });

      resizeObserver.observe(headerEl);
    }
  }

  onMount(() => {
    updateSizes();

    if (headerHeight === 0) {
      setTimeout(updateSizes, 50);
    }

    // Setup resize observer
    setupResizeObserver();

    // Ensure we detect pageshow events (for bfcache restoration)
    window.addEventListener('pageshow', event => {
      if (event.persisted) {
        // Page was restored from the bfcache
        updateSizes();
      }
    });
  });

  onDestroy(() => {
    // Properly cleanup the resize observer to avoid memory leaks
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  $effect(() => {
    if (headerEl && !usingResizeObserver) {
      updateSizes();
    }
  });
</script>

<svelte:window
  bind:innerHeight
  bind:innerWidth
  on:resize={!usingResizeObserver ? updateSizes : undefined}
/>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
    rel="stylesheet"
  />
  <title>{appName}</title>
</svelte:head>

<div class="app-container">
  <Header bind:headerEl l10n={data.l10n} />

  <main
    id="main"
    class="main-content"
    style="height: {contentHeight}px; min-height: {contentHeight}px;"
  >
    <div class="content-wrapper" bind:this={contentEl}>
      <div class="content">
        {@render children()}
      </div>
      <Footer bind:footerEl l10n={data.l10n} theme={data.theme} />
    </div>
  </main>
</div>

<style lang="postcss">
  @import '../theme.css' theme(reference);

  .app-container {
    @apply bg-base0 text-base6;
    @apply flex flex-col min-h-screen;
  }

  .rtl {
    direction: rtl;
    unicode-bidi: bidi-override;
  }

  .main-content {
    @apply flex-grow;
    @apply overflow-auto;
  }

  .content-wrapper {
    @apply flex-1 flex flex-col items-center w-full;
    @apply overflow-y-auto;
  }

  .content {
    @apply flex-grow flex justify-center w-full max-w-7xl mx-auto;
    @apply px-4 py-4;
  }
</style>
