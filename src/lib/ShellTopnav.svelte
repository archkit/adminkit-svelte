<script lang="ts">
  import type { Snippet } from 'svelte';
  import Toast from './Toast.svelte';
  import Dialog from './Dialog.svelte';

  interface Props {
    title?: string;
    nav: Snippet;
    actions?: Snippet;
    children: Snippet;
  }

  let { title = 'adminkit', nav, actions, children }: Props = $props();
</script>

<div class="shell" data-layout="topnav">
  <header class="shell-topnav">
    <span class="logo">{title}</span>
    <nav aria-label="メインナビゲーション">
      {@render nav()}
    </nav>
    {#if actions}
      <div class="actions">
        {@render actions()}
      </div>
    {/if}
  </header>

  <div class="shell-main">
    {@render children()}
  </div>
</div>
<Toast />
<Dialog />
