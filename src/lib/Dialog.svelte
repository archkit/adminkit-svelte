<script lang="ts">
  import Modal from './Modal.svelte';
  import {
    getCurrentDialog,
    getDialogDefaults,
    settleDialog,
    type DialogRequest,
  } from './dialog-store.svelte.js';

  const current = $derived(getCurrentDialog());
  const defaults = $derived(getDialogDefaults());

  let shown = $state<DialogRequest | null>(null);
  let open = $state(false);
  let value = $state('');
  let cancelEl = $state<HTMLButtonElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);

  // キュー先頭の変化を表示状態へ反映する
  $effect(() => {
    if (current === shown) return;
    shown = current;
    open = current !== null;
    if (current) {
      value = current.initial ?? '';
      // prompt は入力欄へ。confirm は Enter 誤爆防止のため初期フォーカスをキャンセル側に置く
      requestAnimationFrame(() => {
        if (current.kind === 'prompt') inputEl?.focus();
        else cancelEl?.focus();
      });
    }
  });

  // Esc・背景クリックで Modal 側から閉じられた場合はキャンセル扱いで解決する
  // （ボタン経由で解決済みのときは settleDialog の id ガードで何もしない）
  $effect(() => {
    if (!open && shown) {
      settleDialog(shown.id, shown.kind === 'confirm' ? false : null);
    }
  });

  function cancel() {
    if (!shown) return;
    settleDialog(shown.id, shown.kind === 'confirm' ? false : null);
    open = false;
  }

  function submit() {
    if (!shown) return;
    settleDialog(shown.id, shown.kind === 'confirm' ? true : value);
    open = false;
  }
</script>

{#if shown}
  {#snippet titleHeader()}
    <h3>{shown?.title}</h3>
  {/snippet}
  <!-- {#key}: ダイアログごとに Modal（<dialog> 要素）を作り直す。前のダイアログの close
       イベントが次のダイアログ表示後に届いて誤キャンセルするのを防ぐ（連続表示・キュー対応） -->
  {#key shown.id}
    <Modal bind:open label={shown.title ?? shown.message} header={shown.title ? titleHeader : undefined}>
      <p class="message">{shown.message}</p>
      {#if shown.kind === 'prompt'}
        <form
          class="c-fields"
          onsubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            type="text"
            bind:this={inputEl}
            bind:value
            aria-label={shown.message}
            placeholder={shown.placeholder}
          />
        </form>
      {/if}
      {#snippet footer()}
        <button type="button" class="c-button" bind:this={cancelEl} onclick={cancel}>
          {shown?.cancelLabel ?? defaults.cancelLabel}
        </button>
        <button type="button" class="c-button {shown?.danger ? 'danger' : 'primary'}" onclick={submit}>
          {shown?.confirmLabel ?? defaults.confirmLabel}
        </button>
      {/snippet}
    </Modal>
  {/key}
{/if}

<style>
  .message {
    margin: 0;
    /* window.confirm 由来の複数行メッセージ（\n 区切り）をそのまま改行表示する */
    white-space: pre-line;
    overflow-wrap: break-word;
  }
  form {
    margin-top: 0.75rem;
  }
</style>
