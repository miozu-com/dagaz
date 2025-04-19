<script>
  import {fade} from 'svelte/transition';
  import Tags from '$features/blog/tags/Tags.svelte';
  import Tabs from '$features/blog/tabs/Tabs.svelte';
  import Post from '$features/blog/Post.svelte';
  import NoPosts from '$features/blog/NoPosts.svelte';
  import {Button} from '$components/jera';
  import Metadata from '$features/seo/Metadata.svelte';
  import {appName, domain} from '$settings/global';

  // Get data from +page.js
  let {data} = $props();

  // State for active tab and filtered posts
  let activeTab = $state(null);
  let posts = $state(data.posts);
  let filteredPosts = $state(data.posts);

  // Check if we have posts with tabs or tags
  let hasTabs = $derived(posts.some(post => post.meta?.tabs?.length > 0));
  let hasTags = $derived(posts.some(post => post.meta?.tags?.length > 0));

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

<Metadata
  title="Blog | {appName}"
  description="Insights and tutorials on modern web development"
  canonicalUrl={`${domain}/blog`}
  ogType="website"
/>

<div class="blog-container" in:fade={{duration: 300}}>
  <header class="blog-header">
    <h1>{data.l10n.t('articles')}</h1>
    <p>{data.l10n.t('blogDescription')}</p>
  </header>

  {#if hasTabs || hasTags}
    <div class="filters-container">
      {#if hasTabs}
        <div class="filter-section">
          <h2 class="filter-title">{data.l10n.t('categories')}</h2>
          <Tabs payload={posts} triggerEvent={handleTabClick} propPath={['meta', 'tabs']} />
        </div>
      {/if}

      {#if hasTags}
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

      {#if activeTab || filteredPosts.length !== posts.length}
        <div class="filter-actions">
          <Button variant="secondary sm" onclick={resetFilters}>
            {data.l10n.t('resetFilters')}
          </Button>
        </div>
      {/if}
    </div>
  {/if}

  {#if filteredPosts.length > 0}
    <ul class="posts-grid">
      {#each filteredPosts as post, i (post.slug)}
        <Post {post} index={i} l10n={data.l10n} />
      {/each}
    </ul>
  {:else if posts.length > 0}
    <div class="no-results">
      <p>{data.l10n.t('noMatchingPosts')}</p>
      <Button variant="secondary" onclick={resetFilters}>
        {data.l10n.t('showAllPosts')}
      </Button>
    </div>
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
  }

  .blog-header {
    @apply mb-6 sm:mb-8 text-center;
  }

  .blog-header h1 {
    @apply text-2xl sm:text-3xl font-bold mb-2 text-base14;
  }

  .blog-header p {
    @apply text-base5 text-sm sm:text-base;
  }

  .filters-container {
    @apply mb-6 sm:mb-10 p-4 sm:p-5 rounded-lg bg-base1/30;
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
    @apply flex flex-col items-center justify-center text-center py-8 sm:py-10 gap-4;
    @apply text-base4;
    @apply bg-base1/30 rounded-lg border border-base3/10;
  }
</style>
