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
  <path d="m5 8 6 6" />
  <path d="m4 14 6-6 2-3" />
  <path d="M2 5h12" />
  <path d="M7 2h1" />
  <path d="m22 22-5-10-5 10" />
  <path d="M14 18h6" />
</svg>
