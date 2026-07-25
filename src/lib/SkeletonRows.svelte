<script lang="ts">
  interface Props {
    /** 表示する行数（既定 5） */
    rows?: number;
    /** 1 行あたりの列数（既定 1）。テーブルの列数に合わせるとずれが小さい */
    cols?: number;
    /** スクリーンリーダー向けのラベル。i18n するアプリは翻訳済みの文字列を渡す */
    label?: string;
  }

  let { rows = 5, cols = 1, label = '読み込み中' }: Props = $props();

  const rowList = $derived(Array.from({ length: Math.max(0, rows) }, (_, i) => i));
  const colList = $derived(Array.from({ length: Math.max(1, cols) }, (_, i) => i));
</script>

<!-- 個々のプレースホルダは装飾。読み上げはコンテナの role="status" に集約する -->
<div class="c-skeleton-rows" style="--cols: {colList.length}" aria-busy="true" role="status" aria-label={label}>
  {#each rowList as r (r)}
    <div>
      {#each colList as c (c)}
        <span class="c-skeleton text" aria-hidden="true"></span>
      {/each}
    </div>
  {/each}
</div>
