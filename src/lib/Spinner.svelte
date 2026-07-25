<script lang="ts">
  type Size = 'small' | 'large';

  interface Props {
    size?: Size;
    /** ボタン内など背景色が一定でない場所で currentColor に合わせる */
    current?: boolean;
    /**
     * スクリーンリーダー向けのラベル。i18n するアプリは翻訳済みの文字列を渡す。
     * `null` を渡すと装飾扱い（aria-hidden）になる — 周囲に読み込み中を伝える
     * テキストが別途あるときに使う。
     */
    label?: string | null;
  }

  let { size, current = false, label = '読み込み中' }: Props = $props();

  const cls = $derived(['c-spinner', size, current && 'current'].filter(Boolean).join(' '));
</script>

{#if label === null}
  <span class={cls} aria-hidden="true"></span>
{:else}
  <span class={cls} role="status" aria-label={label}></span>
{/if}
