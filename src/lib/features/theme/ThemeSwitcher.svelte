<script>
  import {Sun, Moon} from '$components/icons';

  // Get theme from props
  let {theme} = $props();

  console.log('theme ??', theme);
  // Use the reactive state directly
  let isDarkMode = $derived(theme.isDark);

  function toggleTheme() {
    theme.toggle();
  }
</script>

<button type="button" class="theme-toggle" onclick={toggleTheme} aria-pressed={isDarkMode}>
  <div class="icon-container">
    {#if isDarkMode}
      <Moon size={16} />
    {:else}
      <Sun size={16} />
    {/if}
  </div>
</button>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

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
