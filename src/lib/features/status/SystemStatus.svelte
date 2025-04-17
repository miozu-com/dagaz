<script>
  import {onMount, onDestroy} from 'svelte';
  import {fade, slide} from 'svelte/transition';

  // Import icons
  import {Check, ServerOff} from '$components/icons';

  // Props with defaults
  let {
    showPerformance = true,
    showSW = true,
    showLocale = true,
    showTheme = true,
    showBuild = true,
    compact = false,
    l10n,
    theme
  } = $props();

  // State
  let expanded = $state(false);
  let swStatus = $state('checking');
  let online = $state(navigator.onLine);
  let perf = $state({
    pageLoad: 0,
    domComplete: 0,
    resources: 0,
    firstPaint: 0
  });
  let buildInfo = $state({
    version: '0.0.1-alpha', // Default from package.json
    env: 'production',
    date: new Date().toISOString().split('T')[0]
  });
  let resizeObserver;
  let itemsContainer;
  let statusItems = $state([]);

  // Lifecycle
  onMount(() => {
    // Check online status
    window.addEventListener('online', () => (online = true));
    window.addEventListener('offline', () => (online = false));

    // Check SW status
    checkSwStatus();

    // Measure performance
    measurePerformance();

    // Get build info from meta tags if available
    const versionMeta = document.querySelector('meta[name="app-version"]');
    const envMeta = document.querySelector('meta[name="app-environment"]');
    const buildDateMeta = document.querySelector('meta[name="app-build-date"]');

    if (versionMeta) buildInfo.version = versionMeta.content;
    if (envMeta) buildInfo.env = envMeta.content;
    if (buildDateMeta) buildInfo.date = buildDateMeta.content;

    // Create items array based on props
    updateStatusItems();

    // Set up resize observer for responsive behavior
    if (typeof ResizeObserver !== 'undefined' && itemsContainer) {
      resizeObserver = new ResizeObserver(entries => {
        const width = entries[0].contentRect.width;
        // Auto-compact if width is below 640px
        if (width < 640 && !compact) {
          compact = true;
        } else if (width >= 640 && compact) {
          compact = false;
        }
      });

      resizeObserver.observe(itemsContainer);
    }

    return () => {
      window.removeEventListener('online', () => (online = true));
      window.removeEventListener('offline', () => (online = false));
      if (resizeObserver) resizeObserver.disconnect();
    };
  });

  // Functions
  function updateStatusItems() {
    statusItems = [];

    if (showSW) {
      statusItems.push({
        id: 'sw',
        label: 'Service Worker',
        value: getSWStatusText(),
        icon: swStatus === 'active' ? Check : ServerOff,
        status: swStatus,
        color: getSWStatusColor()
      });
    }

    if (showPerformance) {
      statusItems.push({
        id: 'perf',
        label: 'Page Load',
        value: `${perf.pageLoad}ms`,
        icon: null,
        status: getPerformanceStatus(),
        color: getPerformanceColor()
      });
    }

    if (showLocale && l10n) {
      statusItems.push({
        id: 'locale',
        label: 'Language',
        value: l10n.value.toUpperCase(),
        icon: null,
        status: 'info',
        color: '#83d2fc'
      });
    }

    if (showTheme && theme) {
      statusItems.push({
        id: 'theme',
        label: 'Theme',
        value: theme.isDark ? 'Dark' : 'Light',
        icon: null,
        status: 'info',
        color: theme.isDark ? '#2c3040' : '#f8f9fc'
      });
    }

    if (showBuild) {
      statusItems.push({
        id: 'build',
        label: 'Build',
        value: `v${buildInfo.version} (${buildInfo.env})`,
        icon: null,
        status: 'info',
        color: '#c974e6'
      });
    }
  }

  function checkSwStatus() {
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        swStatus = 'active';
      } else {
        const registered = localStorage.getItem('swRegistered');
        swStatus = registered === 'true' ? 'registered' : 'inactive';
      }
    } else {
      swStatus = 'unsupported';
    }
  }

  function measurePerformance() {
    if (window.performance) {
      // Wait for load to complete
      setTimeout(() => {
        // Check if timing API is available
        if (window.performance.timing) {
          const perfData = window.performance.timing;
          // Page load time (from navigation start to load event end)
          perf.pageLoad = perfData.loadEventEnd - perfData.navigationStart;
          // DOM complete time
          perf.domComplete = perfData.domComplete - perfData.domLoading;
          // Resources time (connection + response time)
          perf.resources = perfData.responseEnd - perfData.requestStart;
        }

        // First paint (using performance timeline API if available)
        if (
          window.performance.getEntriesByType &&
          typeof window.performance.getEntriesByType === 'function'
        ) {
          try {
            const paintMetrics = window.performance.getEntriesByType('paint');
            if (paintMetrics && paintMetrics.length) {
              const firstPaint = paintMetrics.find(
                entry => entry.name === 'first-contentful-paint'
              );
              if (firstPaint) {
                perf.firstPaint = Math.round(firstPaint.startTime);
              }
            }
          } catch (err) {
            console.warn('Error getting paint metrics:', err);
          }
        }

        // Update status items after performance data is collected
        updateStatusItems();
      }, 0);
    }
  }

  function getSWStatusText() {
    if (!online) return 'Offline';

    switch (swStatus) {
      case 'checking':
        return 'Checking...';
      case 'unsupported':
        return 'Not Supported';
      case 'inactive':
        return 'Not Active';
      case 'registered':
        return 'Registered';
      case 'active':
        return 'Active';
      default:
        return 'Unknown';
    }
  }

  function getSWStatusColor() {
    if (!online) return '#ff9837';

    switch (swStatus) {
      case 'checking':
        return '#d0d2db';
      case 'unsupported':
      case 'inactive':
        return '#eb3137';
      case 'registered':
        return '#e8d176';
      case 'active':
        return '#6dd672';
      default:
        return '#d0d2db';
    }
  }

  function getPerformanceStatus() {
    const load = perf.pageLoad;
    if (load === 0) return 'unknown';
    if (load < 1000) return 'excellent';
    if (load < 2500) return 'good';
    if (load < 5000) return 'average';
    return 'slow';
  }

  function getPerformanceColor() {
    const status = getPerformanceStatus();
    switch (status) {
      case 'unknown':
        return '#d0d2db';
      case 'excellent':
        return '#6dd672';
      case 'good':
        return '#83d2fc';
      case 'average':
        return '#e8d176';
      case 'slow':
        return '#eb3137';
      default:
        return '#d0d2db';
    }
  }

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

