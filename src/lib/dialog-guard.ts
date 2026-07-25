// confirmDialog の requireText 判定。取り返しのつかない操作の実行ボタンを開けてよいかを決める。
// Dialog.svelte の中に埋めるとテストできないため、純粋関数としてここに置く（runes を使わない .ts）。

/**
 * requireText が指定されているとき、入力値が**完全一致**したときだけ true を返す。
 * requireText が無い（通常の confirm / prompt）ときは常に true。
 *
 * 前後の空白は落とさない・大文字小文字も区別する（利用者に対象名を正確に入力させるのが目的で、
 * 曖昧一致を許すとガードの意味が薄れるため）。
 */
export function canSubmitDialog(requireText: string | undefined, value: string): boolean {
  if (!requireText) return true;
  return value === requireText;
}
