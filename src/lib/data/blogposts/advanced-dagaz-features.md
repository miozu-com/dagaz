---
published: true
featured: true
slug: advanced-dagaz-features
title: Practical Advanced Features in Dagaz
description: How to leverage reactive state classes, Canvas API, and functional programming in your Dagaz landing page
created_at: '2025/4/17 10:15'
modified_at: '2025/4/17 14:30'
tabs:
  - development
  - tutorial
tags:
  - svelte
  - runes
  - functional
  - canvas
  - landing-page
keywords:
  - reactive state classes
  - svelte 5 runes
  - canvas api
  - functional programming
  - sveltekit landing page
---

# Practical Advanced Features in Dagaz

Dagaz provides several advanced features that help you build better landing pages and content sites. In this article, we'll explore some of these features and how to implement them in your projects.

## Reactive State Classes

Dagaz uses Svelte 5's runes to create clean, maintainable state management. This approach separates business logic from UI components.

### Creating a Contact Form State

Here's an example of a reactive state class for a contact form:

```javascript
// src/lib/reactiveStates/contactForm.svelte.js
export class ContactFormReactiveState {
  // Form fields
  name = $state('');
  email = $state('');
  message = $state('');
  
  // Form state
  isSubmitting = $state(false);
  hasSubmitted = $state(false);
  errors = $state({});
  
  // Validation
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  validate() {
    let isValid = true;
    const errors = {};
    
    if (!this.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!this.validateEmail(this.email)) {
      errors.email = 'Valid email is required';
      isValid = false;
    }
    
    if (!this.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }
    
    this.errors = errors;
    return isValid;
  }
  
  async submitForm() {
    if (!this.validate()) return false;
    
    this.isSubmitting = true;
    
    try {
      // Submit form data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          message: this.message
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      this.hasSubmitted = true;
      return true;
    } catch (error) {
      this.errors.form = 'Failed to submit form. Please try again.';
      return false;
    } finally {
      this.isSubmitting = false;
    }
  }
  
  resetForm() {
    this.name = '';
    this.email = '';
    this.message = '';
    this.errors = {};
    this.hasSubmitted = false;
  }
}
```

### Using the State Class in a Component

```svelte
<!-- src/routes/contact/+page.svelte -->
<script>
  import {onMount} from 'svelte';
  import Button from '$components/Button.svelte';
  import {ContactFormReactiveState} from '$lib/reactiveStates/contactForm.svelte.js';
  
  let contactForm = $state(new ContactFormReactiveState());
</script>

<div class="contact-page">
  <h1>Contact Us</h1>
  
  {#if contactForm.hasSubmitted}
    <div class="success-message">
      <p>Thank you for your message! We'll get back to you soon.</p>
      <Button variant="secondary" onclick={() => contactForm.resetForm()}>
        Send Another Message
      </Button>
    </div>
  {:else}
    <form
      on:submit|preventDefault={() => contactForm.submitForm()}
      class="contact-form"
    >
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          bind:value={contactForm.name}
          class={contactForm.errors.name ? 'error' : ''}
        />
        {#if contactForm.errors.name}
          <span class="error-message">{contactForm.errors.name}</span>
        {/if}
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={contactForm.email}
          class={contactForm.errors.email ? 'error' : ''}
        />
        {#if contactForm.errors.email}
          <span class="error-message">{contactForm.errors.email}</span>
        {/if}
      </div>
      
      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          id="message"
          bind:value={contactForm.message}
          class={contactForm.errors.message ? 'error' : ''}
        ></textarea>
        {#if contactForm.errors.message}
          <span class="error-message">{contactForm.errors.message}</span>
        {/if}
      </div>
      
      {#if contactForm.errors.form}
        <div class="form-error">
          {contactForm.errors.form}
        </div>
      {/if}
      
      <Button
        type="submit"
        variant="primary"
        disabled={contactForm.isSubmitting}
      >
        {contactForm.isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  {/if}
</div>

<style>
  .contact-page {
    @apply max-w-lg mx-auto p-6;
  }
  
  .contact-form {
    @apply mt-6 space-y-4;
  }
  
  .form-group {
    @apply flex flex-col;
  }
  
  input, textarea {
    @apply p-2 border border-base3 rounded bg-base1;
    @apply focus:outline-none focus:border-base14;
  }
  
  input.error, textarea.error {
    @apply border-base8;
  }
  
  .error-message {
    @apply text-base8 text-sm mt-1;
  }
  
  .form-error {
    @apply bg-base8/10 border border-base8 p-3 rounded text-base8 mb-4;
  }
  
  .success-message {
    @apply bg-base10/10 border border-base10 p-6 rounded text-base10;
  }
</style>
```

