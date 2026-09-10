// 背景（dialog 要素そのもの＝内側の section の外）を押して閉じる判定。Modal / Drawer / Palette が共有する。
//
// click の target だけで判定してはいけない: click は mousedown と mouseup の最も近い共通祖先へ飛ぶため、
// 「入力の中で押して背景で離す」（既存値を選択して置き換えるドラッグ等）でも target は dialog になる。
// それで閉じると、編集中の入力を確認も通知も無しに捨てることになる。押した位置と離した位置の
// 両方が背景だったときだけ閉じる。
//
// 各コンポーネントに埋めるとテストできないため、状態を持つ純粋な .ts としてここに置く
// （dialog-guard.ts と同じ扱い・runes は使わない）。

export interface BackdropDismiss {
  /** dialog の mousedown。背景の上で押したかを記録する。 */
  down(onBackdrop: boolean): void;
  /** dialog の mouseup。背景の上で離したかを記録する。 */
  up(onBackdrop: boolean): void;
  /** dialog の click。閉じてよければ true（判定に使った記録はここで捨てる）。 */
  shouldDismiss(onBackdrop: boolean): boolean;
}

export function createBackdropDismiss(): BackdropDismiss {
  let downOnBackdrop = false;
  let upOnBackdrop = false;

  return {
    down(onBackdrop) {
      downOnBackdrop = onBackdrop;
      // 押し直した時点で前回の記録は無効（click まで至らずに終わった操作を持ち越さない）
      upOnBackdrop = false;
    },
    up(onBackdrop) {
      upOnBackdrop = onBackdrop;
    },
    shouldDismiss(onBackdrop) {
      const dismiss = onBackdrop && downOnBackdrop && upOnBackdrop;
      downOnBackdrop = false;
      upOnBackdrop = false;
      return dismiss;
    },
  };
}
