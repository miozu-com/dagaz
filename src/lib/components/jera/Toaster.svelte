<script>
  import {slide} from 'svelte/transition';

  let {
    toastConfig = {
      title: '',
      message: null,
      type: 'info',
      position: 'bottom-right',
      duration: 2500,
      icon: null,
      action: null, // Primary action {text, onClick}
      secondaryAction: null // Secondary action {text, onClick}
    },
    class: className = '',
    onClose = () => {},
    register = () => {},
    ref = $bindable(),
    children
  } = $props();

  let toasts = $state([]);

  // Circle constants
  const radius = 8;
  const circumference = 2 * Math.PI * radius;

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
  };

  const getAnimation = pos =>
    ({
      'top-right': {x: 20, y: 0},
      'top-left': {x: -20, y: 0},
      'bottom-right': {x: 20, y: 0},
      'bottom-left': {x: -20, y: 0},
      'top-center': {x: 0, y: -20},
      'bottom-center': {x: 0, y: 20}
    })[pos] || {x: 20, y: 0};

  // Updated to handle individual toast closure
  const handleClose = id => {
    toasts = toasts.map(t => {
      if (t.id === id) {
        if (t.animationFrameId) cancelAnimationFrame(t.animationFrameId);
        return {...t};
      }
      return t;
    });

    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      onClose();
    }, 200);
  };

  const updateProgress = toast => {
    const update = () => {
      if (toast.paused) return;

      // Skip progress for persistent toasts (duration = 0)
      if (toast.duration === 0) {
        return;
      }

      const elapsed = Date.now() - toast.startTime;
      const duration = toast.duration ?? toastConfig.duration;
      toast.progress = Math.min((elapsed / duration) * 100, 100);

      if (elapsed < duration) {
        toast.animationFrameId = requestAnimationFrame(update);
      } else {
        handleClose(toast.id);
      }
    };

    // Only start progress for non-persistent toasts
    if (toast.duration !== 0) {
      toast.animationFrameId = requestAnimationFrame(update);
    }
  };

  const showToast = (config = {}) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = $state({
      id,
      ...toastConfig,
      ...config,
      progress: 0,
      animationFrameId: null,
      startTime: Date.now(),
      duration: config.duration !== undefined ? config.duration : toastConfig.duration,
      paused: false
    });

    if (!newToast.title && !newToast.message) {
      return;
    }

    toasts = [...toasts, newToast];

    // Only start progress animation if duration > 0 (non-persistent toast)
    if (newToast.duration > 0) {
      updateProgress(newToast);
    }
  };

  $effect(() => register(showToast));
</script>

