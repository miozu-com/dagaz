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

# Overview

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
      
      <!-- Additional form fields... -->
      
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
```

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
    // Chart implementation...
  });
</script>

<canvas bind:this={canvas} {width} {height}></canvas>
```

## Functional Programming with Ramda

Dagaz uses functional programming principles for cleaner, more maintainable code:

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

This approach makes your code more predictable and easier to maintain.
