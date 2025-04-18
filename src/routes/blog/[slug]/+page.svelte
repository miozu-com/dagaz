<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import Divider from '$components/Divider.svelte';
  import {Button} from '$components/jera';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import BreadcrumbsSchema from '$features/seo/BreadcrumbsSchema.svelte';
  import {author, domain, appName} from '$lib/settings/global';

  let {data} = $props();
  let isLoading = $state(true);
  let htmlContent = $state('');
  let scrollContainer = $state(null);
  let tableOfContents = $state([]);
  let showToc = $state(false);

  // Get the post from the data
  const post = $derived(data.post || {});

  // Pre-calculated values outside of reactive dependencies
  let formattedDate = '';
  let isoDate = '';
  let modifiedIsoDate = '';
  let postUrl = '';

  // Format date for display
  function formatDate(dateStr) {
    if (!dateStr) return '';

    try {
      const dateParts = dateStr.split('/');
      if (dateParts.length >= 3) {
        const [year, month, dayTime] = dateParts;
        const day = dayTime.split(' ')[0];
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  // Format date for ISO format
  function formatISODate(dateStr) {
    if (!dateStr) return '';

    try {
      const dateParts = dateStr.split('/');
      if (dateParts.length >= 3) {
        const [year, month, dayTime] = dateParts;
        const day = dayTime.split(' ')[0];
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return '';
    } catch (e) {
      return '';
    }
  }

  function extractToc() {
    if (post?.toc?.data && Array.isArray(post.toc.data)) {
      tableOfContents = post.toc.data.filter(item => item.level <= 3);
      showToc = tableOfContents.length > 2;
    }
  }

  function scrollToHeading(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  onMount(() => {
    isLoading = false;

    // Calculate formatted values
    formattedDate = formatDate(post.meta?.created_at);
    isoDate = formatISODate(post.meta?.created_at);
    modifiedIsoDate = post.meta?.modified_at ? formatISODate(post.meta.modified_at) : isoDate;
    postUrl = `${domain}/blog/${post.slug}`;

    if (post?.code) {
      // Process the HTML content - properly clean the strange formatted code
      htmlContent = post.code
        // Remove all placeholder-related markdown
        .replace(/<img[^>]*via\.placeholder\.com[^>]*>/g, '')
        .replace(/!\[.*?\]\([^)]*via\.placeholder\.com[^)]*\)/g, '')
        // Remove function-like code that might appear
        .replace(/\$derived\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*\);?/g, '')
        .replace(/\$effect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*\);?/g, '')
        .replace(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/g, '')
        .replace(/^\(\)\s*=>\s*\{\s*try\s*\{[\s\S]*?\}\s*\}/g, '')
        // Remove script tags for security
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');

      // Extract ToC after content is loaded
      extractToc();

      console.log('Post content loaded:', post.slug);
    } else {
      console.error('Post content not available:', post);
    }
  });
</script>

<svelte:head>
  <title>{post.meta?.title || 'Blog Post'} | Dagaz</title>
  <meta name="description" content={post.meta?.description || ''} />
  {#if post.meta?.canonical_url}
    <link rel="canonical" href={post.meta.canonical_url} />
  {/if}
</svelte:head>

<!-- Add JSON-LD structured data for blog post -->
{#if post && !isLoading}
  <!-- BlogPosting schema -->
  <JsonLd
    type="BlogPosting"
    data={{
      headline: post.meta?.title || 'Untitled Post',
      description: post.meta?.description || '',
      image: post.meta?.ogImage || `${domain}/images/default-blog-image.jpg`,
      datePublished: isoDate,
      dateModified: modifiedIsoDate,
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: appName,
        logo: {
          '@type': 'ImageObject',
          url: `${domain}/icons/icon-192x192.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl
      },
      keywords:
        Array.isArray(post.meta?.keywords) ?
          post.meta.keywords.join(', ')
        : post.meta?.keywords || '',
      articleSection:
        Array.isArray(post.meta?.tabs) ? post.meta.tabs.join(', ') : post.meta?.tabs || ''
    }}
  />

  <!-- Breadcrumb schema -->
  <BreadcrumbsSchema
    items={[
      {name: 'Home', url: domain},
      {name: 'Blog', url: `${domain}/blog`},
      {name: post.meta?.title || 'Untitled Post', url: postUrl}
    ]}
  />
{/if}

<main in:fade={{duration: 300}} class="post-container">
  {#if isLoading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading post...</p>
    </div>
  {:else if post?.code}
    <div class="post-grid">
      {#if showToc}
        <aside class="post-toc">
          <div class="toc-container">
            <h2 class="toc-title">Table of Contents</h2>
            <nav class="toc-nav">
              <ul class="toc-list">
                {#each tableOfContents as heading}
                  <li class="toc-item level-{heading.level}">
                    <a
                      href="#{heading.id}"
                      on:click|preventDefault={() => scrollToHeading(heading.id)}
                    >
                      {heading.text}
                    </a>
                  </li>
                {/each}
              </ul>
            </nav>
          </div>
        </aside>
      {/if}

      <article class="post-content">
        <header class="post-header">
          <div class="post-meta">
            <span class="author">{author}</span>
            <time datetime={post.meta?.created_at || ''}>{formattedDate}</time>

            {#if post.meta?.readMin}
              <span class="read-time">{post.meta.readMin} min read</span>
            {/if}
          </div>

          <h1 class="post-title">{post.meta?.title || 'Untitled Post'}</h1>

          {#if post.meta?.description}
            <p class="post-description">{post.meta.description}</p>
          {/if}

          {#if post.meta?.tags?.length}
            <div class="post-tags">
              {#each post.meta.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          {/if}
        </header>

        <Divider />

        <div class="post-body" bind:this={scrollContainer}>
          <!-- This is where the compiled markdown content is rendered -->
          {@html htmlContent}
        </div>

        <footer class="post-footer">
          <Divider />
          <div class="post-actions">
            <Button variant="primary" onclick={() => window.history.back()}>Back to posts</Button>
          </div>
        </footer>
      </article>
    </div>
  {:else}
    <div class="error-state">
      <h2>Post Not Found</h2>
      <p>Sorry, the post you're looking for couldn't be loaded.</p>
      <Button variant="primary" onclick={() => (window.location.href = '/blog')}>
        Return to blog
      </Button>
    </div>
  {/if}
</main>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .post-container {
    @apply w-full max-w-6xl mx-auto my-8 sm:my-12;
  }

  .post-grid {
    @apply flex gap-6 sm:gap-10;
  }

  .post-content {
    @apply flex-1 bg-base0/50 rounded-lg overflow-hidden;
    @apply shadow-sm max-w-3xl mx-auto;
  }

  .post-toc {
    @apply hidden lg:block w-64 flex-shrink-0;
    align-self: start;
    position: sticky;
    top: 100px;
  }

  .toc-container {
    @apply p-6 bg-base1/30 rounded-lg;
    @apply border border-base3/10;
  }

  .toc-title {
    @apply text-base14 text-lg font-semibold mb-4;
    @apply border-b border-base3/20 pb-2;
  }

  .toc-list {
    @apply space-y-2;
  }

  .toc-item {
    @apply text-base5 hover:text-base14 transition-colors;
    @apply text-sm;
  }

  .toc-item a {
    @apply block py-1 no-underline;
  }

  .toc-item.level-1 {
    @apply font-semibold;
  }

  .toc-item.level-2 {
    @apply pl-3;
  }

  .toc-item.level-3 {
    @apply pl-6 text-base4;
  }

  .post-header {
    @apply px-0.5 md:px-5 lg:px-8 pt-8 sm:pt-12 pb-4 sm:pb-6;
  }

  .post-meta {
    @apply flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm;
    .author {
      @apply font-medium text-base14/90 bg-base14/10 px-3 py-1 rounded-full;
    }
    time {
      @apply text-base4 px-3 py-1 ml-auto;
    }
    .read-time {
      @apply text-base4 px-2.5 py-1.5;
    }
  }

  .post-title {
    @apply text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-base14;
    @apply tracking-tight leading-tight;
  }

  .post-description {
    @apply text-lg sm:text-xl text-base5 mb-4 sm:mb-6;
    @apply leading-relaxed;
  }

  .post-tags {
    @apply flex flex-wrap gap-2 mb-4;
  }

  .tag {
    @apply text-xs font-medium bg-base1/70 px-3 py-1.5 rounded-md text-base6;
    @apply hover:bg-base1 transition-colors;
  }

  .post-body {
    @apply px-0.5 md:px-5 lg:px-8 py-6 sm:py-8;
    @apply font-serif;

    /* Better scrolling */
    scrollbar-gutter: stable;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      @apply w-2;
    }
    &::-webkit-scrollbar-track {
      @apply bg-base1/30 rounded-full;
    }
    &::-webkit-scrollbar-thumb {
      @apply bg-base4/40 rounded-full hover:bg-base4/60 transition-colors;
    }
  }

  .post-footer {
    @apply px-4 sm:px-6 lg:px-8 py-6 sm:py-8;
  }

  .post-actions {
    @apply flex justify-between items-center mt-4 sm:mt-6;
  }

  .loading-state,
  .error-state {
    @apply flex flex-col items-center justify-center py-12 sm:py-16 text-base3;
  }

  .loading-spinner {
    @apply h-8 w-8 sm:h-10 sm:w-10 rounded-full border-4 border-base3/20 border-t-base14;
    @apply animate-spin mb-4;
  }

  @media (max-width: 640px) {
    .post-title {
      @apply text-2xl;
    }
  }
</style>
