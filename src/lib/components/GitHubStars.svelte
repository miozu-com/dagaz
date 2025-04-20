<script>
  import {onMount} from 'svelte';
  import Button from '$components/jera/Button.svelte';
  import {Star} from '$components/icons';

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

  // Cache management functions
  function getFromCache(repo) {
    const cacheKey = `github-stars-${repo}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const {value, timestamp} = JSON.parse(cached);
    const now = Date.now();

    return now - timestamp < cacheTime * 1000 ? value : null;
  }

  function saveToCache(repo, value) {
    const cacheKey = `github-stars-${repo}`;
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        value,
        timestamp: Date.now()
      })
    );
  }

  // Fetch GitHub stars data
  async function fetchGitHubStars(repo) {
    try {
      // Check cache first
      const cachedStars = getFromCache(repo);
      if (cachedStars !== null) {
        return cachedStars;
      }

      // Fetch from GitHub API
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      const starCount = data.stargazers_count;

      // Save to cache
      saveToCache(repo, starCount);

      return starCount;
    } catch (err) {
      throw err;
    }
  }

  // Simple digit animation using Svelte's reactive state
  let animationFrame = $state(0);
  let animationActive = $state(false);

  function runLoadingAnimation() {
    if (!animationActive) return;

    animationFrame = (animationFrame + 1) % 10;
    setTimeout(runLoadingAnimation, 100);
  }

  onMount(async () => {
    try {
      animationActive = true;
      runLoadingAnimation();

      stars = await fetchGitHubStars(repo);
    } catch (err) {
      console.error('Error fetching GitHub stars:', err);
      error = err.message;
      stars = null;
    } finally {
      isLoading = false;
      animationActive = false;
    }
  });
</script>

<Button {variant} {size} href={`https://github.com/${repo}`} class={className}>
  {buttonText}
  {#if showCount}
    <div class="star-count">
      <Star size={14} strokeWidth={1.5} />
      <span class="count-container">
        {#if isLoading}
          <span class="slot-digit">{animationFrame}</span>
        {:else}
          <span>{formatStars(stars)}</span>
        {/if}
      </span>
    </div>
  {/if}
</Button>

<style lang="postcss">
  @import '$theme/theme.css' theme(reference);

  .star-count {
    @apply flex items-center gap-0.5 ml-2.5;
    @apply text-base5/90 whitespace-nowrap;
  }

  .count-container {
    @apply inline-flex items-center min-w-[1ch];
  }

  .slot-digit {
    @apply inline-block text-center min-w-[1ch] opacity-70;
    animation: pulse 0.5s infinite alternate;
  }

  @keyframes pulse {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 0.9;
    }
  }
</style>
