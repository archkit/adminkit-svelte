<script lang="ts">
  import Modal from './Modal.svelte';
  import { getCurrentDialog, type DialogRequest } from './dialog-store.svelte.js';
  import { canSubmitDialog } from './dialog-guard.js';
  import { dialogFocusTarget } from './dialog-focus.js';

  interface Props {
    /** 表示するリクエスト。Dialog 側の {#key} で作り直されるため、この値は生存期間中不変 */
    req: DialogRequest;
    defaults: { confirmLabel: string; cancelLabel: string };
    /** 解決を親へ渡す。自分の id を必ず添える（古いインスタンスからの解決を弾くため） */
    onsettle: (id: number, value: boolean | string | null) => void;
  }

  let { req, defaults, onsettle }: Props = $props();

  // 表示状態は **このダイアログ専用**。<dialog> の close イベントは非同期に届くため、
  // 状態を Dialog 側で共有していると、閉じたダイアログの close が次のダイアログを
  // 誤ってキャンセルしていた（逐次表示で 2 件目が即 false になる不具合）
  let open = $state(true);
  let value = $state(req.initial ?? '');
  let cancelEl = $state<HTMLButtonElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);

  // requireText: 指定文字列と完全一致するまで実行ボタンを無効にする（取り返しのつかない操作の確認）
  const needsText = $derived(req.kind === 'confirm' && !!req.requireText);
  const showInput = $derived(req.kind === 'prompt' || needsText);
  const canSubmit = $derived(canSubmitDialog(req.requireText, value));

  /** キャンセル時の戻り値（confirm は false・prompt は null） */
  const cancelledValue = () => (req.kind === 'confirm' ? false : null);

  // 初期フォーカス。prompt と requireText 付き confirm は入力欄へ、通常の confirm は Enter の
  // 誤爆防止でキャンセル側へ（判定と、保留された rAF の扱いは dialog-focus.ts）
  $effect(() => {
    requestAnimationFrame(() => {
      const focus = dialogFocusTarget(getCurrentDialog(), req);
      if (focus === 'input') inputEl?.focus();
      else if (focus === 'cancel') cancelEl?.focus();
    });
  });

  // Esc・背景クリックで Modal 側から閉じられた場合もキャンセル扱いで解決する
  // （ボタン経由で解決済みのときは settleDialog の id ガードで二重にならない）
  $effect(() => {
    if (!open) onsettle(req.id, cancelledValue());
  });

  function cancel() {
    onsettle(req.id, cancelledValue());
    open = false;
  }

  function submit() {
    if (!canSubmit) return;
    onsettle(req.id, req.kind === 'confirm' ? true : value);
    open = false;
  }
</script>

{#snippet titleHeader()}
  <h3>{req.title}</h3>
{/snippet}

<Modal bind:open label={req.title ?? req.message} header={req.title ? titleHeader : undefined}>
  <p class="message">{req.message}</p>
  {#if showInput}
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
        aria-label={req.message}
        placeholder={req.requireText ?? req.placeholder}
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </form>
  {/if}
  {#snippet footer()}
    <button type="button" class="c-button" bind:this={cancelEl} onclick={cancel}>
      {req.cancelLabel ?? defaults.cancelLabel}
    </button>
    <button
      type="button"
      class="c-button {req.danger ? 'danger' : 'primary'}"
      disabled={!canSubmit}
      onclick={submit}
    >
      {req.confirmLabel ?? defaults.confirmLabel}
    </button>
  {/snippet}
</Modal>

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
