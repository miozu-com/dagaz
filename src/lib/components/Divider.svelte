<script>
 let {
  class: className = '',
  orientation = 'horizontal',
  thickness = '1px',
  length = '100%',
  children
 } = $props();
</script>

{#if children}
 <div class="divider-wrapper">
  {@render children()}
  <div class="divider-content">
   <div
    class={className}
    style={orientation === 'horizontal' ?
     `min-height: ${thickness}; width: ${length};`
    : `width: ${thickness}; min-height: ${length};`}
   ></div>
  </div>
 </div>
{:else}
 <div
  class={className}
  style={orientation === 'horizontal' ?
   `min-height: ${thickness}; width: ${length};`
  : `width: ${thickness}; min-height: ${length};`}
 ></div>
{/if}

<style lang="postcss">
 @import '../../theme.css' theme(reference);
 .divider-wrapper {
  @apply flex flex-col;
  .divider-content {
   @apply h-12 w-full px-4 flex items-center;
  }
 }
 div {
  @apply bg-base4/20;
 }
</style>
