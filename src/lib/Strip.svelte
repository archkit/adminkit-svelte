<script module lang="ts">
  /**
   * 時間の帯（.c-strip）。等間隔のセル列＝時間、色＝状態、高さ＝量を一度に見せる。
   * 粒度（20 分 / 1 日 / 1 週）が変わっても読み方は変わらない。
   */
  export type StripVariant = 'success' | 'warning' | 'danger';

  export interface StripCell {
    /** セルの高さ（%）。量を表す */
    height: number;
    variant?: StripVariant;
    /** セルにあてる説明（title 属性）。時刻や件数を添えるとき */
    title?: string;
  }
</script>

<script lang="ts">
  interface Props {
    cells: StripCell[];
    /** 行の中や小さいカードに添えるとき */
    compact?: boolean;
    /** 読み上げ用のラベル */
    label: string;
    /** 目盛の左端（例 "90 日前"）。from と to の両方を渡すと目盛が出る */
    from?: string;
    /** 目盛の右端（例 "今日"） */
    to?: string;
    class?: string;
    [key: string]: unknown;
  }

  let { cells, compact = false, label, from, to, class: className = '', ...rest }: Props = $props();

  const cls = $derived(
    ['c-strip', compact && 'compact', className].filter(Boolean).join(' ')
  );
</script>

<div class={cls} role="img" aria-label={label} {...rest}>
  {#each cells as cell}
    <span class={cell.variant} style="height: {cell.height}%" title={cell.title}></span>
  {/each}
</div>
{#if from !== undefined && to !== undefined}
  <div class="c-strip-axis"><span>{from}</span><span>{to}</span></div>
{/if}