This example shows how to separate form logic from UI, making your code more maintainable and easier to test.

## Canvas API for Visualization

Dagaz leverages the native Canvas API for visualizations without dependencies. Here's a simple data chart component:

```svelte
<!-- src/lib/components/DataChart.svelte -->
<script>
  import {onMount} from 'svelte';
  
  let {
    data = [
      { label: 'Q1', value: 120 },
      { label: 'Q2', value: 250 },
      { label: 'Q3', value: 180 },
      { label: 'Q4', value: 310 }
    ],
    width = 500,
    height = 300,
    barColor = '#ff9982',
    bgColor = '#2c3040',
    textColor = '#d0d2db'
  } = $props();
  
  let canvas;
  
  onMount(() => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 60) / data.length - 20;
    
    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw bars
    data.forEach((item, index) => {
      const x = 40 + index * (barWidth + 20);
      const barHeight = (item.value / maxValue) * (height - 100);
      const y = height - 60 - barHeight;
      
      // Bar
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Label
      ctx.fillStyle = textColor;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 30);
      
      // Value
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10);
    });
    
    // Y-axis
    ctx.strokeStyle = textColor;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(30, height - 40);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(30, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
  });
</script>

<canvas bind:this={canvas} {width} {height}></canvas>
```

### Using the Chart Component

```svelte
<!-- In your page component -->
<script>
  import DataChart from '$lib/components/DataChart.svelte';
  
  const salesData = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 63 },
    { label: 'Mar', value: 81 },
    { label: 'Apr', value: 59 }
  ];
</script>

<section class="stats-section">
  <h2>Quarterly Sales</h2>
  <div class="chart-container">
    <DataChart 
      data={salesData}
      barColor="#6dd672"
    />
  </div>
</section>

<style>
  .stats-section {
    @apply mt-8 p-6 bg-base1 rounded-lg;
  }
  
  .chart-container {
    @apply mt-4 flex justify-center;
  }
</style>
```

This approach gives you custom visualizations without external dependencies.

## Functional Programming with Ramda

Dagaz uses functional programming principles for cleaner, more maintainable code. Here's an example that filters project data:

```javascript
// src/lib/utils/projectUtils.js
import {filter, includes, pipe, prop, propEq} from 'ramda';

// Filter projects by category
export const filterByCategory = category =>
  filter(propEq('category', category));

// Filter projects by technology
export const filterByTech = tech =>
  filter(project => includes(tech, prop('technologies', project)));

// Combine filters
export const filterProjects = (projects, {category, tech}) => {
  if (!category && !tech) return projects;
  
  return pipe(
    category ? filterByCategory(category) : x => x,
    tech ? filterByTech(tech) : x => x
  )(projects);
};
```

### Using the Filters

```svelte
<!-- src/routes/projects/+page.svelte -->
<script>
  import {filterProjects} from '$lib/utils/projectUtils.js';
  import Badge from '$components/Badge.svelte';
  
  // Project data
  const projects = [
    {
      id: 1,
      title: 'E-commerce Site',
      category: 'web',
      technologies: ['svelte', 'tailwind', 'stripe']
    },
    {
      id: 2,
      title: 'Mobile App',
      category: 'mobile',
      technologies: ['react-native', 'firebase']
    },
    {
      id: 3,
      title: 'Dashboard',
      category: 'web',
      technologies: ['svelte', 'd3', 'supabase']
    }
  ];
  
  // Filter state
  let filters = $state({
    category: null,
    tech: null
  });
  
  // Computed filtered projects
  let filteredProjects = $derived(filterProjects(projects, filters));
  
  // Reset filters
  function resetFilters() {
    filters = { category: null, tech: null };
  }
</script>

<div class="projects-page">
  <h1>Our Projects</h1>
  
  <div class="filter-controls">
    <div class="filter-group">
      <span class="filter-label">Category:</span>
      <Badge
        onclick={() => filters = {...filters, category: 'web'}}
        selected={filters.category === 'web'}
        label="Web"
      />
      <Badge
        onclick={() => filters = {...filters, category: 'mobile'}}
        selected={filters.category === 'mobile'}
        label="Mobile"
      />
    </div>
    
    <div class="filter-group">
      <span class="filter-label">Technology:</span>
      <Badge
        onclick={() => filters = {...filters, tech: 'svelte'}}
        selected={filters.tech === 'svelte'}
        label="Svelte"
      />
      <Badge
        onclick={() => filters = {...filters, tech: 'react-native'}}
        selected={filters.tech === 'react-native'}
        label="React Native"
      />
    </div>
    
    {#if filters.category || filters.tech}
      <button class="reset-button" onclick={resetFilters}>
        Reset Filters
      </button>
    {/if}
  </div>
  
  <div class="projects-grid">
    {#each filteredProjects as project (project.id)}
      <div class="project-card">
        <h3>{project.title}</h3>
        <div class="project-category">
          {project.category}
        </div>
        <div class="project-tech">
          {#each project.technologies as tech}
            <span class="tech-tag">{tech}</span>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .projects-page {
    @apply max-w-4xl mx-auto p-6;
  }
  
  .filter-controls {
    @apply my-6 p-4 bg-base1 rounded-lg;
  }
  
  .filter-group {
    @apply flex items-center gap-2 mb-3;
  }
  
  .filter-label {
    @apply text-base4 mr-2;
  }
  
  .reset-button {
    @apply text-sm text-base14 mt-2;
  }
  
  .projects-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-6;
  }
  
  .project-card {
    @apply p-6 bg-base1 rounded-lg;
  }
  
  .project-category {
    @apply text-sm text-base4 mb-2;
  }
  
  .tech-tag {
    @apply inline-block text-xs px-2 py-1 bg-base2 rounded mr-2;
  }
</style>
```

