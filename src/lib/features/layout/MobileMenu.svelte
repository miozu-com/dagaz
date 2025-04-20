<script>
  import {onMount, onDestroy} from 'svelte';
  import {slide, fade} from 'svelte/transition';
  import DagazLogo from '$components/DagazLogo.svelte';
  import {appName} from '$settings/global';
  import ThemeSwitcher from '$features/theme/ThemeSwitcher.svelte';
  import {Select} from '$components/jera';
  import {locales} from '$lib/data/locales.js';
  import {Menu} from '$components/icons';

  let {routes = [], l10n, theme, isOpen, menuButtonRef = $bindable()} = $props();

  let menuRef = $state(null);

  let isMenuOpen = $state(isOpen);
  // Create locale options for the Select component
  const localeOptions = $derived(
    Object.entries(locales).map(([value, locale]) => ({
      value,
      label: `${locale.flag} ${locale.label}`
    }))
  );

  // Handle locale change
  function handleLocaleChange(option) {
    l10n.value = option.value;
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
</script>

<!-- Hamburger Button -->
<button
  bind:this={menuButtonRef}
  class="mobile-menu-button"
  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
  onclick={toggleMenu}
>
  <Menu size={18} />
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
          {route.translate ? l10n.t(route.label) : route.label}
        </a>
      {/each}
    </nav>

    <div class="mobile-menu-footer">
      <div class="mobile-menu-tools">
        <div class="tool-item">
          <span class="tool-label">Theme</span>
          <ThemeSwitcher {theme} />
        </div>

        <div class="tool-item">
          <span class="tool-label">Language</span>
          <Select
            options={localeOptions}
            value={l10n.value}
            onChange={handleLocaleChange}
            class="locale-select"
            buttonVariant="sm"
          />
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  /* Hamburger Button */
  .mobile-menu-button {
    @apply fixed right-4 top-4 z-50 h-10 w-10 rounded-full bg-base1/90 backdrop-blur-sm;
    @apply flex items-center justify-center;
    @apply border border-base3/20;
    @apply shadow-md;
    @apply focus:outline-none focus:ring-2 focus:ring-base14/30;
    @apply transition-transform duration-300;

    /* Only show on mobile */
    @apply md:hidden;
  }

  .mobile-menu-button:active {
    @apply transform scale-95;
  }

  .hamburger-icon {
    @apply w-5 h-4 relative flex flex-col justify-between;

    .hamburger-line {
      @apply w-full h-0.5 bg-base14 rounded-full;
      @apply transform transition-all duration-300;
    }

    &.open {
      .hamburger-line:nth-child(1) {
        @apply transform rotate-45 translate-y-1.5;
      }

      .hamburger-line:nth-child(2) {
        @apply opacity-0;
      }

      .hamburger-line:nth-child(3) {
        @apply transform -rotate-45 -translate-y-1.5;
      }
    }
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    @apply fixed inset-0 z-40 bg-base0/70 backdrop-blur-sm;
    @apply md:hidden; /* Hide on desktop */
  }

  /* Mobile Menu Panel */
  .mobile-menu {
    @apply fixed top-0 right-0 z-50 h-full w-full max-w-[300px];
    @apply bg-base0 shadow-xl;
    @apply flex flex-col;
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
    @apply flex items-center justify-center h-10 w-10 rounded-full;
    @apply bg-base1/70 text-base5 hover:text-base14;
    @apply border border-base3/10;
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

  /* Mobile Menu Footer */
  .mobile-menu-footer {
    @apply p-4 border-t border-base3/10;
  }

  .mobile-menu-tools {
    @apply flex flex-col gap-4;
  }

  .tool-item {
    @apply flex items-center justify-between;
  }

  .tool-label {
    @apply text-base5 font-medium;
  }
</style>
