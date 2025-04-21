<script>
  import {tick, onMount} from 'svelte';
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
  let tags = $state({});

  // Update tags object whenever payload changes
  const uniqueTags = toUniqArr(propPath, payload);
  const newTags = {};

  // Preserve selected state if tag still exists
  uniqueTags.forEach(tag => {
    newTags[tag] = tags[tag] || false;
  });

  tags = newTags;

  // DOM refs and state for carousel
  let tagsContainer;
  let showLeftArrow = $state(false);
  let showRightArrow = $state(true);
  let isScrolling = $state(false);

  // Return selected tags only
  let activeTagNames = $derived(filter(tag => tags[tag], keys(tags)));

  // Display posts that includes selected tags
  let filterByTagNames = $derived(filterArrByString(propPath, activeTagNames));

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

  // Toggle tag selection
  function toggleTag(tag) {
    // Create a new object to ensure reactivity
    const newTags = {...tags};
    newTags[tag] = !newTags[tag];
    tags = newTags;

    // Notify parent component
    const result = activeTagNames.length ? filterByTagNames(payload) : payload;
    toggleEvent(result, tag);
  }

  // Handle scroll arrows visibility
  function checkScrollPosition() {
    if (!tagsContainer) return;

    const {scrollLeft, scrollWidth, clientWidth} = tagsContainer;
    showLeftArrow = scrollLeft > 5;
    showRightArrow = scrollLeft < scrollWidth - clientWidth - 5;
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

    setTimeout(() => {
      isScrolling = false;
      checkScrollPosition();
    }, 300);
  }

  // Public method to reset tag state
  async function resetState() {
    // Create a new tags object with all values set to false
    const newTags = {};
    keys(tags).forEach(tag => {
      newTags[tag] = false;
    });

    // Update state
    tags = newTags;

    // Notify parent of reset
    toggleEvent(payload);

    // Reset scroll position
    if (tagsContainer) {
      tagsContainer.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }

    await tick();
    checkScrollPosition();

    return true; // Indicate successful reset
  }

  // Setup scroll event listener
  function setupScrollListener() {
    if (tagsContainer) {
      tagsContainer.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();

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

      return () => {
        tagsContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }

  // Set up scroll listener when component mounts
  onMount(setupScrollListener);
</script>

<div class="relative flex items-center w-full">
  {#if showLeftArrow}
    <button
      class="flex items-center justify-center w-6 h-6 bg-base1/80 rounded-full flex-shrink-0 text-base6 border border-base3/20 hover:bg-base1 hover:text-base14 transition-colors z-10 opacity-90 shadow-sm mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={scrollLeft}
      aria-label="Scroll tags left"
      disabled={isScrolling}
    >
      <ChevronLeft size={16} />
    </button>
  {/if}

  <div
    class="flex-1 flex flex-wrap gap-2 overflow-x-auto max-w-full overflow-y-hidden scrollbar-none scroll-smooth sm:flex-wrap"
    bind:this={tagsContainer}
    onscroll={checkScrollPosition}
  >
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
      class="flex items-center justify-center w-6 h-6 bg-base1/80 rounded-full flex-shrink-0 text-base6 border border-base3/20 hover:bg-base1 hover:text-base14 transition-colors z-10 opacity-90 shadow-sm ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={scrollRight}
      aria-label="Scroll tags right"
      disabled={isScrolling}
    >
      <ChevronRight size={16} />
    </button>
  {/if}
</div>
