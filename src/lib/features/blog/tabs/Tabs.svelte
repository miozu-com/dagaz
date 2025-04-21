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
  async function updateIndicator(activeTab) {
    await tick();
    if (!indicator || !tabsContainer) return;

    const activeElement = tabsContainer.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!activeElement) return;

    const {offsetLeft, offsetWidth} = activeElement;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${offsetWidth}px`;
  }

  // Create new tabs state with selected tab active
  function updateTabs(selectedTabName) {
    selectedTab = selectedTabName;

    // Create a new object to ensure reactivity
    const newState = {};
    keys(tabs).forEach(key => {
      newState[key] = key === selectedTabName;
    });
    tabs = newState;
  }

  // Filter payload based on active tab
  function filterPayload(selectedTabName) {
    // If 'All' tab or no active tab, return all items
    if (selectedTabName === 'All') return payload;

    // Filter items that contain the selected tab
    return filter(item => {
      const itemTags = path(propPath, item);
      return isValidArray(itemTags) && itemTags.includes(selectedTabName);
    }, payload);
  }

  // Handle tab selection
  async function selectTab(tab) {
    // Update visual and state
    updateTabs(tab);
    await tick();
    updateIndicator(tab);

    // Filter items and notify parent
    const filteredItems = filterPayload(tab);
    triggerEvent(filteredItems, tab);

    // Ensure the selected tab is visible
    if (tabsContainer) {
      const tabElement = tabsContainer.querySelector(`[data-tab-id="${tab}"]`);
      if (tabElement) {
        scrollTabIntoView(tabElement);
      }
    }
  }

  // Reset tab state - public method called by parent
  async function resetState(defaultTab = 'All') {
    // Select the default tab (usually 'All')
    const tabToSelect = keys(tabs).includes(defaultTab) ? defaultTab : keys(tabs)[0];

    // Update visual and state
    updateTabs(tabToSelect);
    await tick();
    updateIndicator(tabToSelect);

    // Filter items and notify parent
    const filteredItems = filterPayload(tabToSelect);
    triggerEvent(filteredItems, tabToSelect);

    // Scroll back to start
    if (tabsWrapper) {
      tabsWrapper.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  // Check if scroll arrows should be shown
  function checkScrollPosition() {
    if (!tabsWrapper) return;

    const {scrollLeft, scrollWidth, clientWidth} = tabsWrapper;
    showLeftArrow = scrollLeft > 5;
    showRightArrow = scrollLeft < scrollWidth - clientWidth - 5;
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

    setTimeout(() => {
      isScrolling = false;
      checkScrollPosition();
    }, 300);
  }

  // Scroll specific tab into view
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

  onMount(async () => {
    // Find the initially selected tab
    const activeTab = keys(tabs).find(key => tabs[key]) || keys(tabs)[0];

    if (activeTab) {
      // Make sure initial selectedTab state is set
      selectedTab = activeTab;

      await tick();
      updateIndicator(activeTab);
    }

    // Check initial scroll status
    checkScrollPosition();

    // Set up resize observer
    if (typeof ResizeObserver !== 'undefined' && tabsWrapper) {
      const resizeObserver = new ResizeObserver(() => {
        checkScrollPosition();
        updateIndicator(selectedTab);
      });

      resizeObserver.observe(tabsWrapper);

      return () => {
        resizeObserver.disconnect();
      };
    }
  });
</script>

<div class="relative flex items-center w-full">
  <!-- Left scroll arrow -->
  {#if showLeftArrow}
    <button
      class="flex items-center justify-center w-8 md:w-8 h-8 md:h-8 bg-base1/80 rounded-full flex-shrink-0 text-base6 border border-base3/20 hover:bg-base1 hover:text-base14 transition-colors z-10 opacity-90 shadow-sm mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={scrollLeft}
      aria-label="Scroll tabs left"
      disabled={isScrolling}
    >
      <ChevronLeft size={16} />
    </button>
  {/if}

  <!-- Tabs wrapper with horizontal scroll -->
  <div
    class="flex-1 overflow-x-auto overflow-y-hidden relative scroll-smooth scrollbar-none"
    bind:this={tabsWrapper}
    onscroll={checkScrollPosition}
  >
    <div class="flex flex-nowrap relative py-1 px-0.5 min-w-min" bind:this={tabsContainer}>
      {#each keys(tabs) as tab (tab)}
        <Tab onclick={() => selectTab(tab)} label={tab} selected={tabs[tab]} />
      {/each}
      {#if children}
        {@render children()}
      {/if}
      <div
        class="absolute bottom-0 h-[2px] bg-base14 transition-all duration-300 ease-in-out opacity-100"
        bind:this={indicator}
      ></div>
    </div>
  </div>

  <!-- Right scroll arrow -->
  {#if showRightArrow}
    <button
      class="flex items-center justify-center w-8 md:w-8 h-8 md:h-8 bg-base1/80 rounded-full flex-shrink-0 text-base6 border border-base3/20 hover:bg-base1 hover:text-base14 transition-colors z-10 opacity-90 shadow-sm ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={scrollRight}
      aria-label="Scroll tabs right"
      disabled={isScrolling}
    >
      <ChevronRight size={16} />
    </button>
  {/if}
</div>

<style>
</style>