This functional approach makes your code more predictable and easier to maintain.

## Multilingual Landing Pages

Dagaz includes multi-language support out of the box. Here's how to create a landing page with language switching:

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import Button from '$components/Button.svelte';
  import LocaleSwitcher from '$features/localization/LocaleSwitcher.svelte';
  
  let {data} = $props();
  const l10n = data.l10n;
</script>

<div class="landing-page">
  <header class="header">
    <div class="logo">YourCompany</div>
    <div class="nav-controls">
      <LocaleSwitcher l10n={l10n} />
    </div>
  </header>
  
  <main class="main-content">
    <h1>{l10n.t('heroTitle')}</h1>
    <p class="hero-subtitle">{l10n.t('heroSubtitle')}</p>
    
    <div class="cta-buttons">
      <Button variant="primary">
        {l10n.t('learnMore')}
      </Button>
      <Button variant="secondary">
        {l10n.t('contactUs')}
      </Button>
    </div>
    
    <section class="features">
      <h2>{l10n.t('featuresTitle')}</h2>
      <div class="features-grid">
        <div class="feature">
          <h3>{l10n.t('feature1Title')}</h3>
          <p>{l10n.t('feature1Desc')}</p>
        </div>
        <div class="feature">
          <h3>{l10n.t('feature2Title')}</h3>
          <p>{l10n.t('feature2Desc')}</p>
        </div>
        <div class="feature">
          <h3>{l10n.t('feature3Title')}</h3>
          <p>{l10n.t('feature3Desc')}</p>
        </div>
      </div>
    </section>
  </main>
</div>
```

Add translations in `src/lib/data/translations.js`:

```javascript
export default {
  en: {
    heroTitle: 'Welcome to YourCompany',
    heroSubtitle: 'We build amazing web experiences',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    featuresTitle: 'Our Services',
    feature1Title: 'Web Development',
    feature1Desc: 'Custom websites built with modern technologies',
    feature2Title: 'UI/UX Design',
    feature2Desc: 'Beautiful, intuitive interfaces that convert',
    feature3Title: 'SEO Optimization',
    feature3Desc: 'Improve your visibility in search results'
  },
  fr: {
    heroTitle: 'Bienvenue chez YourCompany',
    heroSubtitle: 'Nous créons des expériences web exceptionnelles',
    learnMore: 'En Savoir Plus',
    contactUs: 'Contactez-nous',
    featuresTitle: 'Nos Services',
    feature1Title: 'Développement Web',
    feature1Desc: 'Sites web personnalisés avec des technologies modernes',
    feature2Title: 'Design UI/UX',
    feature2Desc: 'Interfaces intuitives et attrayantes qui convertissent',
    feature3Title: 'Optimisation SEO',
    feature3Desc: 'Améliorez votre visibilité dans les résultats de recherche'
  }
};
```

## Conclusion

These advanced features in Dagaz help you build better landing pages and business sites:

- **Reactive State Classes** separate UI from business logic
- **Canvas API** provides visualizations without dependencies
- **Functional Programming** creates predictable, maintainable code
- **Multi-language Support** expands your reach to global audiences

By leveraging these features, you can create fast, maintainable sites that effectively showcase your business.

---

*Created by [Nicholas Glazer](https://nicgl.com), frontend architect specializing in minimal, high-performance sites. Need help with your project? [Get in touch](https://nicgl.com/links).*
