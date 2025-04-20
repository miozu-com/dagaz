<script>
  import {onMount, onDestroy} from 'svelte';
  import {slide, fade} from 'svelte/transition';
  import {ChevronUp} from '$components/icons';
  import SkeletonLoader from '$components/SkeletonLoader.svelte';

  /**
   * Table of Contents component - Provides a fixed TOC with smooth scrolling and
   * automatic section highlighting
   *
   * @prop {Array} headings - Array of heading objects with {id, text, level} properties
   * @prop {boolean} isLoading - Whether content is still loading
   * @prop {string} className - Optional CSS class
   */
  let {headings = [], isLoading = false, className = ''} = $props();

  let isTocCollapsed = $state(false); // TODO Default collapsed on mobile
  let showBackToTop = $state(false);
  let activeHeadingId = $state('');
  let tocRef = $state(null);

  // Computed value for whether to show TOC at all
  const showToc = $derived(headings.length > 2);

  // Toggle TOC visibility on mobile
  function toggleToc() {
    isTocCollapsed = !isTocCollapsed;
  }

  // Smooth scroll to a heading when clicked
  function scrollToHeading(id, event) {
    if (event) {
      event.preventDefault();
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
      activeHeadingId = id;

      // Auto-collapse TOC on mobile after clicking
      if (window.innerWidth < 768) {
        isTocCollapsed = true;
      }
    }
  }

  // Scroll back to the top of the page
  function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    activeHeadingId = '';
  }

  // Update active heading based on scroll position
  function updateActiveHeading() {
    // Find all headings in the document
    const headingElements = Array.from(document.querySelectorAll('h1[id], h2[id], h3[id]'));
    if (!headingElements.length) return;

    // Get current scroll position with a small offset to highlight item a bit earlier
    const scrollPos = window.scrollY + 100;

    // Find the current heading by checking which one is closest to the top of viewport
    for (let i = headingElements.length - 1; i >= 0; i--) {
      const heading = headingElements[i];

      if (heading.offsetTop <= scrollPos) {
        // If we found a heading in view, update active heading
        if (activeHeadingId !== heading.id) {
          activeHeadingId = heading.id;
        }
        break;
      }
    }
  }

  // Handle scroll events
  function handleScroll() {
    // Show back to top button when scrolled down
    showBackToTop = window.scrollY > 300;

    // Update active heading based on scroll position
    if (headings.length > 0 && !isLoading) {
      // Throttle execution to avoid performance impact
      if (!window.tocScrollThrottled) {
        window.tocScrollThrottled = true;
        setTimeout(() => {
          updateActiveHeading();
          window.tocScrollThrottled = false;
        }, 100);
      }
    }
  }

  // Handle window resize events
  function handleResize() {
    isTocCollapsed = window.innerWidth < 768;
  }

  onMount(() => {
    // Listen for scroll and resize events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initial check for scroll position
    handleScroll();

    return () => {
      // Clean up event listeners
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.tocScrollThrottled = false;
    };
  });
</script>

<div class="toc-container-wrapper {className}">
  {#if showToc || isLoading}
    <!-- Desktop & Mobile TOC -->
    <aside
      bind:this={tocRef}
      class="toc-sidebar {isTocCollapsed && window?.innerWidth < 768 ? 'collapsed' : ''}"
    >
      <div class="toc-content">
        <h2 class="toc-title">Table of Contents</h2>

        {#if isLoading}
          <SkeletonLoader type="toc" lines={8} class="toc-skeleton" />
        {:else}
          <nav class="toc-nav">
            <ul class="toc-list">
              {#each headings as heading}
                <li
                  class="toc-item level-{heading.level} {activeHeadingId === heading.id ?
                    'active'
                  : ''}"
                >
                  <a href="#{heading.id}" on:click={e => scrollToHeading(heading.id, e)}>
                    {heading.text}
                  </a>
                </li>
              {/each}
            </ul>
          </nav>

          <!-- Back to top button - integrated in TOC -->
          {#if showBackToTop}
            <button class="toc-top-button" on:click={scrollToTop} transition:fade={{duration: 200}}>
              <ChevronUp size={16} />
              <span>Back to top</span>
            </button>
          {/if}
        {/if}
      </div>
    </aside>
  {/if}
</div>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  /* Main TOC container that stays fixed */
  .toc-container-wrapper {
    @apply fixed top-56 right-6 z-40 w-[280px];
    max-height: calc(100vh - 120px);
  }

  /* Hide TOC on mobile when collapsed */
  .toc-sidebar.collapsed {
    @apply hidden md:block;
  }

  .toc-content {
    @apply p-6 bg-base1/80 backdrop-blur-sm rounded-lg;
    @apply border border-base3/15;
    @apply shadow-sm hover:shadow-md transition-shadow duration-300;
  }

  .toc-title {
    @apply text-base14 text-lg font-semibold mb-4;
    @apply border-b border-base3/20 pb-2;
  }

  .toc-list {
    @apply space-y-2 mb-4; /* Add margin to make room for back-to-top button */
  }

  .toc-item {
    @apply text-base5 transition-colors;
    @apply text-sm;
  }

  .toc-item a {
    @apply block py-1 no-underline;
    @apply border-l-2 border-transparent pl-2; /* Add left border for hover effect */
    @apply transition-all duration-200;
  }

  .toc-item a:hover {
    @apply text-base14 border-base14/30;
  }

  .toc-item.active a {
    @apply text-base14 border-base14 font-medium;
  }

  .toc-item.level-1 {
    @apply font-semibold;
  }

  .toc-item.level-2 {
    @apply pl-3;
  }

  .toc-item.level-3 {
    @apply pl-6 text-base4;
  }

  /* Back to top button in TOC */
  .toc-top-button {
    @apply w-full flex items-center justify-center gap-2 mt-2 py-2 px-3;
    @apply bg-base1/70 hover:bg-base1 text-base5 hover:text-base14 rounded-md;
    @apply border border-base3/20 transition-all duration-200;
    @apply text-sm font-medium;
  }

  .toc-top-button:hover {
    @apply transform -translate-y-0.5;
  }

  /* Mobile TOC toggle button */
  .toc-toggle {
    @apply flex items-center justify-between gap-2 px-4 py-2 mb-2;
    @apply bg-base1/90 backdrop-blur-sm rounded-md;
    @apply text-base5 text-sm font-medium;
    @apply border border-base3/20 shadow-md;
    @apply transition-all duration-300;
  }

  .toc-toggle.toc-open {
    @apply bg-base14/20 text-base14;
  }

  .toggle-icon {
    @apply text-lg font-bold;
  }

  /* Skeleton loader styles */
  .toc-skeleton {
    @apply min-h-[200px];
  }

  /* Media queries */
  @media (max-width: 768px) {
    .toc-container-wrapper {
      max-width: 240px;
      right: 10px;
    }
  }

  @media (max-width: 640px) {
    .toc-container-wrapper {
      max-width: 200px;
      right: 5px;
    }
  }
</style>
