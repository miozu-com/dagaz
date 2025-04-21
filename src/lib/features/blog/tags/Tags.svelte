<!-- src/lib/features/blog/tags/Tags.svelte -->
<script>
  import {
    pipe,
    defaultTo,
    keys,
    forEach,
    filter,
    reduce,
    inc,
    path,
    is,
    complement,
    both
  } from 'ramda';
  import Badge from '$components/Badge.svelte';
  import {toUniqArr, filterArrByString} from '$utils';
  import {ChevronLeft, ChevronRight} from '$components/icons';

  let {payload = [], children, propPath = [], toggleEvent = () => {}, isTagCount = true} = $props();

  // Ensure payload is always an array
  payload = payload || [];

  // Helper function to check if a value is an array and not null/undefined
  const isValidArray = both(
    complement(val => val === null || val === undefined),
    is(Array)
  );

  // Initialize each tag as a property with a false value
  let tags = $state(
    reduce((acc, tag) => ({...acc, [tag]: false}), {}, toUniqArr(propPath, payload))
  );

  // DOM refs and state for carousel
  let tagsContainer;
  let showLeftArrow = $state(false);
  let showRightArrow = $state(true);
  let isScrolling = $state(false);

  // Return selected tags only
  const activeTagNames = $derived(filter(tag => tags[tag], keys(tags)));

  // Display posts that includes selected tags
  const filterByTagNames = $derived(filterArrByString(propPath, activeTagNames));

  // Calculate tag counts safely
  const tagCounts = reduce(
    (acc, item) => {
      const tagsAtPath = path(propPath, item);
      // Only process if tagsAtPath exists and is an array
      if (isValidArray(tagsAtPath)) {
        forEach(tag => (acc[tag] = inc(defaultTo(0, acc[tag]))), tagsAtPath);
      }
      return acc;
    },
    {},
    payload
  );

  const toggleTag = tag =>
    pipe(
      tap(() => (tags[tag] = !tags[tag])), // toggle the value in the tags object
      tap(() => toggleEvent(activeTagNames.length ? filterByTagNames(payload) : payload, tag))
    )(tag);

  // Explicit tap implementation since Ramda's tap doesn't seem to be working correctly
  function tap(fn) {
    return x => {
      fn(x);
      return x;
    };
  }

  // Handle scroll arrows visibility
  function checkScrollPosition() {
    if (!tagsContainer) return;

    const {scrollLeft, scrollWidth, clientWidth} = tagsContainer;
    showLeftArrow = scrollLeft > 5; // Small threshold to account for browsers
    showRightArrow = scrollLeft < scrollWidth - clientWidth - 5; // Small threshold for right edge
  }

  // Scroll to previous tags
  function scrollLeft() {
    if (!tagsContainer) return;
    isScrolling = true;

    const scrollAmount = tagsContainer.clientWidth * 0.8;
    tagsContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });

    // Wait for scroll to complete
    setTimeout(() => {
      isScrolling = false;
      checkScrollPosition();
    }, 300);
  }

  // Scroll to next tags
  function scrollRight() {
    if (!tagsContainer) return;
    isScrolling = true;

    const scrollAmount = tagsContainer.clientWidth * 0.8;
    tagsContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });

    // Wait for scroll to complete
    setTimeout(() => {
      isScrolling = false;
      checkScrollPosition();
    }, 300);
  }

  // Public method to reset tag state - IMPROVED with force update
  function resetState() {
    // Reset all tags to false with a brand new object to ensure reactivity
    const newTags = {};
    keys(tags).forEach(tag => {
      newTags[tag] = false;
    });
    tags = newTags; // Replace the entire object for better reactivity

    // Notify parent that all filters are cleared
    toggleEvent(payload);

    // Scroll back to start
    if (tagsContainer) {
      tagsContainer.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }

    // Force a re-render of badge elements
    setTimeout(() => {
      // This triggers a re-render by making a harmless state change
      tags = {...tags};
    }, 20);
  }

  $effect(() => {
    if (tagsContainer) {
      // Check initial scroll status
      setTimeout(checkScrollPosition, 100);

      // Add scroll event listener
      tagsContainer.addEventListener('scroll', checkScrollPosition);

      // Set up resize observer
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
          checkScrollPosition();
        });

        resizeObserver.observe(tagsContainer);

        return () => {
          resizeObserver.disconnect();
          tagsContainer.removeEventListener('scroll', checkScrollPosition);
        };
      }
    }
  });
</script>

<div class="tags-container-wrapper">
  {#if showLeftArrow}
    <button
      class="scroll-arrow left-arrow"
      onclick={scrollLeft}
      aria-label="Scroll tags left"
      disabled={isScrolling}
    >
      <ChevronLeft size={16} />
    </button>
  {/if}

  <div class="tags-container" bind:this={tagsContainer}>
    {#each keys(tags) as tag (tag)}
      <Badge
        onclick={() => toggleTag(tag)}
        label={tag}
        selected={tags[tag]}
        count={isTagCount ? tagCounts[tag] : undefined}
      />
    {/each}

    {#if children}
      {@render children()}
    {/if}
  </div>

  {#if showRightArrow}
    <button
      class="scroll-arrow right-arrow"
      onclick={scrollRight}
      aria-label="Scroll tags right"
      disabled={isScrolling}
    >
      <ChevronRight size={16} />
    </button>
  {/if}
</div>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .tags-container-wrapper {
    @apply relative flex items-center w-full;
  }

  .tags-container {
    @apply flex-1 flex flex-wrap gap-2 overflow-x-auto;
    /* Improved mobile layout */
    @apply max-w-full overflow-y-hidden;
    scroll-behavior: smooth;

    /* Hide scrollbar but keep functionality */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  /* Mobile-specific styling */
  @media (max-width: 640px) {
    .tags-container {
      @apply flex-nowrap;
      scroll-snap-type: x mandatory;
    }
  }

  /* Hide scrollbar for Chrome/Safari/Opera */
  .tags-container::-webkit-scrollbar {
    display: none;
  }

  .scroll-arrow {
    @apply flex items-center justify-center;
    @apply w-6 h-6 bg-base1/80 rounded-full flex-shrink-0;
    @apply text-base6 border border-base3/20;
    @apply hover:bg-base1 hover:text-base14 transition-colors;
    @apply z-10 opacity-90;
    @apply shadow-sm;
  }

  .left-arrow {
    @apply mr-1;
  }

  .right-arrow {
    @apply ml-1;
  }

  /* Disabled state for arrows during animation */
  .scroll-arrow:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
</style>
