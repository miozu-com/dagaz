<script>
  let {
    children,
    label = '',
    selected = false,
    onclick = () => {},
    class: className = ''
  } = $props();

  // Handle click events, toggle selection, and call the onClick handler
  function handleClick() {
    onclick(label); // Pass the label to the parent for identification
  }
</script>

<button
  class="tab {selected ? 'selected' : ''} {className}"
  aria-pressed={selected}
  onclick={handleClick}
  data-tab-id={label}
>
  {#if children}
    {@render children()}
  {/if}
  {#if label}
    <span>{label}</span>
  {/if}
</button>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .tab {
    @apply inline-flex items-center relative;
    @apply px-4 py-2;
    @apply text-sm font-medium whitespace-nowrap cursor-pointer;
    @apply text-base4 hover:text-base6;
    @apply transition-colors duration-200 ease-in-out;
    @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
    /* Ensure width isn't overly constrained on mobile */
    @apply flex-shrink-0;
  }

  .tab.selected {
    @apply text-base14 bg-base1/60;
  }

  /* Mobile optimization */
  @media (max-width: 640px) {
    .tab {
      @apply px-3 py-1.5;
      min-width: max-content;
    }
  }
</style>
