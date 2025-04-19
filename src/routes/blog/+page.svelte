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
    <div class="header-content">
      <h1 class="main-title">{data.l10n.t('articles')}</h1>
      <p class="subtitle">{data.l10n.t('blogDescription')}</p>
      <div class="header-accent"></div>
    </div>
  </header>

  {#if hasTabs || hasTags}
    <div class="filters-container">
      <div class="filters-header">
        <h2 class="filters-title">Browse by</h2>
        {#if activeTab || filteredPosts.length !== posts.length}
          <Button variant="secondary sm" onclick={resetFilters} class="reset-button">
            <span class="reset-icon">↺</span>
            {data.l10n.t('resetFilters')}
          </Button>
        {/if}
      </div>

      <div class="filters-content">
        {#if hasTabs}
          <div class="filter-section">
            <h3 class="section-title">{data.l10n.t('categories')}</h3>
            <Tabs payload={posts} triggerEvent={handleTabClick} propPath={['meta', 'tabs']} />
          </div>
        {/if}

        {#if hasTags}
          <div class="filter-section">
            <h3 class="section-title">{data.l10n.t('tags')}</h3>
            <Tags
              payload={posts}
              toggleEvent={handleTagToggle}
              propPath={['meta', 'tags']}
              isTagCount={true}
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if filteredPosts.length > 0}
    <div class="results-header">
      <p class="results-count">
        {filteredPosts.length}
        {filteredPosts.length === 1 ? 'article' : 'articles'}
        {activeTab ? `in "${activeTab}"` : ''}
      </p>
    </div>

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
    @apply py-10 mb-10 relative text-center;
    background: linear-gradient(to right, rgba(255, 153, 130, 0.05), transparent);
  }

  .header-content {
    @apply max-w-4xl mx-auto px-4;
  }

  .main-title {
    @apply text-3xl sm:text-4xl font-bold mb-3 text-base14;
    letter-spacing: -0.02em;
  }

  .subtitle {
    @apply text-base5 text-lg max-w-2xl mx-auto;
  }

  .header-accent {
    @apply h-1 w-16 bg-base14/50 mx-auto mt-6 rounded-full;
  }

  .filters-container {
    @apply mb-8 sm:mb-10 rounded-lg;
    @apply border border-base3/10;
    @apply bg-gradient-to-r from-base1/50 to-base1/20;
    @apply overflow-hidden;
  }

  .filters-header {
    @apply flex justify-between items-center p-5 border-b border-base3/10;
    @apply bg-base1/40;
  }

  .filters-title {
    @apply text-lg font-medium text-base7;
    letter-spacing: 0.01em;
  }

  .reset-button {
    @apply text-sm text-base5 hover:text-base14 transition-colors;
    @apply flex items-center gap-1.5;
  }

  .reset-icon {
    @apply inline-block;
    font-size: 14px;
  }

  .filters-content {
    @apply p-5;
  }

  .filter-section {
    @apply mb-6;
  }

  .filter-section:last-of-type {
    @apply mb-0;
  }

  .section-title {
    @apply text-sm font-medium mb-3 text-base4;
    @apply uppercase tracking-wide;
  }

  .results-header {
    @apply mb-6 pb-3 border-b border-base3/10;
  }

  .results-count {
    @apply text-sm text-base4;
  }

  .posts-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .no-results {
    @apply flex flex-col items-center justify-center text-center py-10 gap-4;
    @apply text-base4;
    @apply bg-base1/30 rounded-lg border border-base3/10;
  }
</style>
