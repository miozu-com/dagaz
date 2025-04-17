<script>
  let {
    children,
    label = '',
    selected = false,
    onclick = () => {},
    class: className = ''
  } = $props();

  // TODO add jsdoc
  // data-tab-id is required in order for tabs to function properly
  // Handle click events, toggle selection, and call the onClick handler
  function handleClick(e) {
    onclick(e); // Notify parent about the change
    selected = e;
  }
</script>

<button class="tab {className}" aria-pressed={selected} onclick={handleClick} data-tab-id={label}>
  {#if children}
    {@render children()}
  {/if}
  {#if label}
    <span>{label}</span>
  {/if}
</button>

<style lang="postcss">
  @import '../../../../theme.css' theme(reference);

  :global(.dark) .tab:hover {
    @apply bg-base1 text-base14 border-base14/30;
  }
  :global(.dark) .tab.selected {
    @apply text-base14 border-base14/35;
    &:hover {
      @apply border-base14/55;
    }
  }
  .tab {
    @apply inline-flex items-center relative;
    @apply pl-4 pr-3 py-0.5;
    @apply rounded-[2px];
    @apply text-sm whitespace-nowrap cursor-pointer;
    @apply transition-colors duration-200 ease-in-out;
    @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
  }
  .tab:hover {
    @apply bg-base1 text-base6;
  }
  .tab.selected {
    @apply border-base5 border-b bg-base1 text-base7;
  }
  .tab-count {
    @apply ml-2 text-xs text-base4 font-semibold;
  }
  .tab.selected .count {
    @apply text-base7 font-bold;
  }
</style>
