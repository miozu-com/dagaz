<script>
  import {fade} from 'svelte/transition';
  import Tags from '$features/blog/tags/Tags.svelte';
  import Tabs from '$features/blog/tabs/Tabs.svelte';
  import Post from '$features/blog/Post.svelte';
  import NoPosts from '$features/blog/NoPosts.svelte';
  import {Button} from '$components/jera';

  let {data} = $props();
  let isLoading = $state(true);
  let activeTab = $state(null);
  let filteredPosts = $state([]);
  const l10n = data.l10n;

  // Reactivity with runes
  const posts = $derived(data.posts || []);

  // Determine if filters are active
  const hasActiveFilters = $derived(activeTab !== null);

  // Handle when posts data changes
  $effect(() => {
    isLoading = false;
    if (posts.length > 0 && filteredPosts.length === 0) {
      filteredPosts = [...posts];
    }
  });

  // Handle tab filtering - triggered by the Tabs component
  function handleTabClick(filtered, tab) {
    filteredPosts = filtered;
    activeTab = tab;
  }

  // Handle tag filtering - triggered by the Tags component
  function handleTagToggle(filtered) {
    filteredPosts = filtered;
  }

  // Reset all filters
  function resetFilters() {
    filteredPosts = [...posts];
    activeTab = null;
  }
</script>

<div class="blog-container" in:fade={{duration: 300}}>
  <header class="blog-header">
    <h1>{l10n.t('articles')}</h1>
    <p class="blog-description">{l10n.t('blogDescription')}</p>
  </header>

  {#if isLoading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>{l10n.t('loadingArticles')}</p>
    </div>
  {:else if posts.length > 0}
    <div class="filters-container">
      <!-- Tabs for categorization -->
      {#if posts.some(post => post.meta?.tabs?.length)}
        <div class="filter-section">
          <h2 class="filter-title">{l10n.t('categories')}</h2>
          <Tabs payload={posts} triggerEvent={handleTabClick} propPath={['meta', 'tabs']} />
        </div>
      {/if}

      <!-- Tags for filtering -->
      {#if posts.some(post => post.meta?.tags?.length)}
        <div class="filter-section">
          <h2 class="filter-title">{l10n.t('tags')}</h2>
          <Tags
            payload={posts}
            toggleEvent={handleTagToggle}
            propPath={['meta', 'tags']}
            isTagCount={true}
          />
        </div>
      {/if}

      <!-- Reset filters button when filters are active -->
      {#if hasActiveFilters}
        <div class="filter-actions">
          <Button variant="secondary" onclick={resetFilters}>{l10n.t('resetFilters')}</Button>
        </div>
      {/if}
    </div>

    {#if filteredPosts.length > 0}
      <ul class="posts-grid">
        {#each filteredPosts as post, i (post.slug)}
          <Post {post} index={i} {l10n} />
        {/each}
      </ul>
    {:else}
      <div class="no-results">
        <p>{l10n.t('noMatchingPosts')}</p>
        <Button variant="primary" onclick={resetFilters} class="mt-4"
          >{l10n.t('showAllPosts')}</Button
        >
      </div>
    {/if}
  {:else if data.error}
    <NoPosts {l10n} message="There was an error loading blog posts. Please try again later." />
  {:else}
    <NoPosts {l10n} message="No blog posts found yet. Check back soon for new content!" />
  {/if}
</div>

<style lang="postcss">
  @import '../../theme.css' theme(reference);

  .blog-container {
    @apply w-full max-w-6xl mx-auto pb-8 sm:pb-16;
  }

  .blog-header {
    @apply mb-6 sm:mb-8 text-center;
  }

  .blog-header h1 {
    @apply text-2xl sm:text-3xl font-bold mb-2 text-base14;
  }

  .blog-description {
    @apply text-base3 text-sm sm:text-base;
  }

  .loading-state {
    @apply flex flex-col items-center justify-center py-12 sm:py-16 text-base3;
  }

  .loading-spinner {
    @apply h-8 w-8 sm:h-10 sm:w-10 rounded-full border-4 border-base3/20 border-t-base14;
    @apply animate-spin mb-4;
  }

  .filters-container {
    @apply mb-6 sm:mb-10 p-3 sm:p-5 rounded-lg bg-base1/30;
    @apply border border-base3/10;
  }

  .filter-section {
    @apply mb-4 sm:mb-6;
  }

  .filter-section:last-of-type {
    @apply mb-0;
  }

  .filter-title {
    @apply text-base sm:text-lg font-medium mb-2 sm:mb-3 text-base7;
  }

  .filter-actions {
    @apply flex justify-end mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-base3/10;
  }

  .posts-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6;
  }

  .no-results {
    @apply text-center py-10 sm:py-16 text-base3;
  }

  /* Dark mode adjustments */
  :global(.dark) .filters-container {
    @apply bg-base1/20 border-base3/5;
  }
</style>
