<script>
  import {onMount, onDestroy} from 'svelte';
  import {slide, fade} from 'svelte/transition';
  import {ChevronUp} from '$components/icons';
  import SkeletonLoader from '$components/SkeletonLoader.svelte';

  /**
   * Table of Contents component - Provides a fixed TOC with smooth scrolling and
   * automatic section highlighting using IntersectionObserver
   *
   * @prop {Array} headings - Array of heading objects with {id, text, level} properties
   * @prop {boolean} isLoading - Whether content is still loading
   * @prop {string} className - Optional CSS class
   */
  let {headings = [], isLoading = false, className = ''} = $props();

  let isTocCollapsed = $state(false);
  let showBackToTop = $state(false);
  let activeHeadingId = $state('');
  let visibleHeadingIds = $state([]);
  let tocRef = $state(null);
  let observers = [];
  let manuallySelected = $state(false);

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
      manuallySelected = true;

      // Auto-collapse TOC on mobile after clicking
      if (window.innerWidth < 768) {
        isTocCollapsed = true;
      }

      // Reset manual selection after 2 seconds
      setTimeout(() => {
        manuallySelected = false;
      }, 2000);
    }
  }

  // Scroll back to the top of the page
  function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    activeHeadingId = '';
    visibleHeadingIds = [];
  }

  // Check if we should show the back to top button
  function handleScroll() {
    showBackToTop = window.scrollY > 300;
  }

  // Set up intersection observers for each heading
  function setupObservers() {
    // Clean up any existing observers
    observers.forEach(observer => observer.disconnect());
    observers = [];

    // Query all headings in the document - including h1-h6 elements
    const headingElements = document.querySelectorAll(
      'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
    );
    if (!headingElements.length) return;

    // Map of element IDs to their corresponding TOC items
    const headingMap = {};
    headings.forEach(heading => {
      headingMap[heading.id] = heading;
    });

    // Create the main visibility observer with a generous margin
    // This will mark headings as visible even if only partially in viewport
    const visibilityObserver = new IntersectionObserver(
      entries => {
        // Process all intersection entries
        entries.forEach(entry => {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            // If it's entering the viewport and not already marked visible
            if (!visibleHeadingIds.includes(id)) {
              visibleHeadingIds = [...visibleHeadingIds, id];
            }
          } else {
            // If it's leaving the viewport and is marked visible
            visibleHeadingIds = visibleHeadingIds.filter(visibleId => visibleId !== id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-5% 0px -5% 0px', // Very generous margins to catch partially visible headings
        threshold: 0.01 // Even tiny visibility counts
      }
    );

    observers.push(visibilityObserver);

    // Active heading observer - more strict about what's considered "active"
    const activeObserver = new IntersectionObserver(
      entries => {
        // Don't update active if manually selected (clicked) recently
        if (manuallySelected) return;

        // Find entries in viewport, sorted by their vertical position
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            // Get the absolute position from viewport top
            const posA = a.boundingClientRect.top;
            const posB = b.boundingClientRect.top;
            return posA - posB; // Sort by closest to viewport top
          });

        // Set the topmost visible heading as active
        if (visibleEntries.length > 0) {
          activeHeadingId = visibleEntries[0].target.id;
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -75% 0px', // Focus on top 25% of viewport
        threshold: [0.1, 0.5] // Need reasonable visibility to become active
      }
    );

    observers.push(activeObserver);

    // Observe all heading elements with both observers
    headingElements.forEach(element => {
      if (element.id) {
        visibilityObserver.observe(element);
        activeObserver.observe(element);
      }
    });
  }

  // Handle window resize events
  function handleResize() {
    isTocCollapsed = window.innerWidth < 768;
  }

  onMount(() => {
    // Setup observers once DOM is ready
    if (!isLoading && headings.length > 0) {
      setTimeout(setupObservers, 200); // Small delay to ensure DOM is ready
    }

    // Listen for scroll for back-to-top button
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleScroll();
    handleResize();

    return () => {
      // Clean up event listeners and observers
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observers.forEach(observer => observer.disconnect());
    };
  });

  $effect(() => {
    if (!isLoading && headings.length > 0 && typeof window !== 'undefined') {
      // Small delay to ensure DOM is ready
      setTimeout(setupObservers, 300);

      // Also periodically refresh observers to catch any dynamic content changes
      const refreshInterval = setInterval(() => {
        setupObservers();
      }, 2000);

      // Clean up
      return () => {
        clearInterval(refreshInterval);
        observers.forEach(observer => observer.disconnect());
      };
    }
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
                  class="toc-item level-{heading.level}
                         {activeHeadingId === heading.id ? 'active' : ''}
                         {visibleHeadingIds.includes(heading.id) ? 'visible' : ''}"
                >
                  <a href="#{heading.id}" on:click={e => scrollToHeading(heading.id, e)}>
                    <span class="toc-text">{heading.text}</span>
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
    @apply overflow-y-auto max-h-[calc(100vh-240px)];
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

  /* Common styles for all links */
  .toc-item a {
    @apply block py-1 no-underline;
    @apply border-l-0 pl-2; /* No left border by default */
    @apply transition-all duration-200;
  }

  /* Link hover - show the left border */
  .toc-item a:hover {
    @apply text-base14 border-l-2 border-base14/50;
  }

  /* Active item has base14 color but no border unless hovered */
  .toc-item.active a {
    @apply text-base14 font-medium;
  }

  /* Visible but not active items styling */
  .toc-item.visible:not(.active) a {
    @apply text-base14/80;
  }

  /* Hover on active item shows a stronger border */
  .toc-item.active a:hover {
    @apply border-base14/80;
  }

  /* Heading level styles with better hierarchy */
  .toc-item.level-1 {
    @apply mb-1.5;
  }

  .toc-item.level-1 a {
    @apply font-medium text-base6;
  }

  .toc-item.level-1.active a {
    @apply text-base14 font-bold;
  }

  .toc-item.level-1.visible:not(.active) a {
    @apply text-base14/80;
  }

  .toc-item.level-2 {
    @apply pl-3 mb-1;
  }

  .toc-item.level-2 a {
    @apply text-base5;
  }

  .toc-item.level-3 {
    @apply pl-6 mb-1;
  }

  .toc-item.level-3 a {
    @apply text-base5/90 text-xs;
  }

  .toc-item.level-4 {
    @apply pl-9 mb-0.5;
  }

  .toc-item.level-4 a {
    @apply text-base5/80 text-xs;
  }

  .toc-item.level-5,
  .toc-item.level-6 {
    @apply pl-12 mb-0.5;
  }

  .toc-item.level-5 a,
  .toc-item.level-6 a {
    @apply text-base5/70 text-xs;
  }

  /* Text formatting inside TOC items */
  .toc-text {
    @apply block leading-tight;
    @apply overflow-ellipsis overflow-hidden;
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
