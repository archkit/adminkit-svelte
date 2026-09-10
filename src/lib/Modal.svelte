<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getHeadingLevel, setHeadingLevel } from './heading-level.js';
  import { createBackdropDismiss } from './backdrop-dismiss.js';

  // Modal 内の見出しは親セクションのレベルを引き継ぐ
  setHeadingLevel(getHeadingLevel());

  interface Props {
    open: boolean;
    label: string;
    /** 幅バリアント。'wide'（max-width: 48rem）は表・コード・長文など既定幅（32rem）に収まらないコンテンツ用 */
    size?: 'default' | 'wide';
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { open = $bindable(), label, size = 'default', header, footer, children }: Props = $props();

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
  class="c-modal"
  class:wide={size === 'wide'}
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
