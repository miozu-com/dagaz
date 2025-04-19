/**
 * Calculate approximate read time based on content length
 */
function calculateReadTime(content) {
  if (!content) return 1;

  // Average reading speed: 200 words per minute
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
