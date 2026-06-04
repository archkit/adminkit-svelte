<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getHeadingLevel, setHeadingLevel } from './heading-level.js';

  interface Tab {
    id: string;
    label: string;
    content: Snippet;
  }

  interface Props {
    tabs: Tab[];
    active?: string;
    label: string;
  }

  let { tabs, active = $bindable(tabs[0]?.id), label }: Props = $props();

  // tabpanel 内の Section はタブの親セクションと同レベルで始まる
  // （タブ自体はセクショニング要素ではないが、内容は独立したセクション群）
  const parentLevel = getHeadingLevel();
  setHeadingLevel(parentLevel);

  function handleKeydown(e: KeyboardEvent) {
    const btns = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')];
    const idx = tabs.findIndex(t => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    active = tabs[next].id;
    btns[next]?.focus();
  }
</script>

<div class="c-tabs">
  <div role="tablist" aria-label={label} onkeydown={handleKeydown}>
    {#each tabs as tab}
      <button
        role="tab"
        aria-selected={tab.id === active}
        tabindex={tab.id === active ? 0 : -1}
        onclick={() => active = tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  {#each tabs as tab}
    <div role="tabpanel" hidden={tab.id !== active}>
      {@render tab.content()}
    </div>
  {/each}
</div>
