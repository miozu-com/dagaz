<script>
  let {size = 56, color = 'currentColor', class: className = ''} = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 45 66"
  class={className}
  aria-label="Dagaz rune logo"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M12 0L28 25.0076L44 0V56L28 30.9924L12 56V0ZM26.0854 28L15.0236 10.7107V45.2893L26.0854 28ZM29.9146 28L40.9764 45.2893V10.7107L29.9146 28Z"
    fill={color}
  />
</svg>
