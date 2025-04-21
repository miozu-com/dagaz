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
  class="inline-flex items-center relative px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer text-base4 hover:text-base6 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 focus:ring-offset-0 flex-shrink-0 {(
    selected
  ) ?
    'text-base14 bg-base1/60'
  : ''} {className}"
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

<style>
  @import '$styles/theme.css' theme(reference);

  button {
    @apply px-3 py-1.5 min-w-max;
  }
</style>
