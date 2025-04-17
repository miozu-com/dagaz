import * as mdsvexLib from 'mdsvex';

export const code = await mdsvexLib.compile(
  `
<script>
  import Chart from './Chart.svelte';
</script>

# Hello friends

<Chart />
`,
  {extensions: ['svelte', 'js'], smartypants: true}
);
