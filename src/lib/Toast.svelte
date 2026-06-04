<script lang="ts">
  import { getToasts, dismiss, pauseAll, resumeAll } from './toast-store.svelte.js';

  const toasts = $derived(getToasts());
</script>

{#if toasts.length > 0}
  <div class="c-toast-container" role="region" aria-label="通知" onmouseenter={pauseAll} onmouseleave={resumeAll}>
    {#each toasts as toast (toast.id)}
      <output class="c-toast {toast.variant}" role={toast.variant === 'danger' ? 'alert' : 'status'} aria-live={toast.variant === 'danger' ? 'assertive' : 'polite'}>
        <div class="c-toast-body">
          <strong>{toast.title}</strong>
          {#if toast.message}<p>{toast.message}</p>{/if}
          {#if toast.action}
            <button class="c-toast-action" onclick={toast.action.onClick}>{toast.action.label}</button>
          {/if}
        </div>
        <button class="c-toast-close" onclick={() => dismiss(toast.id)} aria-label="閉じる">&times;</button>
        {#if toast.variant !== 'danger' && toast.duration}
          <div class="c-toast-progress" aria-hidden="true" style="animation-duration: {toast.duration}ms"></div>
        {/if}
      </output>
    {/each}
  </div>
{/if}
