<!--
     @typedef {Object} TechItem
     @property {string} name - Technology name
     @property {import('svelte').SvelteComponent} [icon] - Optional Svelte icon component
     @property {string} [emoji] - Optional emoji if no icon
     @property {string} [color] - Optional color for the card



     Infinite scrolling carousel for technology cards
     @param {TechItem[]} items - Technology items to display
     @param {number} speed - Animation duration in seconds
     @param {string} class - Optional CSS class for styling
     @param {number} gap - Gap between items in pixels
     @param {boolean} pauseOnHover - Whether to pause animation on hover -->

<script>
  import {onMount, onDestroy} from 'svelte';

  let {items = [], speed = 30, class: className = '', gap = 20, pauseOnHover = true} = $props();

  // Clone items for seamless looping
  let clonedItems = $state([]);

  // Create cloned item sets for seamless looping
  $effect(() => {
    if (items.length > 0) {
      // Create multiple copies to ensure we have enough items for any screen width
      clonedItems = [...items, ...items, ...items];
    }
  });

  let containerRef = $state(null);
  let carouselRef = $state(null);
  let animationPaused = $state(false);
  let animationId = $state(null);

  // Track properties needed for animation
  let scrollPosition = $state(0);
  let totalWidth = $state(0);
  let viewportWidth = $state(0);
  let itemWidth = $state(0);
  let itemSetWidth = $state(0);

  // Add event listeners when component mounts
  onMount(() => {
    calculateDimensions();
    startAnimation();

    // Set up resize observer for responsive behavior
    if (typeof ResizeObserver !== 'undefined' && containerRef) {
      const resizeObserver = new ResizeObserver(() => {
        calculateDimensions();
        // Make sure animation continues with updated dimensions
        if (animationId) {
          cancelAnimationFrame(animationId);
          startAnimation();
        }
      });

      resizeObserver.observe(containerRef);

      // Cleanup on component destroy
      return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(animationId);
      };
    }

    // Fallback for browsers without ResizeObserver
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  });

  function calculateDimensions() {
    if (!containerRef || !carouselRef) return;

    // Get dimensions needed for proper animation
    viewportWidth = containerRef.offsetWidth;

    // Wait for next tick to ensure items are rendered
    setTimeout(() => {
      // Get the first set of items (first group up to original items.length)
      const itemElements = carouselRef.querySelectorAll('.carousel-item');
      if (itemElements.length === 0) return;

      // Calculate the width of one item including gap
      const firstItem = itemElements[0];
      itemWidth = firstItem.offsetWidth + gap;

      // Calculate the width of one complete set of items
      itemSetWidth = itemWidth * items.length;

      // Calculate total width of the track
      totalWidth = itemWidth * clonedItems.length;

      // Set initial scroll position
      scrollPosition = 0;
      if (carouselRef) {
        carouselRef.style.transform = `translateX(0px)`;
      }
    }, 0);
  }

  function handleResize() {
    calculateDimensions();
    if (animationId) {
      cancelAnimationFrame(animationId);
      startAnimation();
    }
  }

  function startAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    // Animation constants
    const pixelsPerSecond = 50 * (30 / speed); // Base speed adjusted by user speed setting
    let lastTime = performance.now();

    function animate(timestamp) {
      // Calculate time delta for smooth animation regardless of frame rate
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      if (animationPaused || !carouselRef || itemSetWidth === 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Calculate movement based on elapsed time and speed
      const pixelsToMove = (pixelsPerSecond * deltaTime) / 1000;
      scrollPosition += pixelsToMove;

      // The key to seamless looping: reset position when we've scrolled one full set
      if (scrollPosition >= itemSetWidth) {
        // Reset to beginning of next set
        scrollPosition = scrollPosition - itemSetWidth;
      }

      // Apply transform with hardware acceleration
      carouselRef.style.transform = `translateX(-${scrollPosition}px)`;

      animationId = requestAnimationFrame(animate);
    }

    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);
  }

  function handleMouseEnter() {
    if (pauseOnHover) {
      animationPaused = true;
    }
  }

  function handleMouseLeave() {
    if (pauseOnHover) {
      animationPaused = false;
    }
  }

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
</script>

<div
  class="carousel-container {className}"
  bind:this={containerRef}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <div class="carousel-track" bind:this={carouselRef} style="gap: {gap}px;">
    {#each clonedItems as item, i (i)}
      <div class="carousel-item" style={item.color ? `--card-color: ${item.color}` : ''}>
        {#if item.icon}
          <div class="item-icon">
            <svelte:component this={item.icon} size={24} />
          </div>
        {:else if item.emoji}
          <div class="item-emoji">{item.emoji}</div>
        {/if}
        <div class="item-name">{item.name}</div>
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  @import '$theme/theme.css' theme(reference);

  .carousel-container {
    @apply w-full overflow-hidden relative;
    /* Prevent flickering during animation */
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .carousel-track {
    @apply flex items-center;
    /* Preserve 3D for performance */
    transform-style: preserve-3d;
    will-change: transform;
    /* Remove transition for smoother animation */
  }

  .carousel-item {
    @apply flex flex-col items-center bg-base1/30 p-4 rounded-lg;
    @apply min-w-32 transition-all hover:bg-base1/60;
    @apply flex-shrink-0;
    /* Allow custom color through CSS variable */
    border-left: 3px solid var(--card-color, transparent);
  }

  .item-icon,
  .item-emoji {
    @apply mb-2 text-base14;
  }

  .item-emoji {
    @apply text-2xl;
  }

  .item-name {
    @apply text-sm font-medium text-base6;
  }
</style>
