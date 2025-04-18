<script>
  let {
    children,
    label = '',
    selected = false,
    onclick = () => {},
    count = undefined,
    class: className = ''
  } = $props();

  // Handle click events, toggle selection, and call the onClick handler
  function handleClick() {
    selected = !selected;
    onclick(selected); // Notify parent about the change
  }
</script>

<button
  class="badge {selected ? 'selected' : ''} {className}"
  aria-pressed={selected}
  onclick={handleClick}
>
  {#if children}
    {@render children()}
  {/if}
  <span>{label}</span>
  {#if count !== undefined}
    <span class="badge-count">{count}</span>
  {/if}
</button>

<style lang="postcss">
  @import '../../theme.css' theme(reference);

  .badge {
    @apply inline-flex items-center;
    @apply pl-4 pr-3 py-0.5;
    @apply border rounded-[2px];
    @apply border-base3 text-base4;
    @apply bg-base1/40;
    @apply text-sm whitespace-nowrap cursor-pointer;
    @apply transition-colors duration-200 ease-in-out;
    @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
  }

  .badge:hover {
    @apply bg-base1 text-base6;
    @apply border-base4;
  }

  .badge.selected {
    @apply bg-base2 text-base7;
    @apply border-base14/40;
  }

  .badge-count {
    @apply ml-2 text-xs font-semibold;
    @apply text-base4;
  }

  .badge.selected .badge-count {
    @apply text-base7 font-bold;
  }
</style>
