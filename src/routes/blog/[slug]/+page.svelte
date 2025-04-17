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
      // Fix: Safely handle keywords whether it's an array or not
      keywords:
        Array.isArray(post.meta?.keywords) ?
          post.meta.keywords.join(', ')
        : post.meta?.keywords || '',
      // Fix: Safely handle tabs whether it's an array or not
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

    <!-- Static footer at the bottom of the page, not part of the layout -->
    <div class="page-footer">
      <Divider />
      <div class="footer-content">
        <div class="footer-left">
          © {new Date().getFullYear()}
          {author}
        </div>
        <div class="footer-right">Built with Dagaz · All rights reserved</div>
      </div>
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
    @apply w-full max-w-4xl mx-auto my-8 px-4;
  }

  .post-content {
    @apply bg-base0/50 rounded-md overflow-hidden;
    @apply shadow-sm;
  }

  .post-header {
    @apply px-8 pt-8 pb-4;
  }

  .post-meta {
    @apply flex flex-wrap items-center gap-4 mb-4 text-sm text-base3;
  }

  .author {
    @apply font-medium text-base4;
  }

  .read-time {
    @apply text-base4/80;
  }

  .post-title {
    @apply text-3xl font-bold mb-4 text-base14 tracking-wide;
    @apply dark:text-base14;
  }

  .post-description {
    @apply text-lg text-base3 mb-6;
  }

  .post-tags {
    @apply flex flex-wrap gap-2 mb-2;
  }

  .tag {
    @apply text-xs bg-base1 px-3 py-1 rounded-full text-base3;
  }

  .post-body {
    @apply px-8 py-6;

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

    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4) {
      @apply text-base14 dark:text-base14 font-bold my-4;
    }

    :global(h1) {
      @apply text-2xl mt-8 mb-4;
    }

    :global(h2) {
      @apply text-xl mt-6 mb-3;
    }

    :global(h3) {
      @apply text-lg mt-5 mb-2;
    }

    :global(a) {
      @apply text-base14 underline hover:text-base13 transition-colors;
    }

    :global(blockquote) {
      @apply border-l-4 border-base14/30 bg-base1/50 px-4 py-2 my-4;
    }

    :global(pre) {
      @apply bg-base1 p-4 overflow-x-auto my-4;
    }

    :global(code) {
      @apply font-mono text-base12;
    }

    :global(p) {
      @apply my-4 text-base6 dark:text-base7;
    }

    :global(ul),
    :global(ol) {
      @apply my-4 ml-6;
    }

    :global(li) {
      @apply my-2;
    }

    :global(table) {
      @apply w-full border-collapse my-4;
    }

    :global(th),
    :global(td) {
      @apply border border-base3/20 p-2;
    }

    :global(th) {
      @apply bg-base1;
    }

    :global(img) {
      @apply max-w-full shadow-sm my-4;
    }
  }

  .post-footer {
    @apply px-8 py-6;
  }

  .post-actions {
    @apply flex justify-between items-center mt-6;
  }

  .loading-state,
  .error-state {
    @apply flex flex-col items-center justify-center py-16 text-base3;
  }

  .loading-spinner {
    @apply h-10 w-10 rounded-full border-4 border-base3/20 border-t-base14;
    @apply animate-spin mb-4;
  }

  /* Footer styles (fixed at the bottom of the page) */
  .page-footer {
    @apply mt-16 mb-8;
  }

  .footer-content {
    @apply max-w-4xl mx-auto px-4 py-4;
    @apply flex justify-between items-center text-sm text-base3;
    @apply bg-base0 dark:bg-base0;
  }

  @media (max-width: 640px) {
    .footer-content {
      @apply flex-col gap-1 py-3;
    }
  }

  /* Dark mode adjustments */
  :global(.dark) .post-content {
    @apply bg-base1/50;
  }
</style>
