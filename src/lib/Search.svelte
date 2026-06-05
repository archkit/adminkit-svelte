<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import SearchIcon from 'lucide-svelte/icons/search';

  type Size = 'small';

  interface Props extends Omit<HTMLInputAttributes, 'size'> {
    size?: Size;
    value?: string;
  }

  let { size, value = $bindable(''), class: className = '', ...rest }: Props = $props();

  const cls = $derived(
    ['c-search', size === 'small' && 'small', className].filter(Boolean).join(' ')
  );
</script>

<div class={cls}>
  <SearchIcon />
  <input type="search" bind:value {...rest}>
</div>
