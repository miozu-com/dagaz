<!--
     BreadcrumbsSchema Component - Implements breadcrumb structured data

     This component generates JSON-LD structured data for breadcrumb navigation.
     Helps search engines understand your site structure and improves search results.

     Usage:
     <BreadcrumbsSchema items={[
                                { name: 'Home', url: '/' },
                                { name: 'Blog', url: '/blog' },
                                { name: 'Post Title', url: '/blog/post-slug' }
                                ]} />

     @prop {Array} items - Array of breadcrumb items with name and url properties -->

<script>
  import JsonLd from './JsonLd.svelte';

  let {items = []} = $props();

  // Process items for schema format
  const schemaItems = $derived(() => {
    return items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }));
  });

  // Breadcrumb schema data
  const breadcrumbData = $derived(() => {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: schemaItems
    };
  });
</script>

<JsonLd type="BreadcrumbList" data={breadcrumbData} />
