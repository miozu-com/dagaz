<script>
  import {fade} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import {appName, domain, author, contact} from '$settings/global';
  import {Button} from '$components/jera';
  import Divider from '$components/Divider.svelte';

  let {data} = $props();
  const l10n = data.l10n;

  let formData = $state({
    name: '',
    email: '',
    message: ''
  });

  let formStatus = $state({
    submitted: false,
    error: null,
    loading: false
  });

  function handleSubmit() {
    formStatus.loading = true;

    // Simulate form submission
    setTimeout(() => {
      formStatus.submitted = true;
      formStatus.loading = false;
    }, 800);
  }

  function resetForm() {
    formData = {
      name: '',
      email: '',
      message: ''
    };
    formStatus = {
      submitted: false,
      error: null,
      loading: false
    };
  }
</script>

<Metadata
  title="Contact | {appName}"
  description="Get in touch with us about your project requirements"
  canonicalUrl={`${domain}/contact`}
/>

<div class="contact-container" in:fade={{duration: 300}}>
  <header class="contact-header">
    <h1 class="page-title">Contact</h1>
    <p class="page-subtitle">Let's start a conversation about your project</p>
    <Divider />
  </header>

  <div class="contact-content">
    {#if formStatus.submitted}
      <div class="success-message">
        <h2>Message Sent</h2>
        <p>Thank you for reaching out! I'll get back to you as soon as possible.</p>
        <Button variant="primary" onclick={resetForm} class="mt-6">Send Another Message</Button>
      </div>
    {:else}
      <div class="form-wrapper">
        <form onsubmit={handleSubmit} class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              required
              placeholder="Your name"
              disabled={formStatus.loading}
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              required
              placeholder="your.email@example.com"
              disabled={formStatus.loading}
            />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              bind:value={formData.message}
              required
              rows="6"
              placeholder="Tell me about your project..."
              disabled={formStatus.loading}
            ></textarea>
          </div>

          <Button type="submit" variant="primary" disabled={formStatus.loading} class="w-full">
            {formStatus.loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        <div class="contact-info">
          <h2>Other Ways to Connect</h2>

          <div class="info-item">
            <h3>Email</h3>
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
  @import '../../theme.css' theme(reference);

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
    @apply flex-1 bg-base1/30 p-6 sm:p-8 rounded-lg;
    @apply border border-base3/10;
  }

  .contact-info {
    @apply w-full md:w-72 flex-shrink-0 bg-base1/30 p-6 sm:p-8 rounded-lg self-start;
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

    input,
    textarea {
      @apply w-full bg-base0 text-base6 rounded-md p-3;
      @apply border border-base3/30 focus:border-base14/50;
      @apply focus:outline-none focus:ring-2 focus:ring-base14/20;
      @apply placeholder:text-base4/70;
    }
  }

  .success-message {
    @apply bg-base10/10 border border-base10/30 p-8 rounded-lg text-center;

    h2 {
      @apply text-2xl font-bold text-base10 mb-4;
    }

    p {
      @apply text-lg text-base5 mb-6;
    }
  }
</style>
