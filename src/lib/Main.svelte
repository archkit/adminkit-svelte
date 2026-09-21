<script lang="ts">
  import type { Snippet } from 'svelte';
  import House from 'lucide-svelte/icons/house';
  import { setHeadingLevel } from './heading-level.js';

  interface Crumb {
    label: string;
    href?: string;
  }

  type ContentWidth = 'normal' | 'full' | 'wide' | 'center';

  interface Props {
    crumbs?: Crumb[];
    actions?: Snippet;
    width?: ContentWidth;
    bar?: Snippet;
    children: Snippet;
  }

  let { crumbs = [], actions, width, bar, children }: Props = $props();

  // main は h1 を含むのでレベル1を設定
  setHeadingLevel(1);

  const contentCls = $derived(
    ['l-stack', 'main-content', width].filter(Boolean).join(' ')
  );
</script>

<main id="main">
  <nav class="main-nav" aria-label="パンくず">
    <ol class="c-breadcrumb">
      <li><a href="/" aria-label="ダッシュボード"><House /></a></li>
      {#each crumbs as crumb, i}
        {#if i === crumbs.length - 1}
          <li aria-current="page">{crumb.label}</li>
        {:else}
          <li><a href={crumb.href ?? '#'}>{crumb.label}</a></li>
        {/if}
      {/each}
    </ol>
    {#if actions}
      <div class="l-cluster">
        {@render actions()}
      </div>
    {/if}
  </nav>

  <div class={contentCls}>
    {@render children()}
  </div>
  {#if bar}
    {@render bar()}
  {/if}
</main>
