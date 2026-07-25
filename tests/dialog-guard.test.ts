import { describe, expect, it } from 'vitest';
import { canSubmitDialog } from '../src/lib/dialog-guard.js';

// requireText は取り返しのつかない操作（ワークスペース削除等）のガード。
// 「一致しないと実行できない」が静かに緩まないよう固定する。

describe('canSubmitDialog', () => {
  it('requireText が無いときは常に実行できる（通常の confirm / prompt）', () => {
    expect(canSubmitDialog(undefined, '')).toBe(true);
    expect(canSubmitDialog(undefined, 'なにか')).toBe(true);
    expect(canSubmitDialog('', 'なにか')).toBe(true);
  });

  it('完全一致したときだけ実行できる', () => {
    expect(canSubmitDialog('my-workspace', 'my-workspace')).toBe(true);
    expect(canSubmitDialog('my-workspace', '')).toBe(false);
    expect(canSubmitDialog('my-workspace', 'my-workspac')).toBe(false);
    expect(canSubmitDialog('my-workspace', 'my-workspace2')).toBe(false);
  });

  it('前後の空白は一致とみなさない', () => {
    expect(canSubmitDialog('my-workspace', ' my-workspace')).toBe(false);
    expect(canSubmitDialog('my-workspace', 'my-workspace ')).toBe(false);
  });

  it('大文字小文字を区別する', () => {
    expect(canSubmitDialog('my-workspace', 'My-Workspace')).toBe(false);
  });
});
