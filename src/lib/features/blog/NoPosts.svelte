<script>
  import {BookDashed} from '$components/icons';
  import {Button} from '$components/jera';

  let {
    l10n,
    message = l10n.t('noPostsFound'),
    class: className = '',
    refreshAction = null
  } = $props();
</script>

<div class="empty-container {className}">
  <div class="empty-icon">
    <BookDashed size={48} class="sm:size-64" />
  </div>
  <h2 class="empty-title">{l10n.t('blogComingSoon')}</h2>
  <p class="empty-message">{message}</p>
  <p class="empty-subtitle">{l10n.t('checkBackLater')}</p>

  {#if refreshAction}
    <Button variant="primary" onclick={refreshAction} class="mt-4 sm:mt-6"
      >{l10n.t('refresh')}</Button
    >
  {/if}
</div>

<style lang="postcss">
  @import '$theme/theme.css' theme(reference);

  .empty-container {
    @apply flex flex-col items-center justify-center;
    @apply py-10 sm:py-16 px-4 rounded-xs bg-base1/30;
    @apply text-center max-w-sm sm:max-w-lg mx-auto my-6 sm:my-8;
  }

  .empty-icon {
    @apply text-base14/70 mb-4 sm:mb-6;
    @apply animate-pulse;
    animation-duration: 3s;
  }

  .empty-title {
    @apply text-xl sm:text-2xl font-bold mb-2 sm:mb-3;
    @apply text-base14;
  }

  .empty-message {
    @apply text-base3 mb-2 text-base sm:text-lg;
  }

  .empty-subtitle {
    @apply text-base3/70 max-w-sm text-sm sm:text-base;
  }
</style>
