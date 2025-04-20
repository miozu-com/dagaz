<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import Divider from '$components/Divider.svelte';
  import {Button} from '$components/jera';
  import SkeletonLoader from '$components/SkeletonLoader.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import BreadcrumbsSchema from '$features/seo/BreadcrumbsSchema.svelte';
  import BlogPostFooter from '$features/blog/BlogPostFooter.svelte';
  import TableOfContents from '$features/blog/TableOfContents.svelte';
  import {author, domain, appName} from '$lib/settings/global';

  let {data} = $props();
  let htmlContent = $state('');
  let scrollContainer = $state(null);
  let tableOfContents = $state([]);
  let isLoading = $state(true);

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
    }
  }

  onMount(() => {
    // Calculate formatted values
    formattedDate = formatDate(post.meta?.created_at);
    isoDate = formatISODate(post.meta?.created_at);
    modifiedIsoDate = post.meta?.modified_at ? formatISODate(post.meta.modified_at) : isoDate;
    postUrl = `${domain}/blog/${post.slug}`;

    if (post?.code) {
      // Set HTML content with no processing
      htmlContent = post.code;

      // Extract ToC after content is loaded
      extractToc();

      // Use a short delay to simulate content loading
      // This ensures proper rendering of skeleton loaders
      setTimeout(() => {
        isLoading = false;
      }, 300);

      console.log('Post content loaded:', post.slug);
    } else {
      console.error('Post content not available:', post);
      isLoading = false;
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
{#if post}
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
  <!-- Table of Contents Component - now floating on right side -->
  <TableOfContents headings={tableOfContents} {isLoading} />

  {#if isLoading || post?.code}
    <div class="post-grid">
      <article class="post-content">
        <header class="post-header">
          <div class="post-meta">
            <span class="author">{author}</span>
            <time datetime={post.meta?.created_at || ''}>{formattedDate}</time>

            {#if post.meta?.readMin}
              <span class="read-time">{post.meta.readMin} min read</span>
            {/if}
          </div>

          <h1 class="post-title" id="post-title">{post.meta?.title || 'Untitled Post'}</h1>

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
          {#if isLoading}
            <!-- Post content skeleton -->
            <SkeletonLoader type="content" lines={20} class="content-skeleton" />
          {:else}
            <!-- This is where the compiled markdown content is rendered -->
            {@html htmlContent}
          {/if}
        </div>

        <footer class="post-footer">
          <Divider />
          <!-- Enhanced blog post footer -->
          <BlogPostFooter
            title={post.meta?.title || ''}
            slug={post.slug}
            tags={post.meta?.tags || []}
            url={postUrl}
            publishDate={post.meta?.created_at}
            readTime={post.meta?.readMin}
            nextPost={post.nextPost}
            previousPost={post.previousPost}
          />
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
    min-height: 400px; /* Prevent layout shift while loading */

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

  .error-state {
    @apply flex flex-col items-center justify-center py-16 text-center;
    @apply bg-base1/30 rounded-lg max-w-md mx-auto;
    @apply border border-base3/10 p-8;
  }

  /* Skeleton loader styles */
  .content-skeleton {
    @apply min-h-[400px];
  }

  @media (max-width: 640px) {
    .post-title {
      @apply text-2xl;
    }
  }
</style>
