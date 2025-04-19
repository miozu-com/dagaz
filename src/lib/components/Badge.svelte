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
    @apply pl-3 pr-2 py-1;
    @apply rounded-full;
    @apply border border-base3/20;
    @apply text-base4 bg-transparent;
    @apply text-sm whitespace-nowrap cursor-pointer;
    @apply transition-colors duration-200 ease-in-out;
    @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
  }

  .badge:hover {
    @apply bg-base1/60 text-base6;
    @apply border-base4/30;
  }

  .badge.selected {
    @apply bg-base1/70 text-base7;
    @apply border-base14/40;
  }

  .badge-count {
    @apply ml-2 text-xs rounded-full bg-base1/80 px-1.5 py-0.5;
    @apply text-base4;
  }

  .badge.selected .badge-count {
    @apply text-base14 font-semibold bg-base2/70;
  }
</style>
