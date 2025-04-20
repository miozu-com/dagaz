<script>
  import {fade} from 'svelte/transition';
  import {appName, domain} from '$settings/global';
  import Metadata from '$features/seo/Metadata.svelte';
  import Tags from '$features/blog/tags/Tags.svelte';
  import Tabs from '$features/blog/tabs/Tabs.svelte';
  import Post from '$features/blog/Post.svelte';
  import NoPosts from '$features/blog/NoPosts.svelte';
  import Divider from '$components/Divider.svelte';
  import {RotateCcw} from '$components/icons';
  import {Button} from '$components/jera';

  // Get data from +page.js
  let {data} = $props();

  // State for active tab and filtered posts
  let activeTab = $state('All'); // Default to 'All' tab
  let posts = $state(data.posts);
  let filteredPosts = $state(data.posts);

  // References to child components for resetting their state
  let tabsComponent = $state(null);
  let tagsComponent = $state(null);

  // Check if we have posts with tabs or tags
  let hasTabs = $derived(posts.some(post => post.meta?.tabs?.length > 0));
  let hasTags = $derived(posts.some(post => post.meta?.tags?.length > 0));

  // Add 'All' option to tabs when rendering
  function getAllTabs(posts) {
    if (!posts.length) return [];

    const uniqueTabs = [...new Set(posts.flatMap(post => post.meta?.tabs || []))];
    return ['All', ...uniqueTabs];
  }

  // Handle tab filtering - triggered by the Tabs component
  function handleTabClick(filtered, tab) {
    if (tab === 'All') {
      filteredPosts = [...posts];
    } else {
      filteredPosts = filtered;
    }
    activeTab = tab;
  }

  // Handle tag filtering - triggered by the Tags component
  function handleTagToggle(filtered) {
    filteredPosts = filtered;
  }

  // Reset all filters - simplified and improved
  function resetFilters() {
    // Reset filtered posts to original state
    filteredPosts = [...posts];

    // Reset active tab state
    activeTab = 'All';

    // Signal child components to reset their internal state
    if (tabsComponent) {
      tabsComponent.resetState('All');
    }

    if (tagsComponent) {
      tagsComponent.resetState();
    }
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
      <div class="title-and-tabs">
        <h1 class="main-title">{data.l10n.t('articles')}</h1>
      </div>
      <p class="subtitle">{data.l10n.t('blogDescription')}</p>
      <div class="header-accent"></div>
    </div>
    {#if hasTabs}
      <div class="category-tabs">
        <Tabs
          bind:this={tabsComponent}
          payload={posts}
          triggerEvent={handleTabClick}
          propPath={['meta', 'tabs']}
          customTabs={getAllTabs(posts)}
        />
      </div>
    {/if}
  </header>

  {#if hasTags}
    <div class="tags-container">
      <div class="filter-section">
        <Divider />
        <div class="tags-wrapper">
          <Tags
            bind:this={tagsComponent}
            payload={posts}
            toggleEvent={handleTagToggle}
            propPath={['meta', 'tags']}
            isTagCount={true}
          />
          <Button
            disabled={filteredPosts.length === posts.length && activeTab === 'All'}
            variant="secondary sm"
            onclick={resetFilters}
            class="reset-button"
          >
            <RotateCcw size={12} class="mr-2" />
            {data.l10n.t('resetFilters')}
          </Button>
        </div>
      </div>
    </div>
  {/if}

  {#if filteredPosts.length > 0}
    <div class="results-header">
      <p class="results-count">
        {filteredPosts.length}
        {filteredPosts.length === 1 ? 'article' : 'articles'}
        {activeTab && activeTab !== 'All' ? `in "${activeTab}"` : ''}
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
  @import '$styles/theme.css' theme(reference);

  .blog-container {
    @apply w-full max-w-6xl mx-auto pb-8 sm:pb-16;
  }

  .blog-header {
    @apply relative;
    background: linear-gradient(to right, rgba(255, 153, 130, 0.05), transparent);
  }

  .header-content {
    @apply py-10 max-w-4xl mx-auto px-4;
  }

  .title-and-tabs {
    @apply flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-3;
  }

  .main-title {
    @apply text-3xl sm:text-4xl font-bold text-base14 whitespace-nowrap;
    letter-spacing: -0.02em;
  }

  .category-tabs {
    @apply mt-2 sm:mt-0 overflow-x-auto max-w-4xl mx-auto;
  }

  .subtitle {
    @apply text-base5 text-lg max-w-2xl;
  }

  .header-accent {
    @apply h-1 w-16 bg-base14/50 mt-6 rounded-full;
  }

  .tags-container {
    @apply mb-8 sm:mb-10;
  }

  .tags-title {
    @apply text-sm font-medium mb-3 text-base4;
    @apply uppercase tracking-wide;
  }

  .tags-wrapper {
    @apply flex flex-wrap items-center gap-4 mt-5;
  }

  .results-header {
    @apply mb-6 pb-3 border-b border-base3/10;
  }

  .results-count {
    @apply text-sm text-base4;
  }

  .reset-button {
    @apply text-sm text-base5 hover:text-base14 transition-colors;
    @apply flex items-center gap-1.5;
  }

  .posts-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .no-results {
    @apply flex flex-col items-center justify-center text-center py-10 gap-4;
    @apply text-base4;
    @apply bg-base1/30 rounded-xs border border-base3/10;
  }
</style>
