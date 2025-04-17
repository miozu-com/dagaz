<script>
  let {
    children = undefined,
    type: buttonType = 'button',
    class: className = '',
    disabled = false,
    icon = null, // {icon: Component, position: 'left' | 'right'}
    loader = null, // {icon: Component, text: '', style: '', position: 'left' | 'right'}
    variant = '', // primary, secondary, danger
    fullWidth = false,
    onclick = () => {},
    ...rest
  } = $props();
</script>

<button
  {buttonType}
  type={buttonType}
  {onclick}
  {disabled}
  class={`${className} ${variant} ${fullWidth ? 'full-width' : ''} base-button`}
  {...rest}
>
  {#if disabled && loader}
    {#if loader.position === 'left'}
      <span class="icon-wrapper {loader?.style} icon-left">
        {@render loader.icon({...loader.icon})}
      </span>
    {/if}
    <span class="button-text">{loader?.text}</span>
    {#if loader.position === 'right'}
      <span class="icon-wrapper {loader?.style} icon-right">
        {@render loader.icon({...loader.icon})}
      </span>
    {/if}
  {:else}
    {#if icon && icon.position === 'left'}
      <span class="icon-wrapper icon-left">
        {@render icon.icon({...icon})}
      </span>
    {/if}
    {#if children !== undefined}
      <span class="button-text">{@render children()}</span>
    {/if}
    {#if icon && icon.position === 'right'}
      <span class="icon-wrapper icon-right">
        {@render icon.icon({...icon})}
      </span>
    {/if}
  {/if}
</button>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .base-button {
    @apply inline-flex items-center justify-center;
    @apply transition-all duration-200 bg-transparent cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      select-none font-medium;
  }

  .button-text {
    @apply inline-block px-1 whitespace-nowrap; /* Added whitespace-nowrap */
  }

  .icon-wrapper {
    @apply inline-flex items-center justify-center;
  }

  /* Variants */
  .primary {
    @apply hover:bg-base14/20 hover:text-base1
    py-2 px-4 text-base3;
    @apply outline outline-1 outline-base4/35 hover:ring-2 hover:ring-base4/35
    rounded-xs;
  }

  .secondary {
    @apply hover:bg-base13/20 hover:text-base1
     text-base3;
  }
  .success {
    @apply hover:bg-base10/70 hover:text-base7 focus:bg-base10/50 focus:text-base6/80;
  }
  .danger {
    @apply hover:bg-base9/20 hover:text-base1 text-base9;
  }
  .simple {
    @apply h-full;
    @apply p-3.5;
  }
  .simple .icon-left {
    margin-right: 0 !important;
  }

  .simple .icon-right {
    margin-left: 0 !important;
  }

  .icon-left {
    &:not(.simple) {
      @apply mr-auto;
    }
  }

  .icon-right {
    &:not(.simple) {
      @apply ml-auto;
    }
  }

  /* Sizes */
  .xs {
    @apply py-0.5 px-2 text-sm;
  }
  .sm {
    @apply py-1 px-2.5 text-sm;
  }
  .md {
    @apply py-1 px-3.5 text-base;
  }
  .lg {
    @apply py-3 px-5 text-lg;
  }

  /* Dark mode */
  :global(.dark) .base-button {
    &.primary {
      @apply hover:bg-base0 focus:bg-base1/30 active:bg-base1 hover:text-base7
         text-base5/90;
      @apply outline-base3/40;
    }
    &.secondary {
      @apply hover:bg-base3/30 focus:bg-base3 active:bg-base2 hover:text-base7 text-base5/90;
      @apply outline-base3/40;
    }
    &.danger {
      @apply hover:text-base9 hover:outline-base9/50;
    }
    &.success {
      @apply hover:text-base10 hover:outline-base10/50;
    }
    &.simple {
      @apply border-base4;
      &:not(.success) {
        @apply hover:bg-base14 hover:text-base1;
      }
      &.success {
        @apply hover:bg-base10 hover:text-base0;
      }
    }
  }
</style>
