<script lang="ts">
  import type { Snippet } from 'svelte';
  import Spinner from './Spinner.svelte';

  interface Props {
    /** モーダル内など面積の小さい領域で余白を詰める */
    compact?: boolean;
    /** スピナーの下に出す補足テキスト（省略可） */
    message?: string;
    /**
     * message を出さないときのスクリーンリーダー向けラベル。
     * message がある場合はそれが読み上げられるため使われない。
     */
    label?: string;
    children?: Snippet;
  }

  let { compact = false, message, label = '読み込み中', children }: Props = $props();

  const cls = $derived(compact ? 'c-loading-state compact' : 'c-loading-state');
</script>

<!-- message があるときはそれ自体が読み上げ対象なので、スピナーは装飾扱いにして二重読みを避ける -->
<div class={cls} role="status" aria-label={message ? undefined : label}>
  <Spinner size={compact ? undefined : 'large'} label={null} />
  {#if message}<p>{message}</p>{/if}
  {#if children}{@render children()}{/if}
</div>
