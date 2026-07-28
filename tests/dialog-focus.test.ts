import { describe, expect, it } from 'vitest';
import { dialogFocusTarget, type FocusableDialog } from '../src/lib/dialog-focus.js';

// ダイアログ表示直後の初期フォーカス先。rAF は背面タブで保留され復帰時にまとめて実行されるため、
// 「実行時点でそのダイアログがまだ表示中か」を必ず確かめる。ここが緩むと、閉じたあとに届いた
// フォーカス操作が null を触って例外になり、連続表示（confirm → confirm）が壊れる。

const confirmReq: FocusableDialog = { kind: 'confirm' };
const promptReq: FocusableDialog = { kind: 'prompt' };
const requireTextReq: FocusableDialog = { kind: 'confirm', requireText: 'my-workspace' };

describe('dialogFocusTarget', () => {
  it('通常の confirm はキャンセル側へ（Enter 誤爆防止）', () => {
    expect(dialogFocusTarget(confirmReq, confirmReq)).toBe('cancel');
  });

  it('prompt は入力欄へ', () => {
    expect(dialogFocusTarget(promptReq, promptReq)).toBe('input');
  });

  it('requireText 付き confirm は入力欄へ（一致するまで実行できないため誤爆しない）', () => {
    expect(dialogFocusTarget(requireTextReq, requireTextReq)).toBe('input');
  });

  it('表示対象が無い（閉じられた）ときは何もしない', () => {
    expect(dialogFocusTarget(null, confirmReq)).toBe('none');
    expect(dialogFocusTarget(undefined, promptReq)).toBe('none');
  });

  it('別のダイアログへ移っていたら何もしない（前のダイアログのフォーカスを当てない）', () => {
    expect(dialogFocusTarget(promptReq, confirmReq)).toBe('none');
    expect(dialogFocusTarget(confirmReq, promptReq)).toBe('none');
  });

  it('同じ形でも別インスタンスなら当てない（同一リクエストだけを対象にする）', () => {
    expect(dialogFocusTarget({ kind: 'confirm' }, confirmReq)).toBe('none');
  });
});
