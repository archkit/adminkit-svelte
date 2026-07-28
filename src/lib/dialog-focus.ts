// ダイアログ表示直後の初期フォーカス先の判定。Dialog.svelte の中に埋めるとテストできないため、
// 純粋関数としてここに置く（runes を使わない .ts）。

/** 判定に必要な最小の形（dialog-store の DialogRequest が構造的に適合する）。 */
export interface FocusableDialog {
  kind: 'confirm' | 'prompt';
  requireText?: string;
}

/** 初期フォーカスの当て先。'none' はフォーカス操作をしない。 */
export type DialogFocusTarget = 'input' | 'cancel' | 'none';

/**
 * 表示したダイアログ `target` に対する初期フォーカス先を返す。
 *
 * フォーカスは requestAnimationFrame（次フレーム）で当てるが、**背面タブでは rAF が保留され、
 * 復帰時にまとめて実行される**。その間にダイアログが閉じられたり次のダイアログへ移っていると、
 * 実行時点の表示対象は `target` ではない。そのまま当てると別のダイアログの入力欄を触ってしまい、
 * 表示対象が無い（null）ときは参照エラーになる。そこで `current !== target` を 'none' に畳む。
 *
 * 表示中なら従来どおり、prompt と requireText 付き confirm は入力欄へ（requireText は一致するまで
 * 実行できないため Enter の誤爆が起きない）、通常の confirm は Enter 誤爆防止でキャンセル側へ。
 */
export function dialogFocusTarget(
  current: FocusableDialog | null | undefined,
  target: FocusableDialog,
): DialogFocusTarget {
  if (current !== target) return 'none';
  return current.kind === 'prompt' || current.requireText ? 'input' : 'cancel';
}
