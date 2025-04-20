<script>
  import {
    pipe,
    defaultTo,
    keys,
    forEach,
    filter,
    reduce,
    inc,
    path,
    is,
    complement,
    both
  } from 'ramda';
  import Badge from '$components/Badge.svelte';
  import {toUniqArr, filterArrByString} from '$utils';

  let {payload = [], children, propPath = [], toggleEvent = () => {}, isTagCount = true} = $props();

  // Ensure payload is always an array
  payload = payload || [];

  // Helper function to check if a value is an array and not null/undefined
  const isValidArray = both(
    complement(val => val === null || val === undefined),
    is(Array)
  );

  // Initialize each tag as a property with a false value
  let tags = $state(
    reduce((acc, tag) => ({...acc, [tag]: false}), {}, toUniqArr(propPath, payload))
  );

  // Return selected tags only
  const activeTagNames = $derived(filter(tag => tags[tag], keys(tags)));

  // Display posts that includes selected tags
  const filterByTagNames = $derived(filterArrByString(propPath, activeTagNames));

  // Calculate tag counts safely
  const tagCounts = reduce(
    (acc, item) => {
      const tagsAtPath = path(propPath, item);
      // Only process if tagsAtPath exists and is an array
      if (isValidArray(tagsAtPath)) {
        forEach(tag => (acc[tag] = inc(defaultTo(0, acc[tag]))), tagsAtPath);
      }
      return acc;
    },
    {},
    payload
  );

  const toggleTag = tag =>
    pipe(
      tap(() => (tags[tag] = !tags[tag])), // toggle the value in the tags object
      tap(() => toggleEvent(activeTagNames.length ? filterByTagNames(payload) : payload, tag))
    )(tag);

  // Explicit tap implementation since Ramda's tap doesn't seem to be working correctly
  function tap(fn) {
    return x => {
      fn(x);
      return x;
    };
  }
</script>

<div class="tags">
  {#each keys(tags) as tag (tag)}
    <Badge
      onclick={() => toggleTag(tag)}
      label={tag}
      selected={tags[tag]}
      count={isTagCount ? tagCounts[tag] : undefined}
    />
  {/each}

  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="postcss">
  @import '$theme/theme.css' theme(reference);

  .tags {
    @apply flex flex-wrap gap-2;
  }
</style>
