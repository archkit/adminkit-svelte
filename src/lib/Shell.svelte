<script lang="ts">
  import type { Snippet } from 'svelte';
  import Menu from 'lucide-svelte/icons/menu';
  import Toast from './Toast.svelte';
  import Dialog from './Dialog.svelte';
  import { createBackdropDismiss } from './backdrop-dismiss.js';

  interface Props {
    title?: string;
    nav: Snippet;
    sidebarFooter?: Snippet;
    sub?: Snippet;
    shellFooter?: Snippet;
    children: Snippet;
  }

  let { title = 'adminkit', nav, sidebarFooter, sub, shellFooter, children }: Props = $props();

  let open = $state(false);

  // 狭い画面で開いたサイドバーは、外側（.shell::after の覆い）を押して閉じる（adminkit.js の
  // 「Sidebar toggle (mobile)」と同じ挙動）。覆いは疑似要素なので、押された要素は .shell 自身になる。
  // 押して離した位置の両方が覆いのときだけ閉じる判定は dialog 3 部品と共有（backdrop-dismiss.ts）
  let shell: HTMLDivElement;
  const backdrop = createBackdropDismiss();

  const layout = $derived(sub ? 'double' : 'sidebar');
</script>

<!-- 覆いを押して閉じるのはマウスの補助で、キーボードではサイドバーの見出しのボタンで閉じる -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  bind:this={shell}
  class="shell"
  data-layout={layout}
  class:open
  onmousedown={(e) => backdrop.down(open && e.target === shell)}
  onmouseup={(e) => backdrop.up(open && e.target === shell)}
  onclick={(e) => {
    if (backdrop.shouldDismiss(open && e.target === shell)) open = false;
  }}
>
  <div class="mobile-header">
    <span>{title}</span>
    <button onclick={() => open = !open} aria-label="メニュー"><Menu /></button>
  </div>

  <aside class="shell-sidebar">
    <header>
      <span>{title}</span>
      <button data-js-sidebar onclick={() => open = false} aria-label="メニュー"><Menu /></button>
    </header>
    <nav aria-label="サイドバー">
      {@render nav()}
    </nav>
    {#if sidebarFooter}
      <footer>
        {@render sidebarFooter()}
      </footer>
    {/if}
  </aside>

  {#if sub}
    <aside class="shell-sub-sidebar">
      {@render sub()}
    </aside>
  {/if}

  <div class="shell-main">
    {@render children()}
    {#if shellFooter}
      <footer class="shell-footer">
        {@render shellFooter()}
      </footer>
    {/if}
  </div>
</div>
<Toast />
<Dialog />
