---
published: true
featured: false
slug: interactive-content-with-svelte-in-markdown
title: Using Interactive Svelte Components in Markdown
description: Learn how to add interactive Svelte components directly in your Markdown content
created_at: '2025/4/16 14:30'
modified_at: '2025/4/16 14:30'
canonical_url: https://dagaz-demo.pages.dev/blog/interactive-content-with-svelte-in-markdown
domain: https://dagaz-demo.pages.dev
tabs:
  - tutorial
  - coding
tags:
  - mdsvex
  - svelte
  - interactive
  - components
keywords:
  - svelte components in markdown
  - interactive blogposts
  - mdsvex tutorial
  - toast notifications in markdown
---

<script>
  import {Button} from '$components/jera';
</script>

# Using Interactive Svelte Components in Markdown

One of the great features of Dagaz is the ability to use Svelte components directly in your Markdown content using MDSvex. This allows you to create interactive blog posts that engage your readers in new ways.

## Accordion Component Demo

The Accordion component is a versatile UI element that helps organize content in collapsible sections:

<div style="max-width: 600px; margin: 0 auto;">
      <Button
        type="submit"
        loadingText="Creating a new link..."
        variant="primary md"
      >
        Create new pitch form
      </Button>
</div>

## How It Works

MDSvex allows you to include a `<script>` tag at the top of your Markdown file to import and use Svelte components. The basic syntax is:

```markdown
<script>
  import MyComponent from '$components/MyComponent.svelte';
</script>

# My Markdown Content

Here's my interactive component:

<MyComponent />

More markdown content...
```

## Creating Your Own Components

You can create your own interactive components and use them in your Markdown files. Here's a simple example:

```svelte
<!-- src/lib/components/demos/Counter.svelte -->
<script>
  let count = $state(0);
  
  function increment() {
    count++;
  }
  
  function decrement() {
    count--;
  }
</script>

<div class="counter">
  <button onclick={decrement}>-</button>
  <span>{count}</span>
  <button onclick={increment}>+</button>
</div>

<style>
  .counter {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    background: var(--color-base14);
    color: white;
    border: none;
    cursor: pointer;
  }
  
  span {
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
```

Then import and use it in your Markdown:

```markdown
<script>
  import Counter from '$components/demos/Counter.svelte';
</script>

# Interactive Counter

<Counter />
```

## Using the Accordion Component

The Accordion component accepts several props:

```svelte
<Accordion
  label="Section Title"          // The header text
  initiallyExpanded={false}      // Whether open by default
  count="4"                      // Optional count indicator
  createdAt="2023-04-15T10:30Z"  // Optional creation timestamp
  updatedAt="2023-04-16T14:20Z"  // Optional update timestamp
  onclick={(isExpanded) => {}}   // Optional callback function
>
  <!-- Your content goes here -->
</Accordion>
```

This component uses Svelte's animation system for smooth transitions when expanding and collapsing.

## Best Practices

When using interactive components in Markdown:

1. Keep components self-contained to avoid state management issues
2. Use `$state` (Svelte 5 runes) for local state within components
3. Make sure components are responsive and adapt to different screen sizes
4. Test your components in both light and dark modes
5. For animation-heavy components like Accordion, ensure proper cleanup in component lifecycle

## Conclusion

Interactive components in Markdown open up many possibilities for creating engaging content. Try experimenting with different types of components to enhance your blog posts!
