<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import Divider from '$components/Divider.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import BreadcrumbsSchema from '$features/seo/BreadcrumbsSchema.svelte';
  import BlogPostFooter from '$features/blog/BlogPostFooter.svelte';
  import TableOfContents from '$features/blog/TableOfContents.svelte';
  import SkeletonLoader from '$components/SkeletonLoader.svelte';
  import {ChevronLeft} from '$components/icons';
  import {author, domain, appName} from '$settings/global';

  let {data} = $props();
  let htmlContent = $state('');
  let scrollContainer = $state(null);
  let tableOfContents = $state([]);
  let isLoading = $state(true);

  // Get the post from the data
  const post = $derived(data.post || {});
  const l10n = data.l10n;

  // TODO move to utils
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

  // TODO move to utils
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
    // Extract metadata from post
    const formattedDate = formatDate(post.meta?.created_at);
    const isoDate = formatISODate(post.meta?.created_at);
    const modifiedIsoDate = post.meta?.modified_at ? formatISODate(post.meta.modified_at) : isoDate;
    const postUrl = `${domain}/blog/${post.slug}`;

    if (post?.code) {
      // Set HTML content
      htmlContent = post.code;

      // Extract TOC if available
      if (post?.toc?.data && Array.isArray(post.toc.data)) {
        tableOfContents = post.toc.data.filter(item => item.level <= 3);
      }

      // Short delay to simulate content loading and ensure proper rendering
      setTimeout(() => {
        isLoading = false;
      }, 200);
    } else {
      console.error('Post content not available:', post);
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>{post.meta?.title || 'Blog Post'} | {appName}</title>
  <meta name="description" content={post.meta?.description || ''} />
  {#if post.meta?.canonical_url}
    <link rel="canonical" href={post.meta.canonical_url} />
  {/if}
</svelte:head>

<!-- Structured data -->
{#if post}
  <JsonLd
    type="BlogPosting"
    data={{
      headline: post.meta?.title || 'Untitled Post',
      description: post.meta?.description || '',
      image: post.meta?.ogImage || `${domain}/images/default-blog-image.jpg`,
      datePublished: formatISODate(post.meta?.created_at),
      dateModified:
        post.meta?.modified_at ?
          formatISODate(post.meta.modified_at)
        : formatISODate(post.meta?.created_at),
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
        '@id': `${domain}/blog/${post.slug}`
      },
      keywords:
        Array.isArray(post.meta?.keywords) ?
          post.meta.keywords.join(', ')
        : post.meta?.keywords || '',
      articleSection:
        Array.isArray(post.meta?.tabs) ? post.meta.tabs.join(', ') : post.meta?.tabs || ''
    }}
  />

  <BreadcrumbsSchema
    items={[
      {name: 'Home', url: domain},
      {name: 'Blog', url: `${domain}/blog`},
      {name: post.meta?.title || 'Untitled Post', url: `${domain}/blog/${post.slug}`}
    ]}
  />
{/if}

<main in:fade={{duration: 300}} class="post-container">
  <!-- Table of Contents Component -->
  <TableOfContents headings={tableOfContents} {isLoading} {l10n} />

  {#if isLoading || post?.code}
    <div class="post-grid">
      <article class="post-content">
        <header class="post-header">
          <!-- Back button -->
          <a href="/blog" class="back-button">
            <ChevronLeft size={16} />
            <span>{l10n.t('backToPosts')}</span>
          </a>

          <div class="post-meta">
            <span class="author">{author}</span>
            <time datetime={post.meta?.created_at || ''}>{formatDate(post.meta?.created_at)}</time>
            {#if post.meta?.readMin}
              <span class="read-time">{post.meta.readMin} {l10n.t('minRead')}</span>
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
            <SkeletonLoader type="content" lines={20} class="content-skeleton" />
          {:else}
            {@html htmlContent}
          {/if}
        </div>

        <footer class="post-footer">
          <Divider />
          <BlogPostFooter
            title={post.meta?.title || ''}
            slug={post.slug}
            tags={post.meta?.tags || []}
            url={`${domain}/blog/${post.slug}`}
            publishDate={post.meta?.created_at}
            readTime={post.meta?.readMin}
            nextPost={post.nextPost}
            previousPost={post.previousPost}
            {l10n}
          />
        </footer>
      </article>
    </div>
  {:else}
    <div class="error-state">
      <h2>{l10n.t('postNotFound')}</h2>
      <p>{l10n.t('postNotFoundDesc')}</p>
      <a href="/blog" class="error-button">{l10n.t('returnToBlog')}</a>
    </div>
  {/if}
</main>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .post-container {
    @apply w-full max-w-6xl mx-auto my-8 sm:my-12;
  }

  .post-grid {
    @apply flex gap-6 sm:gap-10;
  }

  .post-content {
    @apply flex-1 bg-base0/50 rounded-xs overflow-hidden;
    @apply shadow-sm max-w-3xl mx-auto;
  }

  .post-header {
    @apply px-2.5 md:px-5 lg:px-8 pt-2 sm:pt-5 pb-4 sm:pb-6;
  }

  .back-button {
    @apply inline-flex items-center gap-1.5 mb-10 py-1.5 px-3 rounded-xs;
    @apply text-sm font-medium text-base4 bg-base1/50 hover:bg-base1;
    @apply hover:text-base14 border border-base3/10;
    @apply transition-colors no-underline;
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
    @apply text-xs font-medium bg-base1/70 px-3 py-1.5 rounded-xs text-base6;
    @apply hover:bg-base1 transition-colors;
  }

  .post-body {
    @apply px-2.5 md:px-5 lg:px-8 py-6 sm:py-8;
    @apply font-serif;
  }

  .post-footer {
    @apply px-4 sm:px-6 lg:px-8 py-6 sm:py-8;
  }

  .error-state {
    @apply flex flex-col items-center justify-center py-16 text-center;
    @apply bg-base1/30 rounded-xs max-w-md mx-auto;
    @apply border border-base3/10 p-8;
  }

  .error-button {
    @apply mt-4 inline-flex items-center justify-center py-2 px-4;
    @apply bg-base1/70 hover:bg-base1 text-base6 hover:text-base14;
    @apply rounded-xs border border-base3/20 transition-colors;
    @apply font-medium no-underline;
  }

  .content-skeleton {
    @apply min-h-[400px];
  }

  @media (max-width: 640px) {
    .post-title {
      @apply text-2xl;
    }
  }
</style>
