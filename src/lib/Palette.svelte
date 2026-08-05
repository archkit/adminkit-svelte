<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * コマンドパレット（.c-palette）。画面の上寄りに出す、検索欄付きの一覧。
   *
   * **候補の絞り込みと上下移動は含まない**（何を候補にするかがアプリ固有のため）。
   * adminkit（バニラ）側も同じ範囲——CSS と dialog の開閉だけを持つ。
   * 利用側が `query` を購読して候補を差し替え、選択中の項目に aria-selected を付ける。
   *
   * 候補は children に <li> を並べて書く（.c-palette > section > ul の中身）。
   */
  interface Props {
    open: boolean;
    label: string;
    /** 検索欄の値。利用側で購読して候補を絞る */
    query?: string;
    placeholder?: string;
    /** 下端のキーヒント。省略すると footer 自体を出さない */
    hints?: Snippet;
    children: Snippet;
  }

  let {
    open = $bindable(),
    label,
    query = $bindable(''),
    placeholder = '検索',
    hints,
    children,
  }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  let input: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // 開いたら検索欄へ。パレットは打ち始められることが前提の部品
      input?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  function handleClose() {
    open = false;
  }

  function handleClick(e: MouseEvent) {
    // dialog 要素そのもの＝内側の section の外を押したときだけ閉じる
    if (e.target === dialog) {
      open = false;
    }
  }
</script>

<dialog
  bind:this={dialog}
  class="c-palette"
  aria-label={label}
  onclose={handleClose}
  onclick={handleClick}
>
  <section>
    <header>
      <input
        bind:this={input}
        bind:value={query}
        type="search"
        {placeholder}
        aria-label={label}
      />
    </header>
    <ul>
      {@render children()}
    </ul>
    {#if hints}
      <footer>
        {@render hints()}
      </footer>
    {/if}
  </section>
</dialog>
