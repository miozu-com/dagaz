<script>
  import {githubRepo, codebergRepo, appName} from '$lib/settings/global';
  import DagazLogo from '$components/DagazLogo.svelte';
  import Divider from '$components/Divider.svelte';

  let {headerEl = $bindable(), l10n, theme} = $props();
</script>

<header bind:this={headerEl} class="header">
  <div class="header-content">
    <div class="header-left">
      <a href="/" class="logo-link">
        <DagazLogo size={24} class="logo" />
        <span>{appName}</span>
      </a>
    </div>

    <nav class="main-nav">
      <a href="/blog" class="nav-link">{l10n.t('blog')}</a>
      <!-- Add more navigation links here if needed -->
    </nav>

    <div class="header-right">
      <!-- Empty space to balance the layout -->
    </div>
  </div>
  <Divider />
</header>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .header {
    @apply z-10 bg-base0 dark:bg-base0/90;
    @apply sticky top-0;
  }

  .header-content {
    @apply h-14 w-full px-4 flex items-center;
  }

  .header-right {
    @apply w-24; /* Fixed width to balance logo on left */
  }

  .header-left {
    @apply w-24 flex items-center; /* Fixed width to balance empty space on right */
  }

  .logo-link {
    @apply flex items-center gap-2 no-underline;

    span {
      @apply font-medium text-base14 text-lg;
    }
  }

  /* Center align logo and text vertically */
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
    @apply text-lg font-medium;
  }

  @media (max-width: 640px) {
    .header-left,
    .header-right {
      @apply w-16;
    }
  }
</style>
