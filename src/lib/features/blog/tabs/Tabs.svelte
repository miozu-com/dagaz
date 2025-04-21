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
  import Tab from './Tab.svelte';
  import {toUniqArr, filterArrByString} from '$utils';
  import {ChevronLeft, ChevronRight} from '$components/icons';

  let {
    payload = [],
    children,
    propPath = [],
    triggerEvent = () => {},
    customTabs = null
  } = $props();

  // Helper function to check if a value is an array and not null/undefined
  const isValidArray = both(
    complement(val => val === null || val === undefined),
    is(Array)
  );

  // Use either custom tabs or extract tabs from payload
  const allTabs = customTabs || toUniqArr(propPath, payload);

  // Initialize tabs with all values set to false (except 'All' if present)
  let tabs = $state(
    reduce(
      (acc, tab) => ({
        ...acc,
        [tab]: tab === 'All' // If 'All' exists, it starts as selected
      }),
      {},
      allTabs
    )
  );

  // DOM refs and state for carousel
  let tabsContainer;
  let tabsWrapper;
  let indicator;
  let showLeftArrow = $state(false);
  let showRightArrow = $state(true);
  let isScrolling = $state(false);
  let selectedTab = $state('All'); // Track the currently selected tab

  // Update visual indicator position
  const updateIndicator = activeTab => {
    if (!indicator || !tabsContainer) return;
    const activeElement = tabsContainer.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!activeElement) return;
    const {offsetLeft, offsetWidth} = activeElement;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${offsetWidth}px`;
  };

  // Create new tabs state with selected tab active
  const updateTabs = selectedTabName => {
    selectedTab = selectedTabName;
    const newState = {};
    keys(tabs).forEach(key => {
      newState[key] = key === selectedTabName;
    });
    tabs = newState;
  };

  // Filter payload based on active tab
  const filterPayload = selectedTabName => {
    // Get the active tab value from tabs state
    const isTabActive = tabs[selectedTabName];

    if (!isTabActive || selectedTabName === 'All') return payload;

    return filter(item => {
      const itemTags = path(propPath, item);
      return isValidArray(itemTags) && itemTags.includes(selectedTabName);
    }, payload);
  };

  const selectTab = tab => {
    updateTabs(tab);
    updateIndicator(tab);
    // Handle tab selection with filtering
    const filteredItems = filterPayload(tab);
    triggerEvent(filteredItems, tab);

    // Ensure the selected tab is visible by scrolling to it
    if (tabsContainer) {
      const tabElement = tabsContainer.querySelector(`[data-tab-id="${tab}"]`);
      if (tabElement) {
        scrollTabIntoView(tabElement);
      }
    }
  };

  // Public method to reset tab state - IMPROVED
  function resetState(defaultTab = 'All') {
    const tabToSelect = keys(tabs).includes(defaultTab) ? defaultTab : keys(tabs)[0];

    // Update selected tab
    selectedTab = tabToSelect;

    // Create a completely new tabs object to ensure reactivity
    const newTabs = {};
    keys(tabs).forEach(key => {
      newTabs[key] = key === tabToSelect;
    });
    tabs = newTabs;

    // Update the visual indicator
    setTimeout(() => updateIndicator(tabToSelect), 50);

    // Trigger the event to update the parent component
    const filteredItems = filterPayload(tabToSelect);
    triggerEvent(filteredItems, tabToSelect);

    // Scroll back to start when resetting
    if (tabsWrapper) {
      tabsWrapper.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  // Handle scroll arrows visibility
  function checkScrollPosition() {
    if (!tabsWrapper) return;

    const {scrollLeft, scrollWidth, clientWidth} = tabsWrapper;
    showLeftArrow = scrollLeft > 5; // Small threshold to account for browsers
    showRightArrow = scrollLeft < scrollWidth - clientWidth - 5; // Small threshold for right edge
  }

  // Scroll to previous tabs
  function scrollLeft() {
    if (!tabsWrapper) return;
    isScrolling = true;

    const scrollAmount = tabsWrapper.clientWidth * 0.8;
    tabsWrapper.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });

    // Wait for scroll to complete
    setTimeout(() => {
      isScrolling = false;
      checkScrollPosition();
    }, 300);
  }

  // Scroll to next tabs
  function scrollRight() {
    if (!tabsWrapper) return;
    isScrolling = true;

    const scrollAmount = tabsWrapper.clientWidth * 0.8;
    tabsWrapper.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });

    // Wait for scroll to complete
    setTimeout(() => {
      isScrolling = false;
      checkScrollPosition();
    }, 300);
  }

  // Scroll specific tab into view (centered if possible)
  function scrollTabIntoView(tabElement) {
    if (!tabsWrapper || !tabElement) return;

    const containerWidth = tabsWrapper.clientWidth;
    const tabLeft = tabElement.offsetLeft;
    const tabWidth = tabElement.offsetWidth;

    // Calculate position to center the tab
    const targetPosition = tabLeft - containerWidth / 2 + tabWidth / 2;

    tabsWrapper.scrollTo({
      left: Math.max(0, targetPosition),
      behavior: 'smooth'
    });

    setTimeout(checkScrollPosition, 300);
  }

  onMount(() => {
    if (tabsContainer && tabsWrapper) {
      // Find the initially selected tab (or the first one)
      const activeTab = keys(tabs).find(key => tabs[key]) || keys(tabs)[0];
      if (activeTab) {
        updateIndicator(activeTab);
        // Make sure initial selectedTab state is set
        selectedTab = activeTab;
      }

      // Check initial scroll status
      setTimeout(checkScrollPosition, 100);

      // Add scroll event listener
      tabsWrapper.addEventListener('scroll', checkScrollPosition);

      // Set up resize observer
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
          checkScrollPosition();

          // Update indicator for the active tab
          const activeTab = keys(tabs).find(key => tabs[key]);
          if (activeTab) updateIndicator(activeTab);
        });

        resizeObserver.observe(tabsWrapper);

        return () => {
          resizeObserver.disconnect();
          tabsWrapper.removeEventListener('scroll', checkScrollPosition);
        };
      }
    }
  });
</script>

<div class="tabs-container">
  <!-- Left scroll arrow -->
  {#if showLeftArrow}
    <button
      class="scroll-arrow left-arrow"
      onclick={scrollLeft}
      aria-label="Scroll tabs left"
      disabled={isScrolling}
    >
      <ChevronLeft size={16} />
    </button>
  {/if}

  <!-- Tabs wrapper with horizontal scroll -->
  <div class="tabs-wrapper" bind:this={tabsWrapper}>
    <div class="tabs" bind:this={tabsContainer}>
      {#each keys(tabs) as tab (tab)}
        <Tab onclick={() => selectTab(tab)} label={tab} selected={tabs[tab]} />
      {/each}
      {#if children}
        {@render children()}
      {/if}
      <div class="sliding-indicator" bind:this={indicator}></div>
    </div>
  </div>

  <!-- Right scroll arrow -->
  {#if showRightArrow}
    <button
      class="scroll-arrow right-arrow"
      onclick={scrollRight}
      aria-label="Scroll tabs right"
      disabled={isScrolling}
    >
      <ChevronRight size={16} />
    </button>
  {/if}
</div>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .tabs-container {
    @apply relative flex items-center;
    width: 100%;
  }

  .tabs-wrapper {
    @apply flex-1 overflow-x-auto overflow-y-hidden relative;
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* Hide scrollbar for Chrome/Safari/Opera */
  .tabs-wrapper::-webkit-scrollbar {
    display: none;
  }

  .tabs {
    @apply flex flex-nowrap relative;
    @apply py-1 px-0.5; /* Add padding to avoid edge clipping */
    min-width: min-content; /* Ensure it expands to contain all tabs */
  }

  .sliding-indicator {
    @apply absolute bottom-0 h-[2px] bg-base14;
    @apply transition-all duration-300 ease-in-out;
  }

  /* Show indicator when there's an active tab */
  :global(.tab.selected) ~ .sliding-indicator {
    @apply opacity-100;
  }

  .scroll-arrow {
    @apply flex items-center justify-center;
    @apply w-8 h-8 bg-base1/80 rounded-full flex-shrink-0;
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

  /* Mobile optimization */
  @media (max-width: 640px) {
    .tabs-container {
      @apply w-full px-1;
    }

    .tabs {
      @apply gap-1;
    }

    .scroll-arrow {
      @apply w-6 h-6;
    }

    :global(.tabs-container .tab) {
      @apply flex-shrink-0 min-w-fit;
      scroll-snap-align: start;
    }

    .tabs-wrapper {
      scroll-snap-type: x mandatory;
    }
  }
</style>
