<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getHeadingLevel, setHeadingLevel } from './heading-level.js';

  /**
   * ドロワー（.c-drawer）。画面の右端に固定して出す縦長のパネル。
   * 一覧を表示したまま 1 件の詳細や編集を出すときに使う。
   *
   * 開閉機構・内部構造は Modal と同じ（dialog 要素・背景クリックで閉じる・esc は既定挙動）。
   * 判断を 1 つ求めて閉じるだけなら Modal を使う。
   */

  // Drawer 内の見出しは親セクションのレベルを引き継ぐ（Modal と同じ）
  setHeadingLevel(getHeadingLevel());

  interface Props {
    open: boolean;
    label: string;
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { open = $bindable(), label, header, footer, children }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
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
  class="c-drawer"
  aria-label={label}
  onclose={handleClose}
  onclick={handleClick}
>
  <section>
    {#if header}
      <header>
        {@render header()}
        <button class="c-button ghost small" onclick={() => open = false} aria-label="閉じる">
          ✕
        </button>
      </header>
    {/if}
    <div class="body">
      {@render children()}
    </div>
    {#if footer}
      <footer>
        {@render footer()}
      </footer>
    {/if}
  </section>
</dialog>
