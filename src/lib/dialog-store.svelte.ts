export interface ConfirmDialogOptions {
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 削除など破壊的操作は true（実行ボタンが danger 表示になる） */
  danger?: boolean;
}

export interface PromptDialogOptions {
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 入力欄の初期値 */
  initial?: string;
  placeholder?: string;
}

export interface DialogRequest {
  id: number;
  kind: 'confirm' | 'prompt';
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  initial?: string;
  placeholder?: string;
  resolve: (value: boolean | string | null) => void;
}

// 表示待ちキュー。先頭が表示中のダイアログ（Dialog.svelte が描画する）
let queue = $state<DialogRequest[]>([]);
let nextId = 0;

// ボタンラベルの既定値。i18n するアプリはレイアウトで setDialogDefaults を呼んで差し替える
let defaults = $state({ confirmLabel: 'OK', cancelLabel: 'キャンセル' });

export function setDialogDefaults(labels: { confirmLabel?: string; cancelLabel?: string }) {
  defaults = { ...defaults, ...labels };
}

export function getDialogDefaults() {
  return defaults;
}

export function getCurrentDialog(): DialogRequest | null {
  return queue[0] ?? null;
}

/**
 * window.confirm の置き換え。OK なら true、キャンセル（Esc・背景クリック含む）なら false。
 * ホストの Dialog は Shell / ShellTopnav に内蔵済み。
 */
export function confirmDialog(opts: ConfirmDialogOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    queue.push({ id: nextId++, kind: 'confirm', ...opts, resolve: resolve as DialogRequest['resolve'] });
  });
}

/**
 * window.prompt の置き換え。確定なら入力文字列、キャンセル（Esc・背景クリック含む）なら null。
 */
export function promptDialog(opts: PromptDialogOptions): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    queue.push({ id: nextId++, kind: 'prompt', ...opts, resolve: resolve as DialogRequest['resolve'] });
  });
}

/**
 * 先頭のダイアログを結果付きで閉じる（Dialog.svelte 用）。
 * id が先頭と一致しないときは何もしない（閉じる経路が二重に走っても二重解決しないための防御）。
 */
export function settleDialog(id: number, value: boolean | string | null) {
  const current = queue[0];
  if (!current || current.id !== id) return;
  queue.shift();
  current.resolve(value);
}
