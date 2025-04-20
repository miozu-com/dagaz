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
  import Tab from './Tab.svelte';
  import {toUniqArr, filterArrByString} from '$utils';

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

  // Update visual indicator position
  let tabsContainer, indicator;

  const updateIndicator = activeTab => {
    if (!indicator || !tabsContainer) return;
    const activeElement = tabsContainer.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!activeElement) return;
    const {offsetLeft, offsetWidth} = activeElement;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${offsetWidth}px`;
  };

  // Create new tabs state with selected tab active
  const updateTabs = selectedTab => {
    const newState = {};
    keys(tabs).forEach(key => {
      newState[key] = key === selectedTab;
    });
    Object.assign(tabs, newState);
  };

  // Filter payload based on active tab
  const filterPayload = selectedTab => {
    // Get the active tab value from tabs state
    const isTabActive = tabs[selectedTab];

    if (!isTabActive || selectedTab === 'All') return payload;

    return filter(item => {
      const itemTags = path(propPath, item);
      return isValidArray(itemTags) && itemTags.includes(selectedTab);
    }, payload);
  };

  const selectTab = tab => {
    updateTabs(tab);
    updateIndicator(tab);
    // Handle tab selection with filtering
    triggerEvent(filterPayload(tab), tab);
  };

  // Initialize the active tab on mount
  $effect(() => {
    // Find the initially selected tab (or the first one)
    const activeTab = keys(tabs).find(key => tabs[key]) || keys(tabs)[0];
    if (activeTab) {
      updateIndicator(activeTab);
    }
  });
</script>

<div class="tabs-w">
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

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);
  .tabs-w {
    @apply relative;
  }
  .tabs {
    @apply flex flex-wrap gap-2 relative;
  }
  .sliding-indicator {
    @apply absolute bottom-0 h-[2px] bg-base7;
    @apply transition-all duration-300 ease-in-out;
  }

  /* Show indicator when there's an active tab */
  :global(.tab.selected) ~ .sliding-indicator {
    @apply opacity-100;
  }
</style>
