<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getHeadingLevel, setHeadingLevel } from './heading-level.js';
  import { createBackdropDismiss } from './backdrop-dismiss.js';

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
    /** 'wide' で本文の領域いっぱい（サイドバーを除く・上限 80rem。1 件を長く読むとき）。既定は 25rem */
    size?: 'default' | 'wide';
    /** 画面の端から少し離して出す（角を丸め、線で縁取る） */
    inset?: boolean;
    /** 本文の余白を 0 にし縦に並べる。中身が余白・並べ方・スクロールを自分で持つとき（header / footer を使わない画面など） */
    flush?: boolean;
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let {
    open = $bindable(),
    label,
    size = 'default',
    inset = false,
    flush = false,
    header,
    footer,
    children,
  }: Props = $props();

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

  // 内側の section の外＝背景を「押して離した」ときだけ閉じる。判定の実体は backdrop-dismiss.ts
  // （click の target だけで見ると、入力の中で押して背景で離すドラッグでも閉じ、編集中の入力を捨てる）
  const backdrop = createBackdropDismiss();

  function handleMouseDown(e: MouseEvent) {
    backdrop.down(e.target === dialog);
  }

  function handleMouseUp(e: MouseEvent) {
    backdrop.up(e.target === dialog);
  }

  function handleClick(e: MouseEvent) {
    if (backdrop.shouldDismiss(e.target === dialog)) {
      open = false;
    }
  }
</script>

<dialog
  bind:this={dialog}
  class="c-drawer"
  class:wide={size === 'wide'}
  class:inset
  class:flush
  aria-label={label}
  onclose={handleClose}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
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
