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

  // Duplicate items for seamless looping
  $effect(() => {
    if (items.length > 0) {
      // Clone the original items to ensure seamless looping
      clonedItems = [...items, ...items];
    }
  });

  let containerRef = $state(null);
  let carouselRef = $state(null);
  let clonedItems = $state([]);
  let animationPaused = $state(false);
  let containerWidth = $state(0);
  let carouselWidth = $state(0);
  let animationId = $state(null);

  // Add event listeners when component mounts
  onMount(() => {
    // Calculate initial dimensions for animation
    calculateDimensions();

    // Set up resize observer for responsive behavior
    if (typeof ResizeObserver !== 'undefined' && containerRef) {
      const resizeObserver = new ResizeObserver(() => {
        calculateDimensions();
        restartAnimation();
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

    containerWidth = containerRef.offsetWidth;
    carouselWidth = carouselRef.offsetWidth;

    // Start animation if dimensions are valid
    if (containerWidth > 0 && carouselWidth > 0) {
      startAnimation();
    }
  }

  function handleResize() {
    calculateDimensions();
    restartAnimation();
  }

  let startTime = 0;
  let currentPosition = 0;

  function startAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    startTime = performance.now();

    function animate(timestamp) {
      if (animationPaused) {
        startTime = timestamp - currentPosition * speed * 10;
        animationId = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - startTime;
      // Calculate position based on time and speed
      // Faster speed = smaller divisor
      currentPosition = (elapsed / (speed * 10)) % 100;

      if (carouselRef) {
        // Use translateX for hardware acceleration
        carouselRef.style.transform = `translateX(-${currentPosition}%)`;

        // If we've moved a full item width, reset position for seamless loop
        if (currentPosition >= 50) {
          // Instantly move back to start without animation
          // This creates the infinite loop effect
          startTime = timestamp;
          currentPosition = 0;
          carouselRef.style.transform = `translateX(0%)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
  }

  function restartAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    // Reset position
    if (carouselRef) {
      carouselRef.style.transform = 'translateX(0)';
    }

    startAnimation();
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
  @import '../../theme.css' theme(reference);

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
    /* Use transition for smoother animation updates */
    transition: transform 0.1s linear;
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
