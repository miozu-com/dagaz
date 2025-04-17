<script>
  import {any, includes, filter, path, prop, pipe, tap, curry} from 'ramda';
  import {assoc, keys, reduce, map, fromPairs} from 'ramda';
  import {toUniqArr, filterArrByString} from '$utils';

  import Tab from './Tab.svelte';

  let {payload, children, propPath = [], triggerEvent = () => {}} = $props();
  let tabsContainer, indicator;

  // Initialize tabs with all values set to false
  let tabs = $state(
    pipe(
      toUniqArr,
      reduce((acc, tab) => assoc(tab, false, acc), {})
    )(propPath, payload)
  );

  // Create new tabs state with selected tab active
  const createTabsState = curry((selectedTab, currentTabs) =>
    pipe(
      keys,
      map(key => [key, key === selectedTab]),
      fromPairs
    )(currentTabs)
  );

  // Update tabs state and trigger reactivity
  const updateTabs = selectedTab => {
    const newState = createTabsState(selectedTab)(tabs);
    Object.assign(tabs, newState);
  };

  // Filter payload based on active tab
  const filterPayload = curry((paths, selectedTab, data) => {
    // Get the active tab value from tabs state
    const isTabActive = prop(selectedTab, tabs);

    if (!isTabActive) return data;

    return pipe(
      // Filter items where propPath (e.g., meta.tabs) includes the selected tab
      filter(item =>
        pipe(
          path(paths),
          Array.isArray,
          isArray => isArray && includes(selectedTab, path(paths, item))
        )(item)
      )
    )(data);
  });

  // Update visual indicator position
  const updateIndicator = activeTab => {
    if (!indicator || !tabsContainer) return;
    const activeElement = tabsContainer.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!activeElement) return;
    const {offsetLeft, offsetWidth} = activeElement;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${offsetWidth}px`;
  };

  const selectTab = tab => {
    updateTabs(tab);
    updateIndicator(tab);
    // Handle tab selection with  filtering
    triggerEvent(filterPayload(propPath, tab)(payload), tab);
  };
</script>

<div class="tabs-w">
  <div class="tabs" bind:this={tabsContainer}>
    {#each keys(tabs) as tab (tab)}
      <Tab onclick={() => selectTab(tab)} label={tab} />
    {/each}
    {#if children}
      {@render children()}
    {/if}
    <div class="sliding-indicator" bind:this={indicator}></div>
  </div>
</div>

<style lang="postcss">
  @import '../../../../theme.css' theme(reference);
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

  :global(.dark) .sliding-indicator {
    @apply bg-base14;
  }
</style>
