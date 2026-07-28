<script lang="ts">
  import DialogShell from './DialogShell.svelte';
  import { getCurrentDialog, getDialogDefaults, settleDialog } from './dialog-store.svelte.js';

  const current = $derived(getCurrentDialog());
  const defaults = $derived(getDialogDefaults());
</script>

{#if current}
  <!-- {#key}: ダイアログごとに DialogShell（＝<dialog> 要素と表示状態）を作り直す。
       <dialog> の close イベントは非同期に届くため、表示状態を per-dialog に閉じ込めないと、
       閉じたダイアログの close が次のダイアログを誤ってキャンセルする（逐次表示の 2 件目が
       表示されないまま false になる）。解決は id 付きで受け、古いインスタンスからのものは
       settleDialog の id ガードで弾く -->
  {#key current.id}
    <DialogShell
      req={current}
      {defaults}
      onsettle={(id, value) => settleDialog(id, value)}
    />
  {/key}
{/if}
