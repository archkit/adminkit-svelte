<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * 情報行（.c-list.rows > li）。1 項目を「先頭マーク / 主・副テキスト / 数値 / 末尾」の
   * 4 スロットで組む。List に variants={['rows']} を付けた中で使う。
   *
   * スロットは全て任意。body だけの行も成立する。
   */
  interface Props {
    /** 先頭マーク（状態の粒・アイコン・アバター） */
    lead?: Snippet;
    /** 主テキスト */
    title?: string;
    /** 副テキスト（等幅・識別子や補足） */
    sub?: string;
    /** 数値（等幅・桁が揃う） */
    value?: string;
    /** 末尾（状態の札・操作ボタン） */
    trail?: Snippet;
    /** 行の状態。左端の内側の線で示す */
    state?: 'selected' | 'danger';
    /** title / sub の代わりに本体を自由に書くとき（title より優先） */
    children?: Snippet;
    class?: string;
    [key: string]: unknown;
  }

  let { lead, title, sub, value, trail, state, children, class: className = '', ...rest }: Props =
    $props();

  const cls = $derived([state, className].filter(Boolean).join(' '));
</script>

<li class={cls || undefined} {...rest}>
  {#if lead}<span class="lead">{@render lead()}</span>{/if}
  <span class="body">
    {#if children}
      {@render children()}
    {:else}
      {#if title !== undefined}<span class="title">{title}</span>{/if}
      {#if sub !== undefined}<span class="sub">{sub}</span>{/if}
    {/if}
  </span>
  {#if value !== undefined}<span class="value">{value}</span>{/if}
  {#if trail}<span class="trail">{@render trail()}</span>{/if}
</li>
