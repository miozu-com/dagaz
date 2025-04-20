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
  let hasNewsletter = $state(true); // Set to false if you don't want newsletter feature

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

  function shareOnReddit() {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(title);
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
  }

  function shareOnWhatsapp() {
    const text = encodeURIComponent(`${title} ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function shareOnThreads() {
    // Threads doesn't have a direct share API yet, but we can copy to clipboard
    // and show a notification about sharing on Threads
    copyToClipboard();
    alert('Copied to clipboard! You can paste this link on Threads.');
  }
</script>

<footer class="blog-post-footer">
  <!-- Author and Article Engagement Section -->
  <div class="post-author-engagement">
    <div class="author-profile">
      <div class="author-avatar">
        <!-- If you have author images, use them here -->
        <UserRound size={40} class="avatar-placeholder" />
      </div>
      <div class="author-info">
        <div class="author-name">{author}</div>
        <div class="author-meta">
          {#if formattedDate}
            <span class="meta-item">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </span>
          {/if}
          {#if readTime}
            <span class="meta-item">
              <ClockFading size={14} />
              <span>{readTime} min read</span>
            </span>
          {/if}
        </div>
      </div>
    </div>

    <div class="article-engagement">
      <button class="share-button" onclick={toggleShare} aria-label="Share article">
        <Share2 size={18} />
        <span>Share</span>
      </button>
    </div>
  </div>

  <!-- Share Panel - Expanded when toggleShare is clicked -->
  {#if shareExpanded}
    <div class="share-panel" transition:fly={{y: 20, duration: 200, easing: quintOut}}>
      <div class="share-options">
        <button
          class="share-option twitter"
          onclick={shareOnTwitter}
          aria-label="Share on X (Twitter)"
        >
          <span>X (Twitter)</span>
        </button>
        <button
          class="share-option facebook"
          onclick={shareOnFacebook}
          aria-label="Share on Facebook"
        >
          <span>Facebook</span>
        </button>
        <button
          class="share-option linkedin"
          onclick={shareOnLinkedin}
          aria-label="Share on LinkedIn"
        >
          <span>LinkedIn</span>
        </button>
        <button class="share-option reddit" onclick={shareOnReddit} aria-label="Share on Reddit">
          <span>Reddit</span>
        </button>
        <button
          class="share-option whatsapp"
          onclick={shareOnWhatsapp}
          aria-label="Share on WhatsApp"
        >
          <span>WhatsApp</span>
        </button>
        <button class="share-option threads" onclick={shareOnThreads} aria-label="Share on Threads">
          <span>Threads</span>
        </button>
        <button class="share-option copy" onclick={copyToClipboard} aria-label="Copy article link">
          {#if copied}
            <Check size={14} />
            <span>Copied!</span>
          {:else}
            <Link size={14} />
            <span>Copy Link</span>
          {/if}
        </button>
      </div>
    </div>
  {/if}

  <!-- Tags Section -->
  {#if tags && tags.length > 0}
    <div class="tags-section">
      <h3 class="section-title">Topics</h3>
      <div class="tags-cloud">
        {#each tags as tag}
          <a href="/blog?tag={tag}" class="tag">#{tag}</a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Newsletter Section (optional) -->
  {#if hasNewsletter}
    <div class="newsletter-section">
      <div class="newsletter-content">
        <h3 class="newsletter-title">Subscribe to our newsletter</h3>
        <p class="newsletter-description">Get the latest posts delivered right to your inbox</p>
        <form class="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
            aria-label="Email for newsletter"
            class="newsletter-input"
          />
          <button type="button" class="newsletter-button">Subscribe</button>
        </form>
        <p class="newsletter-disclaimer">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </div>
  {/if}

  <!-- Related Posts Component -->
  {#if nextPost || previousPost}
    <div class="related-posts">
      <h3 class="section-title">Continue Reading</h3>
      <div class="post-navigation">
        {#if previousPost}
          <a href="/blog/{previousPost.slug}" class="related-post prev-post">
            <div class="related-post-direction">
              <ChevronLeft size={16} />
              <span>Previous</span>
            </div>
            <h4 class="related-post-title">{previousPost.title}</h4>
          </a>
        {:else}
          <div class="related-post empty"></div>
        {/if}

        {#if nextPost}
          <a href="/blog/{nextPost.slug}" class="related-post next-post">
            <div class="related-post-direction">
              <span>Next</span>
              <ChevronRight size={16} />
            </div>
            <h4 class="related-post-title">{nextPost.title}</h4>
          </a>
        {:else}
          <div class="related-post empty"></div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Back to Blog -->
  <div class="back-to-blog">
    <Button
      variant="primary"
      onclick={() => window.history.back()}
      icon={{
        icon: ChevronLeft,
        position: 'left'
      }}
    >
      Back to blog
    </Button>
  </div>
</footer>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .blog-post-footer {
    @apply mt-12 mb-16 flex flex-col gap-10;
    @apply text-base;
  }

  /* Section title styling (used multiple places) */
  .section-title {
    @apply text-xl font-semibold text-base14 mb-4;
    @apply border-b border-base3/10 pb-2;
  }

  /* Author and Engagement section */
  .post-author-engagement {
    @apply flex justify-between items-start flex-col sm:flex-row gap-6;
    @apply p-6 bg-base1/40 rounded-xs border border-base3/10;
  }

  .author-profile {
    @apply flex items-center gap-4;
  }

  .author-avatar {
    @apply w-12 h-12 rounded-full bg-base3/20 flex items-center justify-center overflow-hidden;
    @apply border border-base3/30;
  }

  .avatar-placeholder {
    @apply text-base4;
  }

  .author-info {
    @apply flex flex-col;
  }

  .author-name {
    @apply font-semibold text-lg text-base7;
  }

  .author-meta {
    @apply flex flex-wrap gap-4 text-sm text-base4;
  }

  .meta-item {
    @apply flex items-center gap-1.5;
  }

  .article-engagement {
    @apply flex items-center gap-4;
  }

  .like-button {
    @apply flex items-center gap-2 py-2 px-3 rounded-xs;
    @apply bg-base1/80 hover:bg-base1 text-base4 hover:text-base14;
    @apply border border-base3/20 transition-colors;
  }

  .like-button.liked {
    @apply bg-base14/10 text-base14 border-base14/30;
  }

  .heart-icon {
    @apply w-5 h-5;
  }

  .like-count {
    @apply font-medium min-w-6 text-center;
  }

  .share-button {
    @apply flex items-center gap-2 py-2 px-3 rounded-xs;
    @apply bg-base1/80 hover:bg-base1 text-base4 hover:text-base14;
    @apply border border-base3/20 transition-colors;
  }

  /* Share Panel */
  .share-panel {
    @apply bg-base1/60 rounded-xs p-4 border border-base3/10;
  }

  .share-options {
    @apply flex flex-wrap gap-2;
  }

  .share-option {
    @apply flex items-center gap-1.5 px-3 py-2 rounded-xs text-sm;
    @apply transition-colors duration-200 font-medium;
    @apply bg-base2/30 hover:bg-base2/70 text-base6;
    @apply cursor-pointer;
  }

  .twitter {
    @apply bg-[#1da1f2]/10 text-[#1da1f2] hover:bg-[#1da1f2]/20;
  }

  .facebook {
    @apply bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20;
  }

  .linkedin {
    @apply bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20;
  }

  .reddit {
    @apply bg-[#FF4500]/10 text-[#FF4500] hover:bg-[#FF4500]/20;
  }

  .whatsapp {
    @apply bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20;
  }

  .threads {
    @apply bg-[#000000]/10 text-base6 hover:bg-[#000000]/20;
  }

  .copy {
    @apply bg-base14/10 text-base14 hover:bg-base14/20;
  }

  /* Tags section */
  .tags-section {
    @apply bg-base1/40 rounded-xs p-6 border border-base3/10;
  }

  .tags-cloud {
    @apply flex flex-wrap gap-2;
  }

  .tag {
    @apply py-1.5 px-3 rounded-xs bg-base2/70 text-base5 text-sm;
    @apply hover:bg-base2 transition-colors no-underline;
    @apply border border-base3/20;
  }

  /* Newsletter section */
  .newsletter-section {
    @apply rounded-xs overflow-hidden;
    @apply bg-gradient-to-br from-base1/60 to-base1/30;
    @apply border border-base3/10;
  }

  .newsletter-content {
    @apply p-6 text-center;
  }

  .newsletter-title {
    @apply text-xl font-bold text-base14 mb-2;
  }

  .newsletter-description {
    @apply text-base5 mb-4;
  }

  .newsletter-form {
    @apply flex flex-col sm:flex-row gap-2 max-w-md mx-auto;
  }

  .newsletter-input {
    @apply flex-grow py-2 px-3 rounded-xs;
    @apply bg-base0 text-base6 border border-base3/30;
    @apply focus:outline-none focus:ring-2 focus:ring-base14/20;
  }

  .newsletter-button {
    @apply py-2 px-4 rounded-xs font-medium;
    @apply bg-base14 text-base0 hover:bg-base14/90;
    @apply transition-colors;
  }

  .newsletter-disclaimer {
    @apply text-xs text-base4 mt-3;
  }

  /* Related Posts section */
  .related-posts {
    @apply bg-base1/40 rounded-xs p-6 border border-base3/10;
  }

  .post-navigation {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
  }

  .related-post {
    @apply flex flex-col p-5 rounded-xs bg-base1/70 border border-base3/20;
    @apply transition-colors hover:bg-base1 no-underline;
  }

  .related-post-direction {
    @apply flex items-center gap-1 text-sm text-base4 mb-2;
  }

  .next-post .related-post-direction {
    @apply justify-end;
  }

  .related-post-title {
    @apply text-base14 font-medium line-clamp-2;
    @apply transition-colors;
  }

  .prev-post {
    @apply sm:col-start-1;
  }

  .next-post {
    @apply sm:col-start-2 text-right;
  }

  .empty {
    @apply hidden sm:block;
  }

  /* Back to blog */
  .back-to-blog {
    @apply flex justify-center;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .post-author-engagement {
      @apply flex-col gap-4;
    }

    .article-engagement {
      @apply self-start;
    }

    .newsletter-form {
      @apply flex-col;
    }

    .post-navigation {
      @apply grid-cols-1 gap-4;
    }

    .related-post {
      @apply col-span-1;
    }
  }
</style>
