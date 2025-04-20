<script>
  import {fade} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import {appName, domain, author} from '$settings/global';
  import DagazLogo from '$components/DagazLogo.svelte';
  import Divider from '$components/Divider.svelte';

  let {data} = $props();
  const l10n = data.l10n;
</script>

<Metadata
  title="Manifesto | {appName}"
  description="The philosophy and motivation behind the Dagaz SvelteKit starter project"
  canonicalUrl={`${domain}/manifesto`}
/>

<div class="manifesto-container" in:fade={{duration: 300}}>
  <header class="manifesto-header">
    <DagazLogo size={56} color="#ff9982" class="manifesto-logo" />
    <h1 class="manifesto-title">The Dagaz Manifesto</h1>
    <Divider />
  </header>

  <div class="manifesto-content">
    <section class="manifesto-section">
      <h2 class="section-title">Why I Created Dagaz</h2>

      <p>
        After years of developing projects with various frameworks, I created Dagaz for the projects
        I launch myself. I've been refining this approach for many years, but never had the time to
        package it as a proper starter kit for others to use—until now.
      </p>

      <p>
        With one client contract wrapping up, I finally have the time to contribute something
        meaningful to the Svelte community and to my own projects. Dagaz represents years of
        learning about what actually matters in frontend development.
      </p>
    </section>

    <section class="manifesto-section">
      <h2 class="section-title">Core Principles</h2>

      <div class="principles">
        <div class="principle">
          <h3>Minimal Dependencies</h3>
          <p>
            Every dependency adds complexity, potential security risks, and maintenance burden.
            Dagaz uses just what's needed, nothing more. We can do remarkable things with modern
            browser APIs and a thoughtful approach.
          </p>
        </div>

        <div class="principle">
          <h3>Functional Approach</h3>
          <p>
            Clean, predictable patterns make for maintainable code. Functional programming
            principles create systems that are easier to test, debug, and extend. Svelte 5's runes
            are a perfect match for this paradigm.
          </p>
        </div>

        <div class="principle">
          <h3>Modular Architecture</h3>
          <p>
            Each component, feature, and module should have a clear, single responsibility. This
            approach makes your project scale gracefully and avoids the technical debt of
            intertwined, hard-to-understand code.
          </p>
        </div>

        <div class="principle">
          <h3>Native First</h3>
          <p>
            The browser provides powerful APIs like Canvas instead of adding heavy third-party
            libraries. This leads to faster load times, better performance, and more control over
            your application.
          </p>
        </div>
      </div>
    </section>

    <section class="manifesto-section">
      <h2 class="section-title">The Miozu Bundle</h2>

      <p>
        Dagaz is just the beginning. It's part of a larger collection I'm building called the Miozu
        Bundle, which includes:
      </p>

      <ul class="bundle-list">
        <li><strong>Dagaz</strong> - This minimal SvelteKit starter</li>
        <li>
          <strong>Miozu Colors</strong> - A thoughtful color scheme system (think Nord or Dracula, but
          with my own approach)
        </li>
        <li>
          <strong>3D Component Library</strong> - Carefully crafted Svelte 5 components for rapid development
        </li>
      </ul>

      <p>
        Everything in the Miozu Bundle shares the same philosophy: Svelte 5, minimal dependencies,
        functional approach, and a focus on developer experience without sacrificing performance.
      </p>
    </section>

    <section class="manifesto-section">
      <h2 class="section-title">Looking Forward</h2>

      <p>
        Web development doesn't need to be complicated. The tools we build should enable creativity
        and solve real problems, not create new ones. Dagaz is my contribution toward making web
        development more focused and enjoyable.
      </p>

      <p>
        I hope you find it valuable for your projects. If you do, consider starring the project on
        GitHub, or even better, contributing back to make it even better.
      </p>

      <p class="signature">— {author}</p>
    </section>
  </div>
</div>

<style lang="postcss">
  @import '$theme/theme.css' theme(reference);

  .manifesto-container {
    @apply w-full max-w-4xl mx-auto pb-16;
  }

  .manifesto-header {
    @apply flex flex-col items-center pt-8 pb-12;
  }

  .manifesto-logo {
    @apply mb-6;
  }

  .manifesto-title {
    @apply text-4xl font-bold text-base14 mb-4;
    @apply tracking-tight;
  }

  .manifesto-content {
    @apply space-y-16;
  }

  .manifesto-section {
    @apply space-y-6;
  }

  .section-title {
    @apply text-2xl font-bold text-base14 mb-6;
    @apply tracking-tight;
  }

  .principles {
    @apply grid grid-cols-1 md:grid-cols-2 gap-8;
  }

  .principle {
    @apply bg-base1/30 p-6 rounded-xs;
    @apply border border-base3/10;
  }

  .principle h3 {
    @apply text-xl font-semibold mb-3 text-base7;
  }

  .principle p {
    @apply text-base5 leading-relaxed;
  }

  .bundle-list {
    @apply space-y-2 pl-6 list-disc;
    @apply text-base5;
  }

  .bundle-list li {
    @apply leading-relaxed;
  }

  .signature {
    @apply text-xl font-medium text-base14 mt-8 text-right italic;
  }

  p {
    @apply text-base5 leading-relaxed;
  }
</style>
