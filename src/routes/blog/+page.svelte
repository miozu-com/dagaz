<script>
  import {fade} from 'svelte/transition';
  import Tags from '$features/blog/tags/Tags.svelte';
  import Tabs from '$features/blog/tabs/Tabs.svelte';
  import Post from '$features/blog/Post.svelte';
  import NoPosts from '$features/blog/NoPosts.svelte';
  import {Button} from '$components/jera';

  // Get data from +page.js
  let {data} = $props();

  // State for active tab and filtered posts
  let activeTab = $state(null);
  let posts = $state(data.posts);
  let filteredPosts = $derived(posts);

  // Debug information
  let hasTabs = $derived(posts.some(post => post.meta?.tabs?.length > 0));
  let hasTags = $derived(posts.some(post => post.meta?.tags?.length > 0));
  let samplePostData = $derived(
    posts.length > 0 ? JSON.stringify(posts[0].meta, null, 2) : 'No posts'
  );

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

  <!-- Debug information - only visible during development -->
  <div class="debug-info">
    <h3>Debug Information</h3>
    <p>Posts count: {posts.length}</p>
    <p>Has posts with tabs: {hasTabs}</p>
    <p>Has posts with tags: {hasTags}</p>
    <details>
      <summary>Sample post metadata</summary>
      <pre>{samplePostData}</pre>
    </details>
  </div>

  <!-- We'll force show the filters containers for debugging -->
  <div class="filters-container">
    <div class="filter-section">
      <h2 class="filter-title">{data.l10n.t('categories')}</h2>
      {#if hasTabs}
        <Tabs payload={posts} triggerEvent={handleTabClick} propPath={['meta', 'tabs']} />
      {:else}
        <p class="debug-message">
          No tabs found in blog posts. Check meta.tabs in your markdown frontmatter.
        </p>
      {/if}
    </div>

    <div class="filter-section">
      <h2 class="filter-title">{data.l10n.t('tags')}</h2>
      {#if hasTags}
        <Tags
          payload={posts}
          toggleEvent={handleTagToggle}
          propPath={['meta', 'tags']}
          isTagCount={true}
        />
      {:else}
        <p class="debug-message">
          No tags found in blog posts. Check meta.tags in your markdown frontmatter.
        </p>
      {/if}
    </div>
  </div>

  {#if filteredPosts.length > 0}
    <ul class="posts-grid">
      {#each filteredPosts as post, i (post.slug)}
        <Post {post} index={i} l10n={data.l10n} />
      {/each}
    </ul>
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

  .debug-info {
    @apply mb-6 p-4 bg-base8/10 border border-base8 rounded-md;
    @apply text-sm;
  }

  .debug-message {
    @apply text-base8 px-3 py-2 bg-base8/10 rounded-md text-sm;
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
