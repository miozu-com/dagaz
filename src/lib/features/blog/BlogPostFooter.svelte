<script>
  import {fly, fade} from 'svelte/transition';
  import {quintOut} from 'svelte/easing';
  import {onMount} from 'svelte';
  import {Twitter, Facebook, Linkedin, Copy, Check, Share, ArrowLeft} from 'lucide-svelte';
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
  const formattedDate = publishDate
    ? new Date(publishDate.replace(/\//g, '-')).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  onMount(() => {
    // Construct the full URL for sharing
    shareUrl = `${domain}/blog/${slug}`;
  });

  function toggleShare() {
    shareExpanded = !shareExpanded;
  }

  function copyToClipboard() {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl)
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
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank');
  }
</script>

<footer class="blog-post-footer">
  <div class="footer-divider"></div>

  <div class="footer-content">
    <!-- Share section -->
    <div class="share-section">
      <button
        class="share-button"
        on:click={toggleShare}
        aria-expanded={shareExpanded}
        aria-label="Share this post"
      >
        <Share size={18} />
        <span>Share</span>
      </button>

      {#if shareExpanded}
        <div class="share-options" in:fly={{y: 10, duration: 200, easing: quintOut}}>
          <button
            class="share-option twitter"
            on:click={shareOnTwitter}
            aria-label="Share on Twitter"
          >
            <Twitter size={16} />
          </button>

          <button
            class="share-option facebook"
            on:click={shareOnFacebook}
            aria-label="Share on Facebook"
          >
            <Facebook size={16} />
          </button>

          <button
            class="share-option linkedin"
            on:click={shareOnLinkedin}
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={16} />
          </button>

          <button
            class="share-option copy"
            on:click={copyToClipboard}
            aria-label="Copy link"
          >
            {#if copied}
              <Check size={16} />
            {:else}
              <Copy size={16} />
            {/if}
          </button>
        </div>
      {/if}
    </div>

    <!-- Tags cloud (if available) -->
    {#if tags && tags.length > 0}
      <div class="tags-cloud">
        {#each tags as tag}
          <a href="/blog?tag={tag}" class="tag">#{tag}</a>
        {/each}
      </div>
    {/if}

    <!-- Post metadata -->
    <div class="post-meta">
      {#if formattedDate}
        <div class="meta-item">
          <span class="meta-label">Published:</span>
          <span class="meta-value">{formattedDate}</span>
        </div>
      {/if}

      {#if readTime}
        <div class="meta-item">
          <span class="meta-label">Reading time:</span>
          <span class="meta-value">{readTime} min{readTime !== 1 ? 's' : ''}</span>
        </div>
      {/if}

      <div class="meta-item">
        <span class="meta-label">Author:</span>
        <span class="meta-value">{author}</span>
      </div>
    </div>

    <div class="navigation-buttons">
      <Button
        variant="primary"
        onclick={() => window.history.back()}
        icon={{
          icon: ArrowLeft,
          position: 'left'
        }}
      >
        Back to posts
      </Button>
    </div>

    <!-- Next/Previous navigation -->
    {#if nextPost || previousPost}
      <div class="post-navigation">
        {#if previousPost}
          <a href="/blog/{previousPost.slug}" class="prev-post">
            <span class="nav-label">← Previous</span>
            <span class="nav-title">{previousPost.title}</span>
          </a>
        {:else}
          <div class="prev-post empty"></div>
        {/if}

        {#if nextPost}
          <a href="/blog/{nextPost.slug}" class="next-post">
            <span class="nav-label">Next →</span>
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
    @apply mt-16 mb-8;
  }

  .footer-divider {
    @apply h-px w-full bg-base3/20 mb-8;
  }

  .footer-content {
    @apply flex flex-col gap-6;
  }

  /* Share section */
  .share-section {
    @apply flex items-center gap-4 relative;
  }

  .share-button {
    @apply flex items-center gap-2 py-2 px-3;
    @apply bg-base1/50 hover:bg-base1 text-base6 rounded-md;
    @apply transition-colors border border-base3/20;
  }

  .share-options {
    @apply flex gap-2 items-center;
  }

  .share-option {
    @apply h-8 w-8 rounded-full flex items-center justify-center;
    @apply transition-colors;
  }

  .twitter {
    @apply bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20;
  }

  .facebook {
    @apply bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20;
  }

  .linkedin {
    @apply bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20;
  }

  .copy {
    @apply bg-base14/10 text-base14 hover:bg-base14/20;
  }

  /* Tags cloud */
  .tags-cloud {
    @apply flex flex-wrap gap-2 mt-2;
  }

  .tag {
    @apply py-1 px-3 rounded-md bg-base1 text-base5 text-sm;
    @apply hover:bg-base2 transition-colors no-underline;
    @apply border border-base3/20;
  }

  /* Post metadata */
  .post-meta {
    @apply flex flex-wrap gap-x-6 gap-y-2 text-sm text-base4;
    @apply py-3 px-4 rounded-md bg-base1/30 border border-base3/10;
  }

  .meta-item {
    @apply flex items-center gap-1.5;
  }

  .meta-label {
    @apply text-base5 font-medium;
  }

  .meta-value {
    @apply text-base6;
  }

  /* Navigation buttons */
  .navigation-buttons {
    @apply flex justify-between mt-4;
  }

  /* Next/Previous post navigation */
  .post-navigation {
    @apply flex justify-between mt-6 gap-4;
  }

  .prev-post,
  .next-post {
    @apply flex flex-col p-4 rounded-md bg-base1/50 border border-base3/20;
    @apply flex-1 max-w-xs transition-colors no-underline;
    @apply hover:bg-base1;
  }

  .next-post {
    @apply text-right items-end;
  }

  .empty {
    @apply invisible;
  }

  .nav-label {
    @apply text-sm text-base4 mb-1;
  }

  .nav-title {
    @apply text-base14 font-medium line-clamp-2;
  }
