<script>
  let {size = 20, color = 'currentColor', strokeWidth = 2, class: className = ''} = $props();
</script>

<svg
  class={className}
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
    x1="4"
    x2="20"
    y1="18"
    y2="18"
  />
</svg>
