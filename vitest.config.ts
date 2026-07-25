import { defineConfig } from 'vitest/config';

// SvelteKit プラグインは読み込まない（テスト対象は runes を使わない純粋な .ts のため）。
// コンポーネントの挙動テストを足すときは svelte プラグイン + jsdom を有効にする。
export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
