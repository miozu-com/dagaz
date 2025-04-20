<script>
  import {githubRepo, codebergRepo, appName} from '$lib/settings/global';
  import {mainRoutes} from '$lib/settings/routes';
  import DagazLogo from '$components/DagazLogo.svelte';
  import Divider from '$components/Divider.svelte';

  let {headerEl = $bindable(), l10n, theme} = $props();
</script>

<header bind:this={headerEl} class="header">
  <div class="header-content">
    <div class="header-left">
      <a href="/" class="logo-link">
        <DagazLogo size={32} color={'var(--color-base14)'} />
        <span>{appName}</span>
      </a>
    </div>

    <nav class="main-nav">
      {#each mainRoutes as route}
        <a href={route.path} class="nav-link">
          {route.translate ? l10n.t(route.label) : route.label}
        </a>
      {/each}
    </nav>

    <div class="header-right">
      <!-- Empty space to balance the layout -->
    </div>
  </div>
  <Divider />
</header>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .header {
    @apply z-10 bg-base0;
    @apply sticky top-0;
  }

  .header-content {
    @apply max-w-7xl mx-auto px-4 py-4;
    @apply h-14 w-full;
    @apply flex items-center;
  }

  .header-right {
    @apply w-16 sm:w-24;
  }

  .header-left {
    @apply w-16 sm:w-24 flex items-center;
  }

  .logo-link {
    @apply flex items-center gap-2 no-underline;

    span {
      @apply font-medium text-base14 text-base sm:text-lg;
    }
  }

  .logo-link {
    @apply flex items-center justify-center;
  }

  .logo {
    @apply flex-shrink-0;
  }

  .main-nav {
    @apply flex-1 flex items-center justify-center;
  }

  .nav-link {
    @apply px-3 py-1.5 text-base7 hover:text-base14 transition-colors;
    @apply text-base sm:text-lg font-medium;
  }
</style>
