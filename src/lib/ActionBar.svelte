<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    count: number;
    sticky?: boolean;
    /** 画面下部の中央に小さく重ねて出す（.c-action-bar.floating）。true のときは sticky を使わない */
    floating?: boolean;
    /** バーの読み上げ用の名前（aria-label）。既定は「一括操作」 */
    label?: string;
    /** 件数の表示。件数を受け取って組む。既定は「<strong>N</strong>件選択中」（表示言語を切り替える画面で渡す） */
    summary?: Snippet<[number]>;
    children: Snippet;
  }

  let { count, sticky = true, floating = false, label = '一括操作', summary, children }: Props = $props();

  const cls = $derived(
    ['c-action-bar', floating ? 'floating' : sticky && 'sticky'].filter(Boolean).join(' ')
  );
</script>

{#if count > 0}
  <div class={cls} role="toolbar" aria-label={label}>
    {#if summary}
      <span>{@render summary(count)}</span>
    {:else}
      <span><strong>{count}</strong>件選択中</span>
    {/if}
    <div class="l-cluster">
      {@render children()}
    </div>
  </div>
{/if}
