<script>
  import {UserRound, Email} from '$components/icons';
  import {Button} from '$components/jera';
  import Divider from '$components/Divider.svelte';
  import {appName, author, contact} from '$settings/global';

  let {data, form} = $props();
  const l10n = data.l10n;

  // Form state with Svelte 5 runes
  let formData = $state({
    name: '',
    email: '',
    message: '',
    // Hidden honeypot fields
    website: '',
    phone: ''
  });

  // Form feedback state
  let formState = $state({
    submitting: false,
    success: false,
    error: null,
    message: ''
  });

  // Validation state
  let validationErrors = $state({
    name: null,
    email: null,
    message: null
  });

  // Validation functions
  function validateName(name) {
    if (!name || name.trim().length < 2) {
      return l10n.t('contactNameError');
    }
    return null;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return l10n.t('contactEmailError');
    }
    return null;
  }

  function validateMessage(message) {
    if (!message || message.trim().length < 10) {
      return l10n.t('contactMessageError');
    }
    return null;
  }

  // Validate all fields
  function validateForm() {
    validationErrors.name = validateName(formData.name);
    validationErrors.email = validateEmail(formData.email);
    validationErrors.message = validateMessage(formData.message);

    return !validationErrors.name && !validationErrors.email && !validationErrors.message;
  }

  // Submit form handler
  async function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Set submitting state
    formState.submitting = true;

    try {
      // Create FormData object for submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('website', formData.website); // Honeypot
      submitData.append('phone', formData.phone); // Honeypot

      // Submit the form using fetch
      const response = await fetch('?/default', {
        method: 'POST',
        body: submitData
      });

      // Parse response
      const result = await response.json();

      // Update form state based on result
      formState.success = result.success;
      formState.message = result.message;

      // Clear form if successful
      if (result.success) {
        formData.name = '';
        formData.email = '';
        formData.message = '';
      }
    } catch (error) {
      formState.success = false;
      formState.error = error;
      formState.message = 'An unexpected error occurred. Please try again later.';
    } finally {
      formState.submitting = false;
    }
  }

  // Reset the form
  function resetForm() {
    formData.name = '';
    formData.email = '';
    formData.message = '';
    formState.success = false;
    formState.error = null;
    formState.message = '';
    validationErrors.name = null;
    validationErrors.email = null;
    validationErrors.message = null;
  }
</script>

