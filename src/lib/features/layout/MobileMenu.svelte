<!-- src/lib/features/layout/MobileMenu.svelte -->
<script>
  import {browser} from '$app/environment';
  import {onMount, onDestroy} from 'svelte';
  import {slide, fade} from 'svelte/transition';
  import DagazLogo from '$components/DagazLogo.svelte';
  import {appName} from '$settings/global';
  import ThemeSwitcher from '$features/theme/ThemeSwitcher.svelte';
  import {Select} from '$components/jera';
  import {locales} from '$lib/data/locales.js';
  import {Menu, Languages} from '$components/icons';

  let {routes = [], l10n, theme} = $props();

  let menuRef = $state(null);
  let menuButtonRef = $state(null);
  let isMenuOpen = $state(false);

  // Create locale options for the Select component - simplified to not show flags in dropdown
  const localeOptions = $derived(
    Object.entries(locales).map(([value, locale]) => ({
      value,
      label: locale.label
    }))
  );

  // Handle locale change with null check
  function handleLocaleChange(option) {
    if (l10n && typeof l10n.value !== 'undefined') {
      l10n.value = option.value;
    }
    // Close menu after changing language
    isMenuOpen = false;
  }

  // Toggle menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  // Close menu
  function closeMenu() {
    isMenuOpen = false;
  }

  // Handle click outside to close menu
  function handleClickOutside(event) {
    if (
      isMenuOpen &&
      menuRef &&
      !menuRef.contains(event.target) &&
      menuButtonRef &&
      !menuButtonRef.contains(event.target)
    ) {
      isMenuOpen = false;
    }
  }

  // Close menu on escape key
  function handleKeydown(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      isMenuOpen = false;
    }
  }

  // Add event listeners on mount
  onMount(() => {
    if (browser) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<!-- Hamburger Button - No background, just icon -->
<button
  bind:this={menuButtonRef}
  class="mobile-menu-button"
  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
  onclick={toggleMenu}
>
  <Menu size={24} />
</button>

<!-- Mobile Menu -->
{#if isMenuOpen}
  <div
    class="mobile-menu-overlay"
    in:fade={{duration: 200}}
    out:fade={{duration: 150}}
    onclick={closeMenu}
  ></div>

  <div
    id="mobile-menu"
    class="mobile-menu"
    bind:this={menuRef}
    in:slide={{duration: 300, axis: 'x'}}
    out:slide={{duration: 200, axis: 'x'}}
    role="navigation"
    aria-label="Mobile navigation"
  >
    <div class="mobile-menu-header">
      <a href="/" class="mobile-menu-logo" onclick={closeMenu}>
        <DagazLogo size={32} color={'var(--color-base14)'} />
        <span>{appName}</span>
      </a>

      <button class="mobile-menu-close" onclick={closeMenu} aria-label="Close menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <nav class="mobile-nav">
      {#each routes as route}
        <a href={route.path} class="mobile-nav-link" onclick={closeMenu}>
          {route.translate ? (l10n?.t(route.label) ?? route.label) : route.label}
        </a>
      {/each}
    </nav>

    <div class="mobile-menu-footer">
      <div class="mobile-menu-tools">
        <ThemeSwitcher {theme} />
        <Select
          options={localeOptions}
          value={l10n?.value ?? 'en'}
          onChange={handleLocaleChange}
          icon={{icon: Languages, position: 'left'}}
          position="top"
          class="locale-select"
        />
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  /* Hamburger Button - Minimal, no background */
  .mobile-menu-button {
    @apply fixed right-4 top-4 z-50 text-base6 hover:text-base14;
    @apply focus:outline-none;
    @apply transition-colors duration-200;
    @apply md:hidden; /* Only show on mobile */
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    @apply fixed inset-0 z-40 bg-base0/80 backdrop-blur-sm;
    @apply md:hidden; /* Hide on desktop */
  }

  /* Mobile Menu Panel */
  .mobile-menu {
    @apply fixed top-0 right-0 z-50 h-full w-full max-w-[280px];
    @apply bg-base1/95 backdrop-blur-md border-l border-base3/10;
    @apply flex flex-col;
    @apply shadow-lg;
    @apply md:hidden; /* Hide on desktop */
  }

  .mobile-menu-header {
    @apply flex items-center justify-between p-4 border-b border-base3/10;
    height: 70px;
  }

  .mobile-menu-logo {
    @apply flex items-center gap-2 no-underline;

    span {
      @apply font-medium text-base14 text-lg;
    }
  }

  .mobile-menu-close {
    @apply flex items-center justify-center h-9 w-9 rounded-full;
    @apply text-base5 hover:text-base14;
    @apply transform transition-all duration-200;
    @apply focus:outline-none;
  }

  .mobile-menu-close:active {
    @apply transform scale-95;
  }

  /* Mobile Nav Links */
  .mobile-nav {
    @apply flex-1 p-4 overflow-y-auto;
  }

  .mobile-nav-link {
    @apply flex items-center py-3 px-2 rounded-xs;
    @apply text-lg font-medium text-base6 hover:text-base14;
    @apply transition-colors;
    @apply no-underline;
    @apply border-b border-base3/5;
  }

  /* Mobile Menu Footer - SIMPLIFIED */
  .mobile-menu-footer {
    @apply p-4 border-t border-base3/10;
  }

  .mobile-menu-tools {
    @apply flex items-center justify-between gap-2;
  }

  /* Override Select styles in the mobile menu */
  :global(.mobile-menu-tools .locale-select) {
    @apply flex-1;
  }

  :global(.mobile-menu-tools .theme-toggle) {
    @apply ml-auto;
  }
</style>
