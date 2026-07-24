# adminkit ⇄ adminkit-svelte パリティ方針

adminkit-svelte は adminkit（バニラ CSS+JS フレームワーク）の Svelte 5 移植版。
両者の関係と、挙動のズレ（ドリフト）を管理するための方針をここに集約する。

## 構成の前提

| 層 | 共有方法 | 真実の源 |
|---|---|---|
| CSS / デザイントークン | `@green-spot/adminkit/css` を npm 依存で読み込む（単一ソース） | adminkit の `src/css/` |
| 対話挙動（JS） | **共有しない。各 `.svelte` で再実装** | adminkit の `src/js/adminkit.js` |

→ CSS は共有なので自動で揃う。**JS 挙動は二重実装なので、片方の修正がもう片方へ伝播しない**。
これがドリフトの構造的な原因。新しい対話挙動を adminkit に足したら、必ず Svelte 側にも反映する。

## 同期リチュアル（CSS 側の変更を取り込む）

adminkit の CSS / トークンを変更して svelte に反映する手順。**順序が重要**:

1. **adminkit を先に公開** — `vX.Y.Z` タグを push（CI が npm publish）。`npm view @green-spot/adminkit version` で npm に出たのを確認
2. **svelte で依存と lock を更新** — adminkit が npm に出てから:
   - `package.json` の `@green-spot/adminkit` を新バージョンへ bump
   - **`npm install` で `package-lock.json` を再生成し、package.json と同じコミットに含める**
   - `npm run build` で確認
3. **svelte を公開** — `vX.Y.Z` タグを push

> ⚠️ **落とし穴**: adminkit を公開する前に svelte の依存だけ `^X.Y.Z` に上げてコミットすると、その版がまだ npm に無いため lock を更新できず、CI の `npm ci` が **EUSAGE（lock と package.json の不一致）** で止まる。必ず「**adminkit 公開 → svelte の lock 更新**」の順で。

> ⚠️ publish は**タグが指すコミットの** workflow で動く。`publish.yml` を変えたら、タグを新コミットへ貼り直す（`git tag -d` → 再作成 → push）。失敗 run の再実行では旧 workflow を拾う。

> adminkit リポジトリ上の `version` は常に `0.0.0` のプレースホルダ。実バージョンはタグ駆動（`v0.1.0`, `v0.1.1` …）。

## バージョニング方針

両パッケージは **独立してバージョニング**する（ロックステップやハイブリッドは採らない）。

- 各パッケージは自身の変更に応じて SemVer を増やす。**番号を揃えたり飛ばしたりしない**（歯抜けは yank/事故に見える）
- 番号は時間とともに自然に乖離する。それが正常で、**「番号一致＝対応ペア」とは解釈しない**（不一致でも動くペアは普通にある）
- 2 つの対応関係は **バージョン番号ではなく依存レンジ**で表す。`adminkit-svelte` の `@green-spot/adminkit` を、必要な最低バージョンに合わせて上げる
- リリースは各リポで `vX.Y.Z` タグを push（CI が publish）。adminkit の CSS を更新したら、必要に応じて svelte の依存レンジを上げて新版を前提化する

## 挙動パリティ・チェックリスト

adminkit.js の挙動を Svelte 側が再現できているか。対応したら状態を ✅ にする。

| 挙動 | adminkit.js | Svelte 側の現状 | 状態 |
|---|---|---|---|
| Dropdown: anchor-positioning フォールバック | あり（`CSS.supports` + JS 配置） | `Dropdown.svelte` に移植（`ontoggle` で JS 配置） | ✅ |
| Dropdown: キーボード操作（上下/Home/End）+ `aria-expanded` 同期 | あり | `Dropdown.svelte` に移植（`onkeydown` + `ontoggle`） | ✅ |
| Toast: `danger` の `aria-live="assertive"` | あり | `Toast.svelte` で variant に応じて出し分け | ✅ |
| Toast: ホバーで自動消去を一時停止 | あり | `toast-store` に pause/resume タイマー、コンテナで `onmouseenter/leave` | ✅ |
| Tabs: Home / End / 上下キー + フォーカス移動 | あり | `Tabs.svelte` で全キー対応 + フォーカス移動 | ✅ |
| DataTable: ヘッダーチェックの `indeterminate` 表示 | あり | `DataTable.svelte` で `someSelected` を `indeterminate` にバインド | ✅ |
| ナビ: `aria-current` の親 `details` 自動展開 | あり | `+layout.svelte` で `open={pathname.startsWith(...)}` により宣言的に処理（adminkit.js より堅牢） | ✅ |
| ミニサイドバー: hover で入れ子 `details` を展開（アクティブページ含む場合は維持） | あり（`adminkit.js` 130-147） | `ShellMini.svelte` に action `use:miniHover` で移植 | ✅ |

## 移植「不要」な項目（Svelte / プラットフォームが代替するもの）

ドリフトに見えるが、再実装してはいけない / する必要がないもの:

- **モーダルのフォーカストラップ / Escape** — ネイティブ `<dialog>.showModal()` が処理。adminkit 側も同様で再実装不要
- **Dropdown の Escape / 外側クリック閉じ** — ネイティブ Popover API が処理
- **Toast の HTML エスケープ** — Svelte が `{}` 補間で自動エスケープ。`escapeHtml` 相当は不要
- **行クリック遷移（`data-href`）** — Svelte では props / イベントで表現する設計。属性フックは移植しない

## Svelte 独自の追加機能（adminkit.js に対応物なし）

- **confirmDialog / promptDialog（`dialog-store` + `Dialog.svelte`）** — `window.confirm` / `window.prompt` を置き換える Promise ベースのヘルパー。CSS は既存の `.c-modal` 契約のみ使用（adminkit 側に JS 対応物は不要）。ホストは Shell / ShellTopnav に内蔵

## 運用ルール

- adminkit に新しい対話挙動を足したら、このチェックリストに 1 行追加し、Svelte 側の対応状況を記録する
- CSS だけの変更（トークン追加・リファクタ等）はクラス契約が不変なら Svelte 側の対応不要。バージョン bump で取り込む
