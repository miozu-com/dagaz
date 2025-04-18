<!-- src/lib/features/blog/Post.svelte -->
<script>
  import {fade} from 'svelte/transition';

  let {post, index, l10n} = $props();

  // Generate a consistent color based on the post slug
  function getColorFromSlug(slug) {
    const colors = [
      '#ff9982', // Base14 - Primary accent
      '#6dd672', // Base10 - Success
      '#83d2fc', // Base12 - Blue
      '#c974e6', // Base13 - Purple
      '#e8d176' // Base11 - Warning
    ];

    // Simple hashing function for consistent color selection
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = (hash << 5) - hash + slug.charCodeAt(i);
      hash = hash & hash;
    }

    return colors[Math.abs(hash) % colors.length];
  }

  // Format date from "YYYY/MM/DD HH:MM" to "Month DD, YYYY"
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
          month: 'short',
          day: 'numeric'
        }).format(date);
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  // Truncate description to a specific length while preserving words
  function truncateDescription(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength).split(' ').slice(0, -1).join(' ');
    return `${truncated}...`;
  }

  const cardColor = getColorFromSlug(post.slug);
  const formattedDate = formatDate(post.meta?.created_at);
  const truncatedDescription = truncateDescription(post.meta?.description);
</script>

<li in:fade={{duration: 300, delay: index * 75}} class="post-item">
  <a href="/blog/{post.slug}" class="post-card">
    <div class="post-image" style="background-color: {cardColor}">
      <div class="post-image-inner">
        <!-- If the blog had featured images, they would go here -->
      </div>
      <div class="post-overlay">
        <span class="read-more">{l10n.t('readArticle')}</span>
      </div>
    </div>

    <div class="post-content">
      {#if post.meta?.tags?.length}
        <div class="post-tags">
          {#each post.meta.tags.slice(0, 3) as tag}
            <span class="tag">{tag}</span>
          {/each}
          {#if post.meta?.tags?.length > 3}
            <span class="tag more-tag">+{post.meta.tags.length - 3}</span>
          {/if}
        </div>
      {/if}

      <h2 class="post-title">{post.meta?.title || 'Untitled Post'}</h2>

      {#if post.meta?.description}
        <p class="post-description">{truncatedDescription}</p>
      {/if}

      <div class="post-meta">
        <time datetime={post.meta?.created_at || ''}>{formattedDate}</time>

        {#if post.meta?.readMin}
          <span class="read-time">{post.meta.readMin} {l10n.t('minRead')}</span>
        {/if}
      </div>
    </div>
  </a>
</li>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .post-item {
    @apply mb-4 sm:mb-8 flex;
  }

  .post-card {
    @apply flex flex-col h-full w-full rounded-lg overflow-hidden;
    @apply bg-base1/40 hover:bg-base1/70 transition-colors;
    @apply shadow-sm transform hover:-translate-y-1 hover:shadow-md transition-all duration-300;
    @apply no-underline border border-base3/10;
  }

  .post-image {
    @apply h-36 sm:h-48 relative flex items-center justify-center;
    @apply bg-gradient-to-br from-[color:var(--color,#ff9982)] to-[color:var(--color,#ff9982)]/70;
  }

  .post-image-inner {
    @apply h-full w-full;
  }

  .post-overlay {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-base0/0 hover:bg-base0/40 transition-colors;
    @apply opacity-0 hover:opacity-100;
  }

  .read-more {
    @apply px-3 py-1.5 sm:px-4 sm:py-2 bg-base0/90 text-base7 text-xs sm:text-sm font-medium rounded-md;
    @apply transform scale-95 hover:scale-100 transition-transform;
    @apply border border-base7/20;
  }

  .post-content {
    @apply p-2.5 sm:p-5 flex-1 flex flex-col;
  }

  .post-tags {
    @apply flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4;
  }

  .tag {
    @apply text-xs bg-base1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-base5;
    @apply dark:bg-base2/50 dark:text-base6 font-medium;
    @apply transition-colors;
  }

  .more-tag {
    @apply bg-base1/60 text-base4;
    @apply dark:bg-base1/60 dark:text-base5;
  }

  .post-title {
    @apply text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-base7;
    @apply tracking-tight leading-tight;
    @apply line-clamp-2;
    @apply transition-colors;
  }

  .post-card:hover .post-title {
    @apply text-base14;
  }

  .post-description {
    @apply text-xs sm:text-sm text-base4 mb-3 sm:mb-4 line-clamp-3 flex-1;
    @apply leading-relaxed;
  }

  .post-meta {
    @apply flex items-center gap-2 sm:gap-3 text-xs text-base4 mt-auto;
    @apply pt-2 sm:pt-3 border-t border-base3/10;
  }

  .read-time {
    @apply before:content-['•'] before:mr-2 sm:before:mr-3 before:text-base4/50;
  }
</style>
