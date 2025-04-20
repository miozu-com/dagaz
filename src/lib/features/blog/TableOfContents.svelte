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

    // First try exact ID match
    let element = document.getElementById(id);

    // If no exact match, try to find by text content
    if (!element) {
      const headingData = headings.find(h => h.id === id);
      if (headingData) {
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        for (const heading of allHeadings) {
          if (heading.textContent.trim() === headingData.text) {
            element = heading;

            // Dynamically add ID if missing to help with future navigation
            if (!heading.id) {
              heading.id = id;
            }
            break;
          }
        }
      }
    }

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

    // Map of heading text to TOC ids
    const headingTextToId = {};
    headings.forEach(h => {
      headingTextToId[h.text] = h.id;
    });

    // Query all headings in the document
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (!headingElements.length) return;

    // Create the main visibility observer
    const visibilityObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const element = entry.target;
          // Find TOC ID either directly from element ID or by matching text content
          let id = element.id;

          if (!id || !headings.some(h => h.id === id)) {
            id = headingTextToId[element.textContent.trim()];
          }

          if (!id) return; // Skip if we can't find a matching TOC entry

          if (entry.isIntersecting) {
            if (!visibleHeadingIds.includes(id)) {
              visibleHeadingIds = [...visibleHeadingIds, id];
            }
          } else {
            visibleHeadingIds = visibleHeadingIds.filter(visibleId => visibleId !== id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-5% 0px -5% 0px',
        threshold: 0.01
      }
    );

    // Active heading observer
    const activeObserver = new IntersectionObserver(
      entries => {
        if (manuallySelected) return;

        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          const element = visibleEntries[0].target;
          let id = element.id;

          // If no ID or ID not in our TOC, try matching by text
          if (!id || !headings.some(h => h.id === id)) {
            id = headingTextToId[element.textContent.trim()];
          }

          if (id) {
            activeHeadingId = id;
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -75% 0px',
        threshold: [0.1, 0.5]
      }
    );

    observers.push(visibilityObserver, activeObserver);

    // Observe all heading elements
    headingElements.forEach(element => {
      // Only observe headings that match our TOC entries
      if (element.id && headings.some(h => h.id === element.id)) {
        visibilityObserver.observe(element);
        activeObserver.observe(element);
      } else {
        // Try to match by text content
        const text = element.textContent.trim();
        if (headingTextToId[text]) {
          // Add ID to element if it's missing
          if (!element.id) {
            element.id = headingTextToId[text];
          }
          visibilityObserver.observe(element);
          activeObserver.observe(element);
        }
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
      setTimeout(setupObservers, 200);
    }

    // Listen for scroll for back-to-top button
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleScroll();
    handleResize();

    // Refresh observers periodically to catch dynamic content changes
    const refreshInterval = setInterval(() => {
      if (!isLoading && headings.length > 0) {
        setupObservers();
      }
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearInterval(refreshInterval);
      observers.forEach(observer => observer.disconnect());
    };
  });

  onDestroy(() => {
    observers.forEach(observer => observer.disconnect());
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
    @apply p-6 bg-base1/80 backdrop-blur-sm rounded-xs;
    @apply border border-base3/15;
    @apply shadow-sm hover:shadow-md transition-shadow duration-300;
    @apply overflow-y-auto max-h-[calc(100vh-240px)];
  }

  .toc-title {
    @apply text-base14 text-lg font-semibold mb-4;
    @apply border-b border-base3/20 pb-2;
  }

  .toc-list {
    @apply space-y-2 mb-4;
  }

  .toc-item {
    @apply text-base5 transition-colors;
    @apply text-sm;
  }

  .toc-item a {
    @apply block py-1 no-underline;
    @apply border-l-2 border-transparent pl-2;
    @apply transition-all duration-200;
  }

  .toc-item a:hover {
    @apply text-base14 border-base14/30;
  }

  .toc-item.active a {
    @apply text-base14 border-base14 font-medium;
  }

  .toc-item.visible:not(.active) a {
    @apply text-base14/80;
  }

  /* Heading level styles with better hierarchy */
  .toc-item.level-1 {
    @apply mb-1.5;
  }

  .toc-item.level-1 a {
    @apply font-medium text-base6;
  }

  .toc-item.level-1.active a {
    @apply text-base14 font-bold border-base14;
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

  .toc-item.level-2.active a {
    @apply text-base14 border-base14;
  }

  .toc-item.level-3 {
    @apply pl-6 mb-1;
  }

  .toc-item.level-3 a {
    @apply text-base5/90 text-xs;
  }

  .toc-item.level-3.active a {
    @apply text-base14 border-base14;
  }

  .toc-item.level-4 {
    @apply pl-9 mb-0.5;
  }

  .toc-item.level-4 a {
    @apply text-base5/80 text-xs;
  }

  .toc-item.level-4.active a {
    @apply text-base14 border-base14;
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
    @apply bg-base1/70 hover:bg-base1 text-base5 hover:text-base14 rounded-xs;
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
