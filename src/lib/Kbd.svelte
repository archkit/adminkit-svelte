<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * キーヒント（.c-kbd）。ショートカットのキーを 1 つ表す。
   * 複数キーの組み合わせは Kbd を並べて書く（<Kbd>⌘</Kbd><Kbd>K</Kbd>）。
   */
  interface Props {
    class?: string;
    children: Snippet;
    [key: string]: unknown;
  }

  let { children, class: className = '', ...rest }: Props = $props();

  const cls = $derived(['c-kbd', className].filter(Boolean).join(' '));
</script>

<kbd class={cls} {...rest}>{@render children()}</kbd>
