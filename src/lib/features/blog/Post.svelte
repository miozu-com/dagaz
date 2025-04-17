<script>
  import {fade} from 'svelte/transition';

  let {post, index, l10n} = $props();

  // Generate a consistent color based on the post slug
  function getColorFromSlug(slug) {
    // TODO reconsider
    const colors = [
      '#ff9982', // Base14 - Primary accent
      '#6dd672', // Base10 - Success
      '#83d2fc', // Base12 - Blue
      '#c974e6', // Base13 - Purple
      '#e8d176' // Base11 - Warning
    ];

    // NOTE rly?
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

  const cardColor = getColorFromSlug(post.slug);
  const formattedDate = formatDate(post.meta?.created_at);
</script>

<li in:fade={{duration: 300, delay: index * 75}} class="post-item">
  <a href="/blog/{post.slug}" class="post-card">
    <div class="post-image" style="background-color: {cardColor}">
      <div class="post-overlay">
        <span class="read-more">{l10n.t('readArticle')}</span>
      </div>
    </div>

    <div class="post-content">
      {#if post.meta?.tags?.length}
        <div class="post-tags">
          {#each post.meta.tags.slice(0, 2) as tag}
            <span class="tag">{tag}</span>
          {/each}
          {#if post.meta?.tags?.length > 2}
            <span class="tag more-tag">+{post.meta.tags.length - 2}</span>
          {/if}
        </div>
      {/if}

      <h2 class="post-title">{post.meta?.title || 'Untitled Post'}</h2>

      {#if post.meta?.description}
        <p class="post-description">{post.meta?.description}</p>
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
    @apply mb-8;
  }

  .post-card {
    @apply flex flex-col h-full rounded-md overflow-hidden;
    @apply bg-base1/40 hover:bg-base1/70 transition-colors;
    @apply shadow-sm transform hover:-translate-y-1 transition-all duration-300;
    @apply no-underline border border-base3/10;
  }

  .post-image {
    @apply h-40 relative;
  }

  .post-overlay {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-black/0 hover:bg-black/30 transition-colors;
    @apply opacity-0 hover:opacity-100;
  }

  .read-more {
    @apply px-4 py-2 bg-base0/80 text-base7 text-sm font-medium;
    @apply transform scale-95 hover:scale-100 transition-transform;
  }

  .post-content {
    @apply p-5 flex-1 flex flex-col;
  }

  .post-tags {
    @apply flex flex-wrap gap-1.5 mb-3;
  }

  .tag {
    @apply text-xs bg-base1 px-2 py-0.5 rounded-full text-base3;
    @apply dark:bg-base2/50 dark:text-base5;
  }

  .more-tag {
    @apply bg-base1/60;
    @apply dark:bg-base1/60;
  }

  .post-title {
    @apply text-xl font-bold mb-3 text-base7;
    @apply line-clamp-2;
    @apply transition-colors;
  }

  .post-card:hover .post-title {
    @apply text-base14;
  }

  .post-description {
    @apply text-sm text-base4 mb-4 line-clamp-2 flex-1;
  }

  .post-meta {
    @apply flex items-center gap-3 text-xs text-base3 mt-auto;
    @apply pt-3 border-t border-base3/10;
  }

  .read-time {
    @apply before:content-['•'] before:mr-3 before:text-base4/50;
  }

  /* Dark mode adjustments */
  :global(.dark) .post-card {
    @apply bg-base1/30 hover:bg-base1/50 border-base3/5;
  }
</style>
