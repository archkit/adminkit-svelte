<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    trigger: Snippet<[string]>;
    menu: Snippet;
  }

  let { trigger, menu }: Props = $props();

  const id = `dropdown-${Math.random().toString(36).slice(2, 9)}`;

  let root: HTMLDivElement;
  let menuEl: HTMLUListElement;

  // FALLBACK(css-anchor-positioning): position-area 非対応ブラウザ（主に Firefox・旧 Safari/iOS）では
  // position-area が無視され、トップレイヤーの popover がボタンから外れて表示される。その場合のみ JS 配置。
  // 撤去条件: 対象ブラウザがすべて CSS anchor positioning に対応したら、この分岐と positionDropdown() を
  // 削除し CSS の position-area に一本化する。adminkit 本体の同名フォールバックと対（adminkit-svelte/PARITY.md 参照）。
  let supportsAnchor: boolean | undefined;
  const anchorSupported = () =>
    (supportsAnchor ??= CSS.supports('position-area: bottom span-left'));

  const getTrigger = (): HTMLElement | null => root?.querySelector(`[popovertarget="${id}"]`);

  function positionDropdown(t: HTMLElement) {
    const r = t.getBoundingClientRect();
    menuEl.style.position = 'fixed';
    menuEl.style.margin = '0';
    menuEl.style.top = `${r.bottom + 4}px`;
    // position-area: bottom span-left 相当（アンカー右端に右揃え・画面左端で clamp）
    menuEl.style.left = `${Math.max(4, r.right - menuEl.offsetWidth)}px`;
  }

  function onToggle(e: ToggleEvent) {
    const open = e.newState === 'open';
    const t = getTrigger();
    t?.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!anchorSupported() && t) positionDropdown(t);
      const first = menuEl.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
      if (first) requestAnimationFrame(() => first.focus());
    }
  }

  function onKeydown(e: KeyboardEvent) {
    const items = [...menuEl.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')];
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = idx < items.length - 1 ? idx + 1 : 0;
    else if (e.key === 'ArrowUp') next = idx > 0 ? idx - 1 : items.length - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next].focus();
    }
  }
</script>

<div class="c-dropdown" bind:this={root}>
  {@render trigger(id)}
  <ul popover {id} role="menu" bind:this={menuEl} ontoggle={onToggle} onkeydown={onKeydown}>
    {@render menu()}
  </ul>
</div>