<div class="contact-container">
  <header class="contact-header">
    <h1 class="page-title">{l10n.t('contact')}</h1>
    <p class="page-subtitle">{l10n.t('contactSubtitle')}</p>
    <Divider />
  </header>

  <div class="contact-content">
    {#if formState.success}
      <div class="success-message">
        <h2>{l10n.t('contactSuccess')}</h2>
        <p>{formState.message}</p>
        <Button variant="primary" onclick={resetForm} class="mt-6"
          >{l10n.t('contactSendAnother')}</Button
        >
      </div>
    {:else}
      <div class="form-wrapper">
        <form onsubmit={handleSubmit} class="contact-form">
          <div class="form-group">
            <label for="name">{l10n.t('contactName')}</label>
            <div class="input-wrapper">
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                onblur={() => (validationErrors.name = validateName(formData.name))}
                placeholder={l10n.t('contactNamePlaceholder')}
                disabled={formState.submitting}
                class={validationErrors.name ? 'input-error' : ''}
              />
              <div class="input-icon">
                <UserRound
                  size={18}
                  color={validationErrors.name ? 'var(--color-base8)' : 'var(--color-base4)'}
                />
              </div>
            </div>
            {#if validationErrors.name}
              <p class="error-message">{validationErrors.name}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="email">{l10n.t('contactEmail')}</label>
            <div class="input-wrapper">
              <input
                id="email"
                type="email"
                bind:value={formData.email}
                onblur={() => (validationErrors.email = validateEmail(formData.email))}
                placeholder={l10n.t('contactEmailPlaceholder')}
                disabled={formState.submitting}
                class={validationErrors.email ? 'input-error' : ''}
              />
              <div class="input-icon">
                <Email
                  size={18}
                  color={validationErrors.email ? 'var(--color-base8)' : 'var(--color-base4)'}
                />
              </div>
            </div>
            {#if validationErrors.email}
              <p class="error-message">{validationErrors.email}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="message">{l10n.t('contactMessage')}</label>
            <textarea
              id="message"
              bind:value={formData.message}
              onblur={() => (validationErrors.message = validateMessage(formData.message))}
              rows="6"
              placeholder={l10n.t('contactMessagePlaceholder')}
              disabled={formState.submitting}
              class={validationErrors.message ? 'input-error' : ''}
            ></textarea>
            {#if validationErrors.message}
              <p class="error-message">{validationErrors.message}</p>
            {/if}
          </div>

          <!-- Honeypot fields (invisible to users, but bots will fill them) -->
          <div class="honeypot" aria-hidden="true">
            <input type="text" name="website" bind:value={formData.website} tabindex="-1" />
            <input type="tel" name="phone" bind:value={formData.phone} tabindex="-1" />
          </div>

          {#if formState.error}
            <div class="form-error">
              <p>{formState.message}</p>
            </div>
          {/if}

          <Button type="submit" variant="primary" disabled={formState.submitting} class="w-full">
            {formState.submitting ? l10n.t('contactSending') : l10n.t('contactSend')}
          </Button>
        </form>

        <div class="contact-info">
          <h2>{l10n.t('contactOtherWays')}</h2>

          <div class="info-item">
            <h3>{l10n.t('contactEmail')}</h3>
            <p><a href={`mailto:${contact}`}>{contact}</a></p>
          </div>

          <div class="info-item">
            <h3>GitHub</h3>
            <p>
              <a href="https://github.com/nicholasglazer" target="_blank" rel="noopener noreferrer"
                >@nicholasglazer</a
              >
            </p>
          </div>

          <div class="info-item">
            <h3>Website</h3>
            <p>
              <a href="https://nicgl.com" target="_blank" rel="noopener noreferrer">nicgl.com</a>
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @import '$styles/theme.css' theme(reference);

  .contact-container {
    @apply w-full max-w-5xl mx-auto pb-16;
  }

  .contact-header {
    @apply text-center pt-8 pb-12;
  }

  .page-title {
    @apply text-4xl font-bold text-base14 mb-4;
    @apply tracking-tight;
  }

  .page-subtitle {
    @apply text-xl text-base5 mb-6;
  }

  .contact-content {
    @apply w-full max-w-4xl mx-auto;
  }

  .form-wrapper {
    @apply flex flex-col md:flex-row gap-12;
  }

  .contact-form {
    @apply flex-1 bg-base1/30 p-6 sm:p-8 rounded-xs;
    @apply border border-base3/10;
  }

  .contact-info {
    @apply w-full md:w-72 flex-shrink-0 bg-base1/30 p-6 sm:p-8 rounded-xs self-start;
    @apply border border-base3/10;

    h2 {
      @apply text-xl font-bold text-base14 mb-6;
    }
  }

  .info-item {
    @apply mb-6;

    h3 {
      @apply text-base7 font-semibold mb-1;
    }

    p {
      @apply text-base5;
    }

    a {
      @apply text-base14 hover:text-base13 transition-colors;
      @apply no-underline border-b border-base14/30 hover:border-base13;
    }
  }

  .form-group {
    @apply mb-6;

    label {
      @apply block text-base7 font-medium mb-2;
    }

    .input-wrapper {
      @apply relative;
    }

    .input-icon {
      @apply absolute right-3 top-1/2 -translate-y-1/2;
    }

    input,
    textarea {
      @apply w-full bg-base0 text-base6 rounded-xs p-3;
      @apply border border-base3/30 focus:border-base14/50;
      @apply focus:outline-none focus:ring-2 focus:ring-base14/20;
      @apply placeholder:text-base4/70;
      @apply pr-10; /* Space for icon */
    }

    textarea {
      @apply resize-none;
    }

    .input-error {
      @apply border-base8/50 focus:border-base8/70 focus:ring-base8/20;
    }
  }

  .error-message {
    @apply text-base8 text-sm mt-1;
  }

  .form-error {
    @apply bg-base8/10 border border-base8/30 p-4 rounded-xs mb-4 text-center;
    p {
      @apply text-base8 text-sm;
    }
  }

  .success-message {
    @apply bg-base10/10 border border-base10/30 p-8 rounded-xs text-center;

    h2 {
      @apply text-2xl font-bold text-base10 mb-4;
    }

    p {
      @apply text-lg text-base5 mb-6;
    }
  }

  /* Hide honeypot fields from humans but keep them accessible to bots */
  .honeypot {
    @apply opacity-0 absolute left-0 top-0 h-0 w-0 -z-10 overflow-hidden;
  }
</style>
