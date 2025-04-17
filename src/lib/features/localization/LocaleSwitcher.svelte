<script>
  import {fade} from 'svelte/transition';
  import {locales} from '$lib/data/locales.js';
  import {Languages} from '$components/icons';

  let {l10n} = $props();
  let isDropdownOpen = $state(false);

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function selectLanguage(localeCode) {
    if (locales[localeCode]) {
      l10n.value = localeCode;
      isDropdownOpen = false;
    }
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (
      isDropdownOpen &&
      !event.target.closest('.locale-dropdown') &&
      !event.target.closest('.locale-button')
    ) {
      isDropdownOpen = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="locale-switcher">
  <button
    type="button"
    class="locale-button"
    onclick={toggleDropdown}
    aria-expanded={isDropdownOpen}
    aria-label={l10n.t('selectLanguage')}
  >
    <Languages size={20} />
    <span class="locale-label">{locales[l10n.value]?.label || 'English'}</span>
  </button>

  {#if isDropdownOpen}
    <div class="locale-dropdown" transition:fade={{duration: 150}}>
      <div class="locale-options">
        {#each Object.entries(locales) as [code, localeOption]}
          <button
            class="locale-option {code === l10n.value ? 'active' : ''}"
            onclick={() => selectLanguage(code)}
          >
            <span class="locale-flag">{localeOption.flag}</span>
            <span class="locale-name">{localeOption.label}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .locale-switcher {
    @apply relative;
  }

  .locale-button {
    @apply flex items-center gap-2 py-1.5 px-2;
    @apply bg-base2/70 hover:bg-base2 transition-colors;
    @apply text-base5 hover:text-base14;
  }

  .locale-label {
    @apply text-sm font-medium;
  }

  .locale-dropdown {
    @apply absolute right-0 mt-1 z-20;
    @apply w-40 bg-base0;
    @apply border border-base3/20;
  }

  .locale-options {
    @apply py-1;
  }

  .locale-option {
    @apply flex items-center gap-2 px-3 py-2;
    @apply text-left text-sm text-base5 hover:text-base14;
    @apply hover:bg-base1;
    @apply transition-colors;
  }

  .locale-option.active {
    @apply bg-base1/80 text-base14 font-medium;
  }

  .locale-flag {
    @apply text-base;
  }

  .locale-name {
    @apply text-sm;
  }
</style>
