<script lang="ts">
  type Shape = 'text' | 'circle';

  interface Props {
    shape?: Shape;
    width?: string;
    height?: string;
    /**
     * スクリーンリーダー向けのラベル。i18n するアプリは翻訳済みの文字列を渡す。
     * `null` を渡すと装飾扱い（aria-hidden）になる — 親コンテナ側で読み込み中を
     * 伝えているときに使う。
     */
    label?: string | null;
  }

  let { shape, width, height, label = '読み込み中' }: Props = $props();

  const cls = $derived(
    ['c-skeleton', shape].filter(Boolean).join(' ')
  );

  const style = $derived(
    [width && `--w: ${width}`, height && `--h: ${height}`].filter(Boolean).join('; ') || undefined
  );
</script>

{#if label === null}
  <span class={cls} {style} aria-hidden="true"></span>
{:else}
  <span class={cls} {style} aria-label={label}></span>
{/if}
