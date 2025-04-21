<script>
  import {fade} from 'svelte/transition';
  import {onMount, tick} from 'svelte';
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
  const l10n = data.l10n;

  // State for posts and filtering
  let posts = $state(data.posts);
  let activeTab = $state('All');
  let filteredPosts = $state(data.posts);

  // References to child components for resetting their state
  let tabsComponent = $state(null);
  let tagsComponent = $state(null);

  // Derived properties
  let hasTabs = $derived(posts.some(post => post.meta?.tabs?.length > 0));
  let hasTags = $derived(posts.some(post => post.meta?.tags?.length > 0));
  let shouldDisableReset = $derived(filteredPosts.length === posts.length && activeTab === 'All');

  // Handle tab filtering
  async function handleTabClick(filtered, tab) {
    activeTab = tab;

    // Reset tag selection when changing tabs
    if (tagsComponent && typeof tagsComponent.resetState === 'function') {
      await tagsComponent.resetState();
    }

    // Apply tab filtering
    if (tab === 'All') {
      filteredPosts = [...posts];
    } else {
      filteredPosts = filtered;
    }
  }

  // Handle tag filtering
  function handleTagToggle(filtered) {
    // Filter within current tab selection
    if (activeTab === 'All') {
      filteredPosts = filtered;
    } else {
      // Only show posts that match both the active tab and selected tags
      filteredPosts = filtered.filter(post => post.meta?.tabs?.includes(activeTab));
    }
  }

  // Reset all filters with proper state coordination
  async function resetFilters() {
    // Reset tab state first
    if (tabsComponent && typeof tabsComponent.resetState === 'function') {
      await tabsComponent.resetState('All');
    }

    // Then reset tag selection
    if (tagsComponent && typeof tagsComponent.resetState === 'function') {
      await tagsComponent.resetState();
    }

    // Reset local state
    activeTab = 'All';
    filteredPosts = [...posts];

    // Force visual refresh
    await tick();
  }

  // Helper function to get all tabs
  function getAllTabs() {
    if (!posts.length) return [];
    const uniqueTabs = [...new Set(posts.flatMap(post => post.meta?.tabs || []))];
    return ['All', ...uniqueTabs];
  }

  // Update when posts data changes
  onMount(() => {
    posts = data.posts;
    filteredPosts = [...posts];
  });
</script>

<Metadata
  title="Blog | {appName}"
  description="Insights and tutorials on modern web development"
  canonicalUrl={`${domain}/blog`}
  ogType="website"
/>

<div class="w-full max-w-6xl mx-auto pb-8 sm:pb-16" in:fade={{duration: 300}}>
  <header class="relative bg-gradient-to-r from-base14/5 to-transparent">
    <div class="py-10 max-w-4xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-3">
        <h1 class="text-3xl sm:text-4xl font-bold text-base14 whitespace-nowrap">
          {l10n.t('articles')}
        </h1>
      </div>
      <p class="text-base5 text-lg max-w-2xl">{l10n.t('blogDescription')}</p>
      <div class="h-1 w-16 bg-base14/50 mt-6 rounded-full"></div>
    </div>

    <!-- Tabs section -->
    {#if hasTabs}
      <div class="mt-2 sm:mt-0 max-w-4xl mx-auto px-4 w-full overflow-hidden">
        <Tabs
          bind:this={tabsComponent}
          payload={posts}
          triggerEvent={handleTabClick}
          propPath={['meta', 'tabs']}
          customTabs={getAllTabs()}
        />
      </div>
    {/if}
  </header>

  {#if hasTags}
    <div class="px-4 mb-10">
      <Divider />
      <div class="flex flex-col sm:flex-row items-start justify-between gap-4 mt-5">
        <Tags
          bind:this={tagsComponent}
          payload={activeTab === 'All' ? posts : filteredPosts}
          toggleEvent={handleTagToggle}
          propPath={['meta', 'tags']}
          isTagCount={true}
        />
        <Button
          disabled={shouldDisableReset}
          variant="secondary sm"
          onclick={resetFilters}
          class="text-sm text-base5 hover:text-base14 transition-colors flex items-center gap-1.5 sm:ml-auto mt-2 sm:mt-0 self-center sm:self-end"
        >
          <RotateCcw size={12} class="mr-2" />
          {l10n.t('resetFilters')}
        </Button>
      </div>
    </div>
  {/if}

  {#if filteredPosts.length > 0}
    <div class="mb-6 pb-3 border-b border-base3/10 px-4">
      <p class="text-sm text-base4">
        {filteredPosts.length}
        {filteredPosts.length === 1 ? 'article' : 'articles'}
        {activeTab && activeTab !== 'All' ? `in "${activeTab}"` : ''}
      </p>
    </div>

    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {#each filteredPosts as post, i (post.slug)}
        <Post {post} index={i} {l10n} />
      {/each}
    </ul>
  {:else if posts.length > 0}
    <div
      class="flex flex-col items-center justify-center text-center py-10 gap-4 mx-4 text-base4 bg-base1/30 rounded-xs border border-base3/10"
    >
      <p>{l10n.t('noMatchingPosts')}</p>
      <Button variant="secondary" onclick={resetFilters}>
        {l10n.t('showAllPosts')}
      </Button>
    </div>
  {:else if data.error}
    <NoPosts {l10n} message="There was an error loading blog posts. Please try again later." />
  {:else}
    <NoPosts {l10n} message="No blog posts found yet. Check back soon for new content!" />
  {/if}
</div>
