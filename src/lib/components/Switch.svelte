<script>
  import {tweened} from 'svelte/motion';
  import {cubicInOut} from 'svelte/easing';

  let {
    disabled = false,
    name = '',
    id = '',
    ref = $bindable(),
    class: className = '',
    unstyled = false,
    oninput = () => {},
    value = false,
    ...others
  } = $props();

  const finalClassName = $derived(unstyled ? className : `base-switcher ${className}`);

  // Local state to manage the checked state
  let localChecked = $state(value);

  const position = tweened(value ? 20 : 0, {
    duration: 135,
    easing: cubicInOut
  });

  function handleChange(e) {
    // Toggle the local state
    localChecked = !localChecked;

    // Update the position directly
    $position = localChecked ? 20 : 0;

    // Notify the parent component
    const syntheticEvent = {
      target: {
        name,
        value: localChecked,
        checked: localChecked
      },
      currentTarget: e.currentTarget
    };

    if (oninput) oninput(syntheticEvent);
  }
</script>

<label class="switcher-wrapper" class:disabled>
  <input
    type="checkbox"
    bind:this={ref}
    {id}
    {name}
    {disabled}
    checked={value}
    on:change={handleChange}
    class={finalClassName}
    {...others}
  />
  <div class="switcher-track" class:checked={localChecked}>
    <div class="switcher-thumb" style="transform: translateX({$position}px)"></div>
  </div>
</label>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .switcher-wrapper {
    @apply inline-flex items-center cursor-pointer;
    &.disabled {
      @apply cursor-not-allowed opacity-50;
    }
  }

  input {
    @apply sr-only;
  }

  .switcher-track {
    @apply relative w-[40px] h-[20px] rounded-full;
    @apply bg-base3/35 ring-1 ring-base3/35;
    @apply transition-colors duration-300;

    &.checked {
      @apply bg-base10/60 ring-base10/60;
    }
  }

  :global(.dark) .switcher-track {
    @apply bg-base5/20 ring-base5/20;

    &.checked {
      @apply bg-base10/70 ring-base10/70;
    }
  }

  .switcher-thumb {
    @apply absolute top-[2px] left-[2px];
    @apply w-[16px] h-[16px] rounded-full;
    @apply bg-base5 shadow-sm;
    @apply transition-all duration-300;

    .switcher-track.checked & {
      @apply bg-base7;
    }
  }

  :global(.dark) .switcher-thumb {
    @apply bg-base7;

    .switcher-track.checked & {
      @apply bg-base0;
    }
  }

  /* Focus styles */
  input:focus + .switcher-track {
    @apply ring-2 ring-base14;
    @apply shadow-[0_0_0_2px_rgba(255,153,130,0.25)];
  }

  :global(.dark) input:focus + .switcher-track {
    @apply ring-base10/40;
    @apply shadow-[0_0_0_2px_rgba(109,214,114,0.3)];
  }
</style>
