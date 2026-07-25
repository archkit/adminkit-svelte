<script lang="ts">
  import type { Snippet } from 'svelte';
  import CopyIcon from 'lucide-svelte/icons/copy';

  interface Props {
    /** コピーする文字列。空 / null のときはボタンを無効にする */
    text: string | null | undefined;
    /** aria-label（アイコンのみの表示になるため必須）。i18n はアプリ側で解決して渡す */
    label: string;
    variant?: 'primary' | 'success' | 'danger' | 'ghost';
    size?: 'small';
    disabled?: boolean;
    /** ボタン内に文字を出したいときの本文（省略時はアイコンのみ） */
    children?: Snippet;
    /**
     * コピー成功時。通知の文言はアプリ側（i18n）に残すため、ここでは何も表示しない。
     * copied にはコピーした文字列を渡すので、内容に応じて文言を出し分けられる。
     */
    oncopied?: (copied: string) => void;
    /** コピー失敗時（クリップボード権限なし・非セキュアコンテキスト等） */
    onfailed?: (error: unknown) => void;
  }

  let {
    text,
    label,
    variant = 'ghost',
    size = 'small',
    disabled = false,
    children,
    oncopied,
    onfailed,
  }: Props = $props();

  const cls = $derived(['c-button', variant, size].filter(Boolean).join(' '));
  const isDisabled = $derived(disabled || !text);

  async function copy() {
    const value = text;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      oncopied?.(value);
    } catch (error) {
      onfailed?.(error);
    }
  }
</script>

<button type="button" class={cls} aria-label={label} disabled={isDisabled} onclick={copy}>
  {#if children}
    <CopyIcon />{@render children()}
  {:else}
    <CopyIcon />
  {/if}
</button>
