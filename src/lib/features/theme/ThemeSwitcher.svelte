<script>
  import {Sun, Moon} from '$components/icons';

  let {theme} = $props();

  let isDarkMode = $derived(theme.isDark);
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={() => theme.toggle()}
  aria-pressed={isDarkMode}
  aria-label="theme switcher"
>
  <div class="icon-container">
    {#if isDarkMode}
      <Moon size={16} />
    {:else}
      <Sun size={16} />
    {/if}
  </div>
</button>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .theme-toggle {
    @apply flex items-center justify-center h-8 w-8 rounded-full;
    @apply bg-base1 hover:bg-base2 transition-colors;
    @apply focus:outline-none focus:ring-2 focus:ring-base14/50;
  }

  .icon-container {
    @apply flex items-center justify-center;
    @apply text-base5 hover:text-base14 transition-colors;
  }
</style>