// src/lib/features/status/SystemStatus.svelte // Fix the performance measurement code

<div class="system-status {compact ? 'compact' : 'full'}" class:expanded>
  <!-- Status Content -->
  {#if expanded}
    <div
      class="status-content"
      in:slide={{duration: 200}}
      out:slide={{duration: 150}}
      bind:this={itemsContainer}
    >
      {#if compact}
        <!-- Compact View -->
        <div class="status-items-compact">
          {#each statusItems as item (item.id)}
            <div
              class="status-indicator"
              title="{item.label}: {item.value}"
              style="--status-color: {item.color}"
            >
              {#if item.icon}
                <svelte:component this={item.icon} size={14} />
              {:else}
                <div class="indicator-dot"></div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <!-- Full View -->
        <div class="status-items">
          {#each statusItems as item (item.id)}
            <div class="status-item" style="--status-color: {item.color}">
              <div class="item-label">{item.label}</div>
              <div class="item-value">
                {#if item.icon}
                  <span class="item-icon">
                    <svelte:component this={item.icon} size={14} />
                  </span>
                {/if}
                <span>{item.value}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if showPerformance && perf.pageLoad > 0}
        <div class="perf-details">
          <div class="perf-label">FP: {perf.firstPaint}ms</div>
          <div class="perf-label">DOM: {perf.domComplete}ms</div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .system-status {
    @apply fixed bottom-0 left-0 right-0 z-40;
    @apply bg-base1/95 dark:bg-base1/95 backdrop-blur-sm;
    @apply border-t border-base3/20 dark:border-base3/10;
    @apply text-xs font-mono;
    @apply transform transition-transform duration-300;
    @apply shadow-md;
  }

  .system-status.expanded {
    @apply shadow-lg;
  }

  .system-status.compact:not(.expanded) {
    @apply transform translate-y-6;
  }

  .status-toggle {
    @apply w-full flex items-center justify-center py-1 px-4;
    @apply text-base3 hover:text-base14 transition-colors;
    @apply cursor-pointer bg-transparent border-none;
  }

  .toggle-icon {
    @apply mr-1 text-xs;
  }

  .status-content {
    @apply p-2 border-t border-base3/10;
  }

  .status-items {
    @apply flex flex-wrap justify-evenly gap-4 items-center;
    @apply px-2 py-1;
  }

  .status-items-compact {
    @apply flex justify-center gap-3 items-center;
    @apply px-2 py-1;
  }

  .status-item {
    @apply flex flex-col items-center;
    @apply px-3 py-1 rounded-sm;
    @apply bg-base2/30 dark:bg-base2/30;
    @apply border-l-2 border-[var(--status-color)];
  }

  .item-label {
    @apply text-base3 mb-1;
  }

  .item-value {
    @apply flex items-center gap-1 text-base5;
  }

  .status-indicator {
    @apply w-8 h-8 rounded-full;
    @apply flex items-center justify-center;
    @apply border-2 border-[var(--status-color)];
    @apply bg-base2/30 dark:bg-base2/30 text-[var(--status-color)];
  }

  .indicator-dot {
    @apply w-3 h-3 rounded-full;
    @apply bg-[var(--status-color)];
  }

  .perf-details {
    @apply flex justify-center gap-4 mt-1 pt-1;
    @apply text-xs text-base3 border-t border-base3/10;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .system-status.full {
      @apply text-xs;
    }

    .status-item {
      @apply px-2;
    }
  }
</style>
