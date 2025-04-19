<script>
  import {onMount} from 'svelte';
  import {fly, fade} from 'svelte/transition';
  import {quintOut} from 'svelte/easing';
  import {
    Copy,
    Check,
    Share2,
    Link,
    ChevronRight,
    ChevronLeft,
    Calendar,
    ClockFading,
    UserRound
  } from '$components/icons';
  import {Button} from '$components/jera';
  import {domain, author} from '$settings/global';

  let {
    title = '',
    slug = '',
    tags = [],
    url = '',
    publishDate = '',
    readTime = '',
    nextPost = null,
    previousPost = null
  } = $props();

  let shareUrl = $state('');
  let copied = $state(false);
  let shareExpanded = $state(false);

  // Format date nicely if provided
  const formattedDate =
    publishDate ?
      new Date(publishDate.replace(/\//g, '-')).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  onMount(() => {
    // Construct the full URL for sharing
    shareUrl = url || `${domain}/blog/${slug}`;
  });

  function toggleShare() {
    shareExpanded = !shareExpanded;
  }

  function copyToClipboard() {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          copied = true;
          setTimeout(() => {
            copied = false;
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  }

  function shareOnTwitter() {
    const text = encodeURIComponent(`${title} by ${author}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  function shareOnFacebook() {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  function shareOnLinkedin() {
    const title = encodeURIComponent(title);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      '_blank'
    );
  }
</script>

<footer class="blog-post-footer">
  <!-- Top Section - Article Metadata and Sharing -->
  <div class="footer-top">
    <!-- Post metadata -->
    <div class="post-meta-card">
      <h3 class="meta-title">Article Information</h3>
      <div class="meta-items">
        {#if formattedDate}
          <div class="meta-item">
            <div class="meta-icon">
              <Calendar size={16} />
            </div>
            <span class="meta-label">Published:</span>
            <span class="meta-value">{formattedDate}</span>
          </div>
        {/if}

        {#if readTime}
          <div class="meta-item">
            <div class="meta-icon">
              <ClockFading size={16} />
            </div>
            <span class="meta-label">Reading time:</span>
            <span class="meta-value">{readTime} min{readTime !== 1 ? 's' : ''}</span>
          </div>
        {/if}

        <div class="meta-item">
          <div class="meta-icon">
            <UserRound size={16} />
          </div>
          <span class="meta-label">Author:</span>
          <span class="meta-value">{author}</span>
        </div>
      </div>
    </div>

    <!-- Share section -->
    <div class="share-card">
      <h3 class="share-title">Share This Article</h3>

      <div class="share-buttons">
        <button
          class="share-button twitter"
          on:click={shareOnTwitter}
          aria-label="Share on Twitter"
        >
          <span>Twitter</span>
        </button>

        <button
          class="share-button facebook"
          on:click={shareOnFacebook}
          aria-label="Share on Facebook"
        >
          <span>Facebook</span>
        </button>

        <button
          class="share-button linkedin"
          on:click={shareOnLinkedin}
          aria-label="Share on LinkedIn"
        >
          <span>LinkedIn</span>
        </button>

        <button class="share-button copy" on:click={copyToClipboard} aria-label="Copy article link">
          {#if copied}
            <Check size={16} />
            <span>Copied!</span>
          {:else}
            <Link size={16} />
            <span>Copy Link</span>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Middle Section - Tags -->
  {#if tags && tags.length > 0}
    <div class="tags-section">
      <h3 class="tags-title">Tags</h3>
      <div class="tags-cloud">
        {#each tags as tag}
          <a href="/blog?tag={tag}" class="tag">#{tag}</a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Bottom Section - Navigation -->
  <div class="navigation-section">
    <Button
      variant="primary"
      onclick={() => window.history.back()}
      icon={{
        icon: ChevronRight,
        position: 'left'
      }}
    >
      Back to posts
    </Button>

    <!-- Next/Previous navigation -->
    {#if nextPost || previousPost}
      <div class="post-navigation">
        {#if previousPost}
          <a href="/blog/{previousPost.slug}" class="prev-post">
            <div class="nav-indicator">
              <ChevronRight size={14} />
              <span>Previous</span>
            </div>
            <span class="nav-title">{previousPost.title}</span>
          </a>
        {:else}
          <div class="prev-post empty"></div>
        {/if}

        {#if nextPost}
          <a href="/blog/{nextPost.slug}" class="next-post">
            <div class="nav-indicator">
              <span>Next</span>
              <ChevronLeft size={14} />
            </div>
            <span class="nav-title">{nextPost.title}</span>
          </a>
        {/if}
      </div>
    {/if}
  </div>
</footer>

<style lang="postcss">
  @import '../../../theme.css' theme(reference);

  .blog-post-footer {
    @apply mt-8 mb-12 flex flex-col gap-8;
  }

  /* Footer top section - flex layout for metadata and sharing */
  .footer-top {
    @apply flex flex-col md:flex-row gap-6 md:gap-8;
  }

  /* Metadata Card */
  .post-meta-card {
    @apply flex-1 bg-base1/40 rounded-lg p-5 border border-base3/10;
  }

  .meta-title {
    @apply text-base14 text-lg font-medium mb-3 pb-2 border-b border-base3/20;
  }

  .meta-items {
    @apply flex flex-col gap-2;
  }

  .meta-item {
    @apply flex items-center gap-2 text-sm;
  }

  .meta-icon {
    @apply text-base4;
  }

  .meta-label {
    @apply text-base5 font-medium;
  }

  .meta-value {
    @apply text-base6 ml-1;
  }

  /* Share Card */
  .share-card {
    @apply flex-1 bg-base1/40 rounded-lg p-5 border border-base3/10;
  }

  .share-title {
    @apply text-base14 text-lg font-medium mb-3 pb-2 border-b border-base3/20;
  }

  .share-buttons {
    @apply flex flex-wrap gap-2;
  }

  .share-button {
    @apply flex items-center gap-1.5 px-3 py-2 rounded-md;
    @apply text-sm transition-colors duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-1;
    @apply bg-base2/50 hover:bg-base2/80 text-base6;
  }

  .twitter {
    @apply bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 focus:ring-[#1DA1F2]/30;
  }

  .facebook {
    @apply bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20 focus:ring-[#4267B2]/30;
  }

  .linkedin {
    @apply bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 focus:ring-[#0A66C2]/30;
  }

  .copy {
    @apply bg-base14/10 text-base14 hover:bg-base14/20 focus:ring-base14/30;
  }

  /* Tags Section */
  .tags-section {
    @apply bg-base1/40 rounded-lg p-5 border border-base3/10;
  }

  .tags-title {
    @apply text-base14 text-lg font-medium mb-3 pb-2 border-b border-base3/20;
  }

  .tags-cloud {
    @apply flex flex-wrap gap-2;
  }

  .tag {
    @apply py-1.5 px-3 rounded-md bg-base2/70 text-base5 text-sm;
    @apply hover:bg-base2 transition-colors no-underline;
    @apply border border-base3/20;
  }

  /* Navigation Section */
  .navigation-section {
    @apply flex flex-col gap-6;
  }

  .post-navigation {
    @apply grid grid-cols-1 md:grid-cols-2 gap-4;
  }

  .prev-post,
  .next-post {
    @apply flex flex-col p-4 rounded-md bg-base1/50 border border-base3/20;
    @apply transition-colors no-underline hover:bg-base1;
  }

  .prev-post {
    @apply md:col-start-1;
  }

  .next-post {
    @apply md:col-start-2 text-right;
  }

  .nav-indicator {
    @apply flex items-center gap-1 text-sm text-base4 mb-2;
  }

  .next-post .nav-indicator {
    @apply justify-end;
  }

  .nav-title {
    @apply text-base14 font-medium line-clamp-2;
    @apply transition-colors;
  }

  .empty {
    @apply hidden md:block;
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .footer-top {
      @apply flex-col;
    }

    .post-navigation {
      @apply grid-cols-1 gap-4;
    }

    .prev-post,
    .next-post {
      @apply col-span-1;
    }
  }
</style>
