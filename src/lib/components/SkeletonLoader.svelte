<script>
  /**
   * Reusable skeleton loader component
   * Can be used for content, blog posts, table of contents, etc.
   */

  let {
    type = 'content', // Options: 'content', 'toc', 'card', 'title'
    width = '100%',
    height = 'auto',
    lines = 5,
    class: className = ''
  } = $props();

  // Generate an array of the specified number of lines
  const linesArray = Array.from({length: lines});
</script>

{#if type === 'content'}
  <div class="skeleton-content {className}" style="width:{width}; height:{height};">
    <div class="skeleton-title pulse"></div>
    {#each linesArray as _, i}
      <div class="skeleton-line pulse" style="width: {90 - Math.random() * 30}%"></div>
    {/each}
  </div>
{:else if type === 'toc'}
  <div class="skeleton-toc {className}" style="width:{width}; height:{height};">
    <div class="skeleton-toc-title pulse"></div>
    {#each linesArray as _, i}
      <div class="skeleton-toc-item pulse" style="width: {60 - i * 5}%"></div>
    {/each}
  </div>
{:else if type === 'title'}
  <div class="skeleton-title-only pulse {className}" style="width:{width};"></div>
{:else if type === 'card'}
  <div class="skeleton-card {className}" style="width:{width};">
    <div class="skeleton-card-image pulse"></div>
    <div class="skeleton-card-content">
      <div class="skeleton-card-title pulse"></div>
      <div class="skeleton-card-meta pulse"></div>
      <div class="skeleton-card-description pulse"></div>
      <div class="skeleton-card-description pulse" style="width: 85%"></div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @import '../../theme.css' theme(reference);

  /* Base skeleton styles */
  .pulse {
    background: linear-gradient(
      90deg,
      var(--color-base1) 25%,
      var(--color-base2) 50%,
      var(--color-base1) 75%
    );
    background-size: 200% 100%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Content skeleton */
  .skeleton-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .skeleton-title {
    height: 2rem;
    width: 60%;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }

  .skeleton-line {
    height: 1rem;
    border-radius: 0.25rem;
  }

  /* TOC skeleton */
  .skeleton-toc {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .skeleton-toc-title {
    height: 1.5rem;
    width: 80%;
    border-radius: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .skeleton-toc-item {
    height: 1rem;
    border-radius: 0.25rem;
    margin-left: 0.5rem;
  }

  /* Title only */
  .skeleton-title-only {
    height: 2.5rem;
    width: 100%;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }

  /* Card skeleton */
  .skeleton-card {
    display: flex;
    flex-direction: column;
    border-radius: 0.375rem;
    overflow: hidden;
    height: 100%;
  }

  .skeleton-card-image {
    height: 12rem;
    width: 100%;
  }

  .skeleton-card-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .skeleton-card-title {
    height: 1.5rem;
    width: 85%;
    border-radius: 0.25rem;
  }

  .skeleton-card-meta {
    height: 1rem;
    width: 40%;
    border-radius: 0.25rem;
  }

  .skeleton-card-description {
    height: 1rem;
    width: 100%;
    border-radius: 0.25rem;
  }
</style>
