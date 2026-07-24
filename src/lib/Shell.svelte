<script lang="ts">
  import type { Snippet } from 'svelte';
  import Menu from 'lucide-svelte/icons/menu';
  import Toast from './Toast.svelte';
  import Dialog from './Dialog.svelte';

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

  const layout = $derived(sub ? 'double' : 'sidebar');
</script>

<div class="shell" data-layout={layout} class:open>
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
