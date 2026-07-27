<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDetailsElement> {
    /** 見出し（summary に出す文字列）。header スニペットを渡した場合は使われない */
    label?: string;
    /** 見出しの右に薄く添える補足（件数・接続先など） */
    note?: string;
    /** 開いているか。bind:open で外から制御できる */
    open?: boolean;
    /** 中身の余白を外して境界線で仕切る（表をそのまま入れるとき） */
    flush?: boolean;
    /** summary を自分で組み立てる場合に使う（label の代わり） */
    header?: Snippet;
    children: Snippet;
  }

  let {
    label,
    note,
    open = $bindable(false),
    flush = false,
    header,
    children,
    class: className = '',
    ...rest
  }: Props = $props();

  const cls = $derived(['c-accordion', className].filter(Boolean).join(' '));
</script>

<details class={cls} bind:open {...rest}>
  <summary>
    {#if header}
      {@render header()}
    {:else}
      <span>{label}</span>
      {#if note}<span class="muted">{note}</span>{/if}
    {/if}
  </summary>
  <div class={flush ? 'content flush' : 'content'}>
    {@render children()}
  </div>
</details>