<div class="toast-container {positionClasses[toastConfig.position]} {className}">
  {#each toasts as toast (toast.id)}
    <div
      bind:this={ref}
      class={`toast-wrapper`}
      in:slide={{...getAnimation(toast.position), duration: 300}}
      out:slide={{...getAnimation(toast.position), duration: 200}}
      onmouseenter={() => (toast.paused = true)}
      onmouseleave={() => {
        // Only restart progress for non-persistent toasts
        if (toast.duration > 0) {
          toast.startTime = Date.now() - (toast.progress / 100) * toast.duration;
          toast.paused = false;
          updateProgress(toast);
        }
      }}
    >
      <div class={`toast ${toast.type}`}>
        <div class="toast-content">
          {#if toast.icon}
            {@const IconComponent = toast.icon}
            <IconComponent class="toast-icon" />
          {/if}
          {#if toast.title}
            <div class="toast-title">{toast.title}</div>
          {/if}
          {#if toast.message}
            <div class="toast-message">{toast.message}</div>
          {/if}

          <!-- Add action buttons if present -->
          {#if toast.action || toast.secondaryAction}
            <div class="toast-actions">
              {#if toast.secondaryAction}
                <button
                  class="toast-action secondary-action"
                  onclick={() => {
                    toast.secondaryAction.onClick();
                    handleClose(toast.id);
                  }}
                >
                  {toast.secondaryAction.text}
                </button>
              {/if}

              {#if toast.action}
                <button
                  class="toast-action primary-action"
                  onclick={() => {
                    toast.action.onClick();
                    handleClose(toast.id);
                  }}
                >
                  {toast.action.text}
                </button>
              {/if}
            </div>
          {/if}

          {@render children?.children()}
        </div>

        <div class="progress-wrapper group" type="button" onclick={() => handleClose(toast.id)}>
          {#if toast.duration > 0}
            <svg class="progress-ring" width="24" height="24" viewBox="0 0 24 24">
              <circle
                class="progress-ring-circle-bg"
                cx="12"
                cy="12"
                r={radius}
                stroke-width="1"
                fill="white"
              />
              <circle
                class="progress-ring-circle"
                cx="12"
                cy="12"
                r={radius}
                stroke-width="2"
                style="stroke-dasharray: {circumference}; stroke-dashoffset: {circumference -
                  (circumference * toast.progress) / 100}"
                fill="white"
              />
              <path
                class="close-icon"
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                fill="white"
                stroke-opacity="1"
                style="mix-blend-mode: normal;"
                transform="translate(0 24) scale(1 -1)"
              />
            </svg>
          {:else}
            <!-- Just show close button for persistent toasts -->
            <svg class="close-ring" width="24" height="24" viewBox="0 0 24 24">
              <path
                class="close-icon"
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                fill="white"
                stroke-opacity="1"
                transform="translate(0 24) scale(1 -1)"
              />
            </svg>
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  @import '$theme/theme.css' theme(reference);
  .toast-container {
    @apply flex fixed bottom-4 z-50;
    flex-direction: column-reverse; /* Newest goes on top */
  }

  .toast-wrapper {
    @apply pointer-events-auto mb-2;
  }

  .toast {
    @apply relative flex items-start p-4;
    @apply min-w-[356px] max-w-[400px];
    @apply bg-base7 text-base1 backdrop-blur-md;
    @apply border border-base4 border-y;
    @apply dark:bg-base1/65 dark:text-base7;
  }

  .toast-content {
    @apply flex-1 flex flex-col;
  }

  .toast-title {
    @apply font-medium mb-1 tracking-wider pr-4;
  }

  .toast-message {
    @apply text-sm text-base2 dark:text-base5/90 font-medium;
  }

  .toast-actions {
    @apply flex gap-2 mt-3;
  }

  .toast-action {
    @apply px-3 py-1.5 text-sm font-medium rounded-sm transition-colors duration-200;
  }

  .primary-action {
    @apply text-base10 bg-base10/10 hover:bg-base10/20;
    @apply dark:text-base10 dark:hover:bg-base10/20;
  }

  .secondary-action {
    @apply text-base4 hover:bg-base4/10;
    @apply dark:text-base5 dark:hover:bg-base5/10;
  }

  .progress-wrapper {
    @apply cursor-pointer absolute right-2 top-4;
    @apply hover:stroke-base5 transition-all;
  }

  .progress-ring-circle,
  .progress-ring-circle-bg,
  .close-icon {
    @apply transition-colors duration-200 ease-in-out stroke-current group-hover:stroke-base5/70;
  }

  .progress-ring {
    @apply transform -rotate-90;
  }

  .close-ring {
    @apply transform;
  }

  .progress-ring-circle-bg {
    @apply stroke-base4 fill-none;
    stroke-width: 1;
  }

  .progress-ring-circle {
    @apply fill-none stroke-current;
    transition: stroke-dashoffset 50ms linear;
  }

  .close-icon {
    @apply stroke-base4 cursor-pointer;
    pointer-events: all;
  }

  /* Variants */
  .toast.info {
    .toast-title {
      @apply text-base15;
    }
    .progress-ring-circle {
      @apply stroke-base12;
    }
    .primary-action {
      @apply text-base12 bg-base12/10 hover:bg-base12/20;
    }
  }

  .toast.success {
    .toast-title {
      @apply text-base10;
    }
    .progress-ring-circle {
      @apply stroke-base10;
    }
    .primary-action {
      @apply text-base10 bg-base10/10 hover:bg-base10/20;
    }
  }

  .toast.error {
    .toast-title {
      @apply text-base8;
    }
    .progress-ring-circle {
      @apply stroke-base8;
    }
    .primary-action {
      @apply text-base8 bg-base8/10 hover:bg-base8/20;
    }
  }

  .toast.warning {
    .toast-title {
      @apply text-base11;
    }
    .progress-ring-circle {
      @apply stroke-base11;
    }
    .primary-action {
      @apply text-base11 bg-base11/10 hover:bg-base11/20;
    }
  }
</style>
