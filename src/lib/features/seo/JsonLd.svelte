<!--
     JsonLd Component - Implements structured data for SEO

     This component generates JSON-LD structured data that helps search engines
     better understand your content. JSON-LD is Google's recommended format for
     structured data.

     Usage:
     <JsonLd type="WebSite" data={{name: "My Site", url: "https://example.com"}} />

     @prop {Object} data - The structured data object to include
     @prop {String} type - The Schema.org type (WebSite, Organization, Article, etc.) -->

<script>
  let {data = {}, type = ''} = $props();

  // Generate the structured data content
  const jsonLdContent = $derived(() => {
    if (!type || Object.keys(data).length === 0) {
      console.warn('JsonLd component requires both type and data props');
      return '';
    }

    // Create the JSON-LD structure with proper Schema.org context
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    // Return stringified JSON with proper escaping
    return JSON.stringify(jsonld);
  });
</script>

{#if jsonLdContent}
  {@html `<script type="application/ld+json">${jsonLdContent}</script>`}
{/if}
