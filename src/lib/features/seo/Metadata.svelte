<!--
  Metadata.svelte - Comprehensive SEO metadata component

  This component handles all the metadata needed for proper SEO:
  - Basic meta tags (title, description)
  - Open Graph tags for social sharing
  - Twitter Card tags
  - Canonical URLs
  - Meta robots directives
  - Language and locale
-->
<script>
  /**
   * @typedef {Object} MetadataProps
   * @property {string} title - Page title
   * @property {string} description - Page description
   * @property {string} [canonicalUrl] - Canonical URL
   * @property {string} [ogType='website'] - Open Graph type (website, article, etc.)
   * @property {string} [ogImage] - Open Graph image URL
   * @property {string} [ogImageAlt] - Open Graph image alt text
   * @property {Object} [ogImageDimensions] - Open Graph image dimensions (width/height)
   * @property {string} [twitterCard='summary_large_image'] - Twitter card type
   * @property {string} [author] - Content author
   * @property {string} [publishedTime] - Article published time (ISO format)
   * @property {string} [modifiedTime] - Article modified time (ISO format)
   * @property {string[]} [keywords] - SEO keywords
   * @property {string} [robots] - Meta robots directives
   * @property {string} [locale='en'] - Content locale
   */

  /** @type {MetadataProps} */
  let {
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    ogImage,
    ogImageAlt,
    ogImageDimensions = {width: 1200, height: 630},
    twitterCard = 'summary_large_image',
    author,
    publishedTime,
    modifiedTime,
    keywords,
    robots,
    locale = 'en'
  } = $props();

  // Format for Open Graph tags
  const domain = canonicalUrl ? new URL(canonicalUrl).origin : '';
</script>

<svelte:head>
  <!-- Basic Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords && keywords.length > 0}
    <meta name="keywords" content={keywords.join(', ')} />
  {/if}
  {#if author}
    <meta name="author" content={author} />
  {/if}
  {#if robots}
    <meta name="robots" content={robots} />
  {/if}

  <!-- Language -->
  <meta property="og:locale" content={locale} />

  <!-- Canonical URL -->
  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={ogType} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {#if canonicalUrl}
    <meta property="og:url" content={canonicalUrl} />
  {/if}
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    {#if ogImageAlt}
      <meta property="og:image:alt" content={ogImageAlt} />
    {/if}
    <meta property="og:image:width" content={ogImageDimensions.width} />
    <meta property="og:image:height" content={ogImageDimensions.height} />
  {/if}
  {#if domain}
    <meta property="og:site_name" content={domain} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
    {#if ogImageAlt}
      <meta name="twitter:image:alt" content={ogImageAlt} />
    {/if}
  {/if}

  <!-- Article specific metadata -->
  {#if ogType === 'article'}
    {#if publishedTime}
      <meta property="article:published_time" content={publishedTime} />
    {/if}
    {#if modifiedTime}
      <meta property="article:modified_time" content={modifiedTime} />
    {/if}
    {#if author}
      <meta property="article:author" content={author} />
    {/if}
  {/if}
</svelte:head>
