<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import Tags from '$features/blog/tags/Tags.svelte';
  import Tabs from '$features/blog/tabs/Tabs.svelte';
  import Post from '$features/blog/Post.svelte';
  import NoPosts from '$features/blog/NoPosts.svelte';
  import {Button} from '$components/jera';

  let {data} = $props();
  let activeTab = $state(null);
  const posts = $state(data.posts);
  let filteredPosts = $derived(posts);

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
    <h1>{data.l10n.t('articles')}</h1>
    <p>{data.l10n.t('blogDescription')}</p>
  </header>

  {#if true}
    <div class="filters-container">
      <!-- Tabs for categorization -->
      {#if posts.some(post => post.meta?.tabs?.length)}
        <div class="filter-section">
          <h2 class="filter-title">{data.l10n.t('categories')}</h2>
          <Tabs payload={posts} triggerEvent={handleTabClick} propPath={['meta', 'tabs']} />
        </div>
      {/if}

      <!-- Tags for filtering -->
      {#if posts.some(post => post.meta?.tags?.length)}
        <div class="filter-section">
          <h2 class="filter-title">{data.l10n.t('tags')}</h2>
          <Tags
            payload={posts}
            toggleEvent={handleTagToggle}
            propPath={['meta', 'tags']}
            isTagCount={true}
          />
        </div>
      {/if}

      <!-- Reset filters button when filters are active -->
      {#if activeTab !== null}
        <div class="filter-actions">
          <Button variant="secondary" onclick={resetFilters}>{data.l10n.t('resetFilters')}</Button>
        </div>
      {/if}
    </div>

    {#if filteredPosts.length > 0}
      <ul class="posts-grid">
        {#each filteredPosts as post, i (post.slug)}
          <Post {post} index={i} l10n={data.l10n} />
        {/each}
      </ul>
    {:else}
      <div class="no-results">
        <p>{data.l10n.t('noMatchingPosts')}</p>
        <Button variant="primary" onclick={resetFilters} class="mt-4"
          >{data.l10n.t('showAllPosts')}</Button
        >
      </div>
    {/if}
  {:else if data.error}
    <NoPosts
      l10n={data.l10n}
      message="There was an error loading blog posts. Please try again later."
    />
  {:else}
    <NoPosts l10n={data.l10n} message="No blog posts found yet. Check back soon for new content!" />
  {/if}
</div>

<style lang="postcss">
  @import '../../theme.css' theme(reference);

  .blog-container {
    @apply w-full max-w-6xl mx-auto pb-8 sm:pb-16;

    .blog-header {
      @apply mb-6 sm:mb-8 text-center;
      > h1 {
        @apply text-2xl sm:text-3xl font-bold mb-2 text-base14;
      }
      > p {
        @apply text-base3 text-sm sm:text-base;
      }
    }
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
</style>
