<script>
  import {onMount} from 'svelte';
  import Button from './jera/Button.svelte';
  import {Star} from './icons';

  let {
    repo = 'miozu-com/dagaz', // Default repository path (username/repo)
    class: className = '',
    variant = 'secondary',
    size = 'md',
    showCount = true,
    cacheTime = 3600, // Cache time in seconds (1 hour)
    buttonText = 'GitHub'
  } = $props();

  let stars = $state(0);
  let isLoading = $state(true);
  let error = $state(null);

  // Format stars count (e.g., 1000 -> 1k)
  function formatStars(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  }

  // Try to get stars from cache first, then fetch if needed
  async function fetchStars() {
    isLoading = true;
    error = null;

    try {
      // Check if we have cached data
      const cacheKey = `github-stars-${repo}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const {value, timestamp} = JSON.parse(cached);
        const now = Date.now();

        // Use cache if it's still valid
        if (now - timestamp < cacheTime * 1000) {
          stars = formatStars(value);
          isLoading = false;
          return;
        }
      }

      // Fetch from GitHub API if cache is invalid or missing
      const response = await fetch(`https://api.github.com/repos/${repo}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      const starCount = data.stargazers_count;

      // Save to cache
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          value: starCount,
          timestamp: Date.now()
        })
      );

      stars = formatStars(starCount);
    } catch (err) {
      console.error('Error fetching GitHub stars:', err);
      error = err.message;
      stars = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchStars();
  });
</script>

<Button {variant} {size} href={`https://github.com/${repo}`} class={className}>
  {buttonText}
  {#if showCount}
    <span class="star-count">
      {#if isLoading}
        <span class="loading-wrapper">
          <Star size={14} strokeWidth={1.5} class="star-icon pulse" />
        </span>
      {:else if error}
        <Star size={14} strokeWidth={1.5} class="star-icon error" />
      {:else}
        <span>
          <Star size={14} strokeWidth={1.5} class="star-icon" />
          {stars}
        </span>
      {/if}
    </span>
  {/if}
</Button>

<style lang="postcss">
  @import '../../theme.css' theme(reference);

  .star-count {
    @apply inline-flex items-center whitespace-nowrap ml-2;
    @apply text-base5/90;
  }

  .star-icon {
    @apply inline-block mr-1 translate-y-[-1px];
  }

  .loading-wrapper {
    @apply flex items-center;
  }

  .pulse {
    @apply opacity-60;
    animation: pulse 1.5s infinite;
  }

  .error {
    @apply text-base8/80;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
</style>
