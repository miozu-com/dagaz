<script>
  let {
    children = undefined,
    type: buttonType = 'button',
    class: className = '',
    disabled = false,
    icon = null, // {icon: Component, position: 'left' | 'right'}
    loader = null, // {icon: Component, text: '', style: '', position: 'left' | 'right'}
    variant = 'primary', // primary, secondary, minimal, accent
    size = 'md', // sm, md, lg
    fullWidth = false,
    onclick = () => {},
    href = '',
    ...rest
  } = $props();

  // If href is provided, render as <a> tag instead of button
  const isLink = $derived(href && href.length > 0);

  // Determine if button has an icon only (no text content)
  const isIconOnly = $derived(icon && !children);
</script>

{#if isLink}
  <a
    {href}
    class={`btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${isIconOnly ? 'icon-only' : ''} ${className}`}
    {...rest}
  >
    {#if icon && icon.position === 'left'}
      <span class="icon-wrapper">
        {@render icon.icon({...icon})}
      </span>
    {/if}

    {#if children !== undefined}
      <span class="button-text">{@render children()}</span>
    {/if}

    {#if icon && icon.position === 'right'}
      <span class="icon-wrapper">
        {@render icon.icon({...icon})}
      </span>
    {/if}
  </a>
{:else}
  <button
    {buttonType}
    type={buttonType}
    {onclick}
    {disabled}
    class={`btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${isIconOnly ? 'icon-only' : ''} ${className}`}
    {...rest}
  >
    {#if disabled && loader}
      {#if loader.position === 'left'}
        <span class="icon-wrapper {loader?.style}">
          {@render loader.icon({...loader.icon})}
        </span>
      {/if}
      <span class="button-text">{loader?.text}</span>
      {#if loader.position === 'right'}
        <span class="icon-wrapper {loader?.style}">
          {@render loader.icon({...loader.icon})}
        </span>
      {/if}
    {:else}
      {#if icon && icon.position === 'left'}
        <span class="icon-wrapper">
          {@render icon.icon({...icon})}
        </span>
      {/if}

      {#if children !== undefined}
        <span class="button-text">{@render children()}</span>
      {/if}

      {#if icon && icon.position === 'right'}
        <span class="icon-wrapper">
          {@render icon.icon({...icon})}
        </span>
      {/if}
    {/if}
  </button>
{/if}

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .btn {
    @apply inline-flex items-center justify-center;
    @apply transition-colors duration-150;
    @apply cursor-pointer select-none;
    @apply font-medium whitespace-nowrap;
    @apply focus:outline-none;
    @apply no-underline; /* For link buttons */
    background: transparent;
    border: 1px solid transparent;
    text-decoration: none;
  }

  .button-text {
    @apply inline-flex items-center whitespace-nowrap;
  }

  .icon-wrapper {
    @apply flex items-center justify-center;
  }

  .icon-wrapper + .button-text {
    @apply ml-2;
  }

  .button-text + .icon-wrapper {
    @apply ml-2;
  }

  /* Icon-only buttons */
  .icon-only {
    @apply p-1;
    aspect-ratio: 1;
  }

  /* Size variants */
  .btn.sm {
    @apply py-1 px-3 text-xs;
    height: 28px;
  }

  .btn.md {
    @apply py-1.5 px-4 text-sm;
    height: 32px;
  }

  .btn.lg {
    @apply py-2 px-5 text-base;
    height: 40px;
  }

  /* Button Variants */

  /* Primary Button - Dark background with light text */
  .primary {
    @apply bg-base1 text-base6;
    @apply border border-base3/30;
    @apply hover:bg-base2 hover:border-base3/50 hover:text-base7;
  }

  /* Secondary Button - Transparent with subtle border */
  .secondary {
    @apply bg-transparent text-base5;
    @apply border border-base3/20;
    @apply hover:bg-base1/50 hover:border-base3/30 hover:text-base6;
  }

  /* Minimal Button - Like secondary but without borders */
  .minimal {
    @apply bg-transparent text-base5 border-none;
    @apply hover:bg-base1/30 hover:text-base6;
  }

  /* Accent Button - Uses the brand accent color */
  .accent {
    @apply bg-transparent text-base14;
    @apply border border-base14/30;
    @apply hover:bg-base14/10 hover:border-base14/50;
  }

  /* Disabled state */
  .btn:disabled {
    @apply opacity-50 cursor-not-allowed pointer-events-none;
  }

  /* Full width */
  .full-width {
    @apply w-full;
  }
</style>
