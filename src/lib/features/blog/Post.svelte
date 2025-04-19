<!-- src/lib/features/blog/Post.svelte -->
<script>
  import {fade, fly} from 'svelte/transition';

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

<li in:fly={{y: 20, duration: 300, delay: index * 75}} class="post-item">
  <a href="/blog/{post.slug}" class="post-card">
    <div class="post-image" style="--color: {cardColor}">
      <div class="color-accent"></div>

      {#if post.meta?.tags?.length}
        <div class="featured-tag">
          {post.meta.tags[0]}
        </div>
      {/if}
    </div>

    <div class="post-content">
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

      <div class="post-hover-indicator">
        <span class="read-more-text">{l10n.t('readArticle')}</span>
        <span class="arrow">→</span>
      </div>
    </div>
  </a>
</li>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .post-item {
    @apply flex;
    height: 100%;
  }

  .post-card {
    @apply flex flex-col h-full w-full rounded-xs overflow-hidden;
    @apply bg-base1/40 hover:bg-base1/70 transition-all duration-300;
    @apply shadow-sm hover:shadow-md;
    @apply border border-base3/10 hover:border-base3/20;
    @apply no-underline relative;
    @apply transform hover:-translate-y-1;
  }

  .post-image {
    @apply h-3 relative overflow-hidden;
  }

  .color-accent {
    @apply absolute inset-0 w-full;
    background-color: var(--color, #ff9982);
  }

  .featured-tag {
    @apply absolute top-3 right-4 z-10;
    @apply text-xs font-medium px-2.5 py-1 rounded-full;
    @apply bg-base0/90 text-[var(--color,#ff9982)];
    @apply border border-[var(--color,#ff9982)]/30;
    @apply opacity-90 hover:opacity-100 transition-opacity;
  }

  .post-content {
    @apply p-5 flex-1 flex flex-col;
  }

  .post-title {
    @apply text-xl font-bold mb-3 text-base7;
    @apply tracking-tight leading-tight;
    @apply transition-colors duration-300;
    @apply line-clamp-2;
  }

  .post-card:hover .post-title {
    @apply text-base14;
  }

  .post-description {
    @apply text-sm text-base4 mb-4 line-clamp-3 flex-1;
    @apply leading-relaxed;
  }

  .post-meta {
    @apply flex items-center gap-3 text-xs text-base4;
    @apply pt-3 border-t border-base3/10;
  }

  .read-time {
    @apply before:content-['•'] before:mr-3 before:text-base4/50;
  }

  .post-hover-indicator {
    @apply absolute right-5 bottom-5 opacity-0;
    @apply flex items-center gap-1.5 text-sm font-medium text-base14;
    @apply transition-all duration-300 transform translate-x-2;
  }

  .post-card:hover .post-hover-indicator {
    @apply opacity-100 translate-x-0;
  }

  .arrow {
    @apply transition-transform duration-300;
  }

  .post-card:hover .arrow {
    @apply transform translate-x-1;
  }
</style>
