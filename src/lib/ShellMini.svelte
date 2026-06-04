<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    nav: Snippet;
    sidebarFooter?: Snippet;
    shellFooter?: Snippet;
    children: Snippet;
  }

  let { title = 'adminkit', nav, sidebarFooter, shellFooter, children }: Props = $props();

  // ミニサイドバー: hover で入れ子 details を開く（adminkit.js と同挙動）。
  // アクティブページを含む details は mouseleave でも閉じない。summary クリックでの
  // トグルは抑止（開閉は hover が制御）。adminkit-svelte/PARITY.md 参照。
  function miniHover(navEl: HTMLElement) {
    const cleanups: (() => void)[] = [];
    for (const details of navEl.querySelectorAll<HTMLDetailsElement>('li > details')) {
      const li = details.parentElement;
      const summary = details.querySelector('summary');
      if (!li) continue;
      const enter = () => { details.open = true; };
      const leave = () => { if (!details.querySelector('[aria-current="page"]')) details.open = false; };
      const noToggle = (e: Event) => e.preventDefault();
      li.addEventListener('mouseenter', enter);
      li.addEventListener('mouseleave', leave);
      summary?.addEventListener('click', noToggle);
      cleanups.push(() => {
        li.removeEventListener('mouseenter', enter);
        li.removeEventListener('mouseleave', leave);
        summary?.removeEventListener('click', noToggle);
      });
    }
    return { destroy: () => cleanups.forEach((fn) => fn()) };
  }
</script>

<div class="shell" data-layout="mini">
  <aside class="shell-sidebar">
    <header>
      <span>{title}</span>
    </header>
    <nav aria-label="サイドバー" use:miniHover>
      {@render nav()}
    </nav>
    {#if sidebarFooter}
      <footer>
        {@render sidebarFooter()}
      </footer>
    {/if}
  </aside>

  <div class="shell-main">
    {@render children()}
    {#if shellFooter}
      <footer class="shell-footer">
        {@render shellFooter()}
      </footer>
    {/if}
  </div>
</div>
