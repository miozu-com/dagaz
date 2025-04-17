<script>
 let {value = false, onclick, children, disabled = false, ariaLabel = 'Toggle switch'} = $props();
</script>

<button
 {onclick}
 {disabled}
 class="switch-container"
 aria-checked={value}
 aria-label={ariaLabel}
 type="button"
 role="switch"
>
 <div class="switch-toggle-button {value ? 'translate-x-5' : ''}">
  {#if children}
   {@render children()}
  {/if}
 </div>
</button>

<style lang="postcss">
 @import '../../theme.css' theme(reference);
 .switch-container {
  @apply relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-300;
  @apply border border-base1;
  @apply bg-transparent appearance-none;
  @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
 }
 .switch-toggle-button {
  @apply absolute top-0.5 left-1 w-7 h-7 rounded-full transition-transform duration-200;
 }
 :global(.dark) .switch-container {
  @apply border-base7;
 }
</style>
