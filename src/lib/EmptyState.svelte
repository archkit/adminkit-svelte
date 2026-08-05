<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getHeadingLevel, setHeadingLevel } from './heading-level.js';

  interface Props {
    heading?: string;
    icon?: Snippet;
    /**
     * error … 取得に失敗したとき。寸法は空のときと同じまま印だけ変わる
     * （空 / 読み込み中（LoadingState）/ 失敗 を同じ高さで置き換えられる）
     */
    variant?: 'error';
    /** モーダル・ドロワー内など面積の小さい領域で余白を詰める。LoadingState と同じ値 */
    compact?: boolean;
    children: Snippet;
  }

  let { heading, icon, variant, compact = false, children }: Props = $props();

  const level = getHeadingLevel() + 1;
  setHeadingLevel(level);

  const cls = $derived(
    ['c-empty-state', variant, compact && 'compact'].filter(Boolean).join(' ')
  );
</script>

<div class={cls}>
  {#if icon}{@render icon()}{/if}
  {#if heading}
    {#if level === 2}
      <h2>{heading}</h2>
    {:else if level === 3}
      <h3>{heading}</h3>
    {:else}
      <h4>{heading}</h4>
    {/if}
  {/if}
  {@render children()}
</div>
