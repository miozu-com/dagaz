<script>
  import {slide} from 'svelte/transition';
  import Button from './Button.svelte';
  import {ChevronDown, Check} from '$components/icons';

  let {
    options = [],
    value = null,
    onChange = null,
    placeholder = 'Select option...',
    disabled = false,
    error = false,
    class: className = '',
    optionKey = 'label',
    valueKey = 'value',
    buttonVariant = 'md'
  } = $props();

  let selected = $state(null);
  let isOpen = $state(false);
  let selectRef = $state(null);
  let optionsRef = $state(null);

  function handleClickOutside(event) {
    if (selectRef && !selectRef.contains(event.target)) {
      isOpen = false;
    }
  }

  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }

  let displayValue = $derived(selected ? selected : placeholder);

  function handleSelect(option) {
    selected = option[valueKey];
    const selectedOption = options.find(opt => opt[valueKey] === selected);
    if (!selected || !selectedOption) selected = null;
    selected = selectedOption[optionKey];
    if (onChange) {
      onChange(selectedOption);
    }
    isOpen = false;
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  });
</script>

<div
  class="select-container {className}"
  bind:this={selectRef}
  data-state={isOpen ? 'open' : 'closed'}
>
  <Button
    variant="primary {buttonVariant}"
    onclick={toggleDropdown}
    {disabled}
    class="select-trigger"
    icon={{
      icon: ChevronDown,
      position: 'right'
    }}
    aria-expanded={isOpen}
    aria-invalid={error}
  >
    {displayValue}
  </Button>

  {#if isOpen}
    <div
      in:slide={{y: -20}}
      out:slide={{y: -15}}
      class="select-content"
      bind:this={optionsRef}
      role="listbox"
      tabindex="-1"
    >
      {#each options as option (option[valueKey])}
        {@const isSelected = (onChange ? value : selected) === option[valueKey]}
        <Button
          variant="secondary"
          class="select-item"
          onclick={() => handleSelect(option)}
          role="option"
          aria-selected={isSelected}
        >
          <span class="select-item-label">{option[optionKey]}</span>
          {#if isSelected}
            <span class="select-item-indicator">
              <Check size={16} />
            </span>
          {/if}
        </Button>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import '$styles/theme.css' theme(reference);

  .select-container {
    @apply relative w-full;
  }

  .select-trigger {
    @apply justify-between;
  }

  /* @apply animate-in fade-in-0 zoom-in-95; */
  .select-content {
    @apply absolute z-50 w-full mt-1 rounded-xs border border-base4 bg-base0 shadow-lg;
    @apply flex flex-col;
    @apply overflow-y-auto max-h-[200px];
    scrollbar-gutter: stable;
  }

  .select-item {
    @apply relative w-full cursor-default select-none py-1.5 pl-2 pr-8 text-sm outline-none;
    @apply flex items-center justify-between;
    @apply transition-colors hover:bg-base2/50;
  }

  .select-item-indicator {
    @apply absolute right-2 flex h-4 w-4 items-center justify-center;
  }
</style>
