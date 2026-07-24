<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getHeadingLevel, setHeadingLevel } from './heading-level.js';

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

  function handleClick(e: MouseEvent) {
    if (e.target === dialog) {
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
