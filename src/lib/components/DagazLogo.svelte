<script>
  let {size = 56, color = 'currentColor', class: className = ''} = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 56 56"
  class={className}
  aria-label="Dagaz rune logo"
>
  <path d="M10 8V48L46 8V48L10 8Z" stroke={color} stroke-width="4.5" />
</svg>
