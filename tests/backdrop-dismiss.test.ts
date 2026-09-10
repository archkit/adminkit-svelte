import { describe, expect, it } from 'vitest';
import { createBackdropDismiss } from '../src/lib/backdrop-dismiss.js';

// Modal / Drawer / Palette の「背景を押して閉じる」判定。
// 編集中の入力を確認も通知も無しに捨てないよう固定する。
// 引数は「その MouseEvent の target が背景（dialog 要素そのもの）だったか」。

describe('createBackdropDismiss', () => {
  it('背景で押して背景で離したら閉じる', () => {
    const backdrop = createBackdropDismiss();
    backdrop.down(true);
    backdrop.up(true);
    expect(backdrop.shouldDismiss(true)).toBe(true);
  });

  it('中で押して背景で離したら閉じない（入力値を選択して置き換えるドラッグ）', () => {
    const backdrop = createBackdropDismiss();
    backdrop.down(false);
    backdrop.up(true);
    // click は mousedown と mouseup の共通祖先＝dialog に飛ぶので、click の target は背景になる
    expect(backdrop.shouldDismiss(true)).toBe(false);
  });

  it('背景で押して中で離したら閉じない', () => {
    const backdrop = createBackdropDismiss();
    backdrop.down(true);
    backdrop.up(false);
    expect(backdrop.shouldDismiss(true)).toBe(false);
  });

  it('中で押して中で離したら閉じない（通常の操作）', () => {
    const backdrop = createBackdropDismiss();
    backdrop.down(false);
    backdrop.up(false);
    expect(backdrop.shouldDismiss(false)).toBe(false);
  });

  it('mousedown / mouseup を伴わない click では閉じない', () => {
    const backdrop = createBackdropDismiss();
    expect(backdrop.shouldDismiss(true)).toBe(false);
  });

  it('判定に使った記録は持ち越さない', () => {
    const backdrop = createBackdropDismiss();
    backdrop.down(true);
    backdrop.up(true);
    expect(backdrop.shouldDismiss(true)).toBe(true);
    // 次の click は自分の mousedown / mouseup を伴わない限り閉じない
    expect(backdrop.shouldDismiss(true)).toBe(false);
  });

  it('click まで至らずに終わった操作を次の押下に持ち越さない', () => {
    const backdrop = createBackdropDismiss();
    // 背景で押して背景で離したが click が飛ばなかった（ウィンドウ外へ抜けた等）
    backdrop.down(true);
    backdrop.up(true);
    // 次は中で押した → 離す前に click が来ても閉じない
    backdrop.down(false);
    expect(backdrop.shouldDismiss(true)).toBe(false);
  });
});
