# @green-spot/adminkit-svelte

adminkit の Svelte コンポーネントライブラリ。CSS は `@green-spot/adminkit` を参照し、JS のインタラクションを Svelte コンポーネントとして提供する。

## インストール

```bash
npm install @green-spot/adminkit-svelte @green-spot/adminkit lucide-svelte
```

`@green-spot/adminkit` は CSS のみ提供。`lucide-svelte` はアイコン用（peerDependency）。

## セットアップ

### 1. テーマ初期化（FOUC 防止）

`src/app.html` の `<head>` 内にインラインスクリプトを追加する。

```html
<!DOCTYPE html>
<html lang="ja" data-theme-style="ink">
<head>
  <script>
    document.documentElement.dataset.themeStyle =
      localStorage.getItem('theme-style') || 'ink';
    document.documentElement.dataset.themeMode =
      localStorage.getItem('theme-mode') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  </script>
  %sveltekit.head%
</head>
<body>%sveltekit.body%</body>
</html>
```

テーマの初期値を変えたい場合はフォールバック値を変更する（`'ink'` → `'stone'` 等）。

テーマスタイル: `ink` | `stone` | `dusk` | `volt`
テーマモード: `light` | `dark`

### 2. CSS の読み込み

ルートレイアウトで CSS をインポートする。

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '@green-spot/adminkit/css';
</script>
```

### 3. アイコン

アイコンは `lucide-svelte` を使用する。衝突を避けるため `Icon` サフィックスを推奨。

```svelte
<script>
  import HouseIcon from 'lucide-svelte/icons/house';
  import BellIcon from 'lucide-svelte/icons/bell';
</script>
```

## ページの組み立て方

管理画面は Shell + Main + PageHeader + Section で構成する。

```svelte
<script>
  import { Shell, Main, PageHeader, Section, Grid, Stats, Badge, ThemeSwitcher } from '@green-spot/adminkit-svelte';
  import LayoutDashboardIcon from 'lucide-svelte/icons/layout-dashboard';
  import LogOutIcon from 'lucide-svelte/icons/log-out';
</script>

<Shell title="My App">
  {#snippet nav()}
    <ul>
      <li><a href="/" aria-current="page"><LayoutDashboardIcon /><span>ダッシュボード</span></a></li>
    </ul>
  {/snippet}
  {#snippet sidebarFooter()}
    <a href="/logout"><LogOutIcon /><span>ログアウト</span></a>
  {/snippet}

  <Main crumbs={[{ label: 'ダッシュボード' }]}>
    {#snippet actions()}<ThemeSwitcher />{/snippet}

    <PageHeader title="ダッシュボード" />

    <Section heading="KPI" hideHeading>
      <Grid cols={4}>
        <Stats label="ユーザー数" value="1,284">
          {#snippet sub()}前月比 <Badge variant="success">+12.5%</Badge>{/snippet}
        </Stats>
      </Grid>
    </Section>
  </Main>
</Shell>
```

### シェルパターン

| コンポーネント | 用途 |
|---|---|
| `Shell` | サイドバー付きレイアウト（標準）。`sub` snippet を渡すとダブルサイドバーになる |
| `ShellMini` | ミニサイドバー（アイコンのみ、ホバーで展開） |
| `ShellTopnav` | トップナビゲーション |
| `ShellStandalone` | ログイン・エラーページ等の単独レイアウト。`width="narrow"` / `"wide"` で幅を制御 |

#### Shell

```svelte
<Shell title="My App">
  {#snippet nav()}ナビゲーション{/snippet}
  {#snippet sidebarFooter()}サイドバーフッター{/snippet}
  {#snippet sub()}サブサイドバー（ダブルサイドバー時のみ）{/snippet}
  {#snippet shellFooter()}ページフッター（任意）{/snippet}
  <Main>...</Main>
</Shell>
```

| Props | 型 | 説明 |
|---|---|---|
| `title` | `string` | サイドバーヘッダーのタイトル。デフォルト `'adminkit'` |
| `nav` | `Snippet` | サイドバーのナビゲーション |
| `sidebarFooter` | `Snippet?` | サイドバーのフッター |
| `sub` | `Snippet?` | サブサイドバー。指定するとダブルサイドバーレイアウトになる |
| `shellFooter` | `Snippet?` | shell-main 内のページフッター |
| `children` | `Snippet` | メインコンテンツ（通常は `<Main>` を配置） |

#### Main

```svelte
<Main crumbs={[{ label: '設定', href: '/settings' }, { label: '一般' }]} width="full">
  {#snippet actions()}<ThemeSwitcher />{/snippet}
  <PageHeader title="一般設定" />
  <!-- コンテンツ -->
</Main>
```

| Props | 型 | 説明 |
|---|---|---|
| `crumbs` | `{ label: string; href?: string }[]` | パンくずリスト。最後の要素が現在のページ |
| `actions` | `Snippet?` | パンくず右側のアクション（ThemeSwitcher 等） |
| `width` | `'full' \| 'wide' \| 'center'` | コンテンツの最大幅。未指定で 60rem |
| `bar` | `Snippet?` | `main-content` の外に配置するバー（ActionBar 等） |
| `children` | `Snippet` | ページコンテンツ |

#### PageHeader

```svelte
<!-- タイトルのみ -->
<PageHeader title="ダッシュボード" />

<!-- アクションボタン付き -->
<PageHeader title="記事一覧">
  {#snippet actions()}
    <Button variant="primary" size="small">新規作成</Button>
  {/snippet}
</PageHeader>
```

| Props | 型 | 説明 |
|---|---|---|
| `title` | `string` | ページタイトル（h1 で出力） |
| `actions` | `Snippet?` | 右側のアクションボタン |

### セクション構造

見出しレベルはコンテキストで自動管理される。手動で指定する必要はない。

```svelte
<Main crumbs={[{ label: 'ウィジェット' }]}>
  <PageHeader title="ウィジェット" />

  <Section heading="Button">               <!-- h2 -->
    <Section heading="バリアント">           <!-- h3 -->
      <Cluster>
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
      </Cluster>
    </Section>
  </Section>

  <Section heading="Card">                 <!-- h2 -->
    <Card heading="カードタイトル">          <!-- heading は自動で h3 -->
      <p>カードの内容。</p>
    </Card>
  </Section>

  <Section heading="KPI" hideHeading>       <!-- h2 だが visually-hidden -->
    <Grid cols={4}>
      <Stats label="ユーザー数" value="1,284">
        {#snippet sub()}前月比 <Badge variant="success">+12.5%</Badge>{/snippet}
      </Stats>
    </Grid>
  </Section>
</Main>
```

| コンポーネント | 見出しレベルへの影響 |
|---|---|
| `Main` | level 1 を設定（h1 の親） |
| `Section` | 親 +1 で見出しを出力 |
| `Card` | 親 +1 を設定（`<section>` 要素のため） |
| `Tabs` | 親レベルをそのまま伝播 |
| `Modal` | 親レベルをそのまま伝播 |

#### Section

| Props | 型 | 説明 |
|---|---|---|
| `heading` | `string` | 見出しテキスト |
| `hideHeading` | `boolean?` | `true` で visually-hidden。セマンティクスは維持しつつ見た目では非表示 |
| `children` | `Snippet` | セクション内容 |

## コンポーネント一覧

### レイアウト

| コンポーネント | Props | 説明 |
|---|---|---|
| `Stack` | `gap?: string` | 垂直方向の均等間隔（`l-stack`） |
| `Cluster` | `justify?: 'center' \| 'right'` | 水平方向の折り返し配置（`l-cluster`） |
| `Grid` | `cols?: 2 \| 3 \| 4` | 均等カラムグリッド（`l-grid`） |
| `SidebarLayout` | `reverse?: boolean`, `width?: string` | メイン + サイドの 2 カラム（`l-sidebar`） |
| `PageHeader` | `title: string`, `actions?: Snippet` | ページヘッダー（h1 + アクションボタン） |
| `Breadcrumb` | `crumbs?: { label, href? }[]`, `home?: string` | パンくずリスト。ホームアイコン内蔵 |

### フォーム

| コンポーネント | Props | 説明 |
|---|---|---|
| `Fields` | `variant?: 'horizontal' \| 'inline'`, `as?: 'div' \| 'form'` | フォームフィールドのコンテナ。`as="form"` で `<form>` 要素として出力 |
| `Field` | `label: string`, `hint?: string`, `error?: string`, `errorMessage?: string`, `hidden?: boolean` | label + input のラッパー。`errorMessage` で `:user-invalid` 時に自動表示 |
| `Check` | `label: string`, `hint?: string`, `type?: string` | チェックボックス / ラジオ |
| `Toggle` | `label: string`, `hint?: string`, `checked?: boolean` | トグルスイッチ |
| `CheckGroup` | `legend?: string`, `horizontal?: boolean` | check/radio の横並びグループ |
| `Button` | `variant?: 'primary' \| 'success' \| 'danger' \| 'ghost'`, `size?: 'small'` | ボタン |
| `Search` | `size?: 'small'`, `value?: string` | 検索入力。アイコン内蔵 |
| `CopyButton` | `text: string \| null`, `label: string`, `variant?`, `size?: 'small'`, `disabled?: boolean`, `oncopied?: (copied) => void`, `onfailed?: (error) => void` | クリップボードへコピー。`text` が空なら自動で無効。**通知の文言はコールバックでアプリ側（i18n）に残す**（コンポーネントは何も表示しない）。`variant` / `size` に既定は無い — アイコンのみで置くときは `variant="ghost" size="small"` を明示する |
| `Upload` | `accept?: string`, `multiple?: boolean`, `onchange?: (files) => void` | ファイルアップロード。ドラッグ&ドロップ対応 |
| `Segment` | `options: {value, label}[]`, `value?: string`, `name: string`, `label: string`, `size?: 'small'` | セグメントコントロール（radio ベース） |
| `ToggleGroup` | `options: {value, label, icon?}[]`, `value?: string`, `label: string`, `size?: 'small'` | トグルグループ（button ベース） |

### 表示

| コンポーネント | Props | 説明 |
|---|---|---|
| `Card` | `heading?: string`, `variant?: 'danger'` | カード。`<section>` で出力。`heading` で自動レベルの見出しを出力 |
| `Table` | `compact?: boolean`, `auto?: boolean` | テーブル（`c-table-scroll` + `c-table`）。単純なテーブル用 |
| `DataTable` | `data: T[]`, `columns: Column[]`, `selectable?: boolean`, `compact?: boolean`, `filter?: Snippet`, `row?: Snippet`, `cell?: Snippet`, `actions?: Snippet` | データテーブル。ソート・チェックボックス・フィルタ・アクション列を統合。`cell` で `<td>` のクラスを自動付与 |
| `List` | `variants?: ('bordered' \| 'striped' \| 'interactive' \| 'disc' \| 'decimal')[]`, `as?: 'ul' \| 'ol'` | リスト。`as="ol"` で番号付きリスト |
| `DefinitionList` | `variants?: ('bordered' \| 'striped' \| 'horizontal')[]` | 定義リスト（`<dl>` で出力） |
| `Badge` | `variant?: 'primary' \| 'success' \| 'warning' \| 'danger'` | バッジ |
| `Tag` | `variant?: 'primary' \| 'success' \| 'warning' \| 'danger'`, `ondismiss?: () => void` | タグ。`ondismiss` で削除ボタン表示 |
| `TagList` | — | タグの折り返しコンテナ |
| `Avatar` | `label: string`, `initial: string`, `size?: 'small' \| 'large'` | アバター |
| `Stats` | `label: string`, `value: string`, `sub?: Snippet`, `accent?: boolean`, `icon?: Snippet` | KPI カード。見出しレベルは自動管理 |
| `Progress` | `value: number`, `max?: number`, `variant?: string`, `pageTop?: boolean`, `label: string`, `showLabel?: boolean` | プログレスバー |
| `Stepper` | `steps: { label: string; state?: 'done' \| 'active' }[]` | ステッパー |
| `Skeleton` | `shape?: 'text' \| 'circle'`, `width?: string`, `height?: string`, `label?: string \| null` | スケルトンローダー。`label={null}` で装飾扱い（親が読み込み中を伝えているとき） |
| `SkeletonRows` | `rows?: number`, `cols?: number`, `label?: string` | 一覧・テーブルの行プレースホルダ。**行の形が分かっている領域**はこちらを使う（レイアウトのずれが減る） |
| `Spinner` | `size?: 'small' \| 'large'`, `current?: boolean`, `label?: string \| null` | 読み込み中インジケータ。ボタン内は `current` で文字色に合わせる |
| `LoadingState` | `compact?: boolean`, `message?: string`, `label?: string` | 領域中央のスピナー（+ 補足テキスト）。**形が分からない / 面積が小さい領域**（ページ全体・モーダル内）に使う。`EmptyState` と余白が揃えてある |
| `Dot` | `variant?: 'accent' \| 'success' \| 'warning'`, `count?: number \| string` | 通知ドット。`count` で数値表示 |
| `Divider` | `label?: string` | 区切り線。`label` でテキスト付き |
| `EmptyState` | `heading?: string`, `icon?: Snippet` | 空状態の表示。`heading` で自動レベルの見出しを出力 |

### フィードバック

| コンポーネント | Props | 説明 |
|---|---|---|
| `Alert` | `variant?: 'success' \| 'warning' \| 'danger'` | コンテンツ内の通知 |
| `Banner` | `variant?: 'success' \| 'warning' \| 'danger'`, `dismissible?: boolean` | ページ上部の帯状通知 |
| `showToast(opts)` | `{ title, message?, variant?, duration?, action? }` | トーストを表示する関数。Shell に内蔵されているため配置不要 |
| `clearToasts()` | — | 全トーストをクリア |
| `Modal` | `open: boolean`, `label: string`, `size?: 'default' \| 'wide'`, `header?: Snippet`, `footer?: Snippet` | モーダルダイアログ。`bind:open` で開閉制御。`size="wide"`（48rem）は表・コード・長文など既定幅（32rem）に収まらないコンテンツ用 |
| `confirmDialog(opts)` | `{ message, title?, confirmLabel?, cancelLabel?, danger?, requireText? }` | `window.confirm` の置き換え。`Promise<boolean>` を返す（キャンセル・Esc・背景クリックは false）。ホストは Shell / ShellTopnav に内蔵されているため配置不要。Enter 誤爆防止のため初期フォーカスはキャンセル側。**`requireText`** を渡すと、その文字列を完全一致で入力するまで実行ボタンが無効になる（取り返しのつかない操作向け・`danger` との併用が前提。入力欄へ初期フォーカス） |
| `promptDialog(opts)` | `{ message, title?, confirmLabel?, cancelLabel?, initial?, placeholder? }` | `window.prompt` の置き換え。`Promise<string \| null>` を返す（キャンセル・Esc・背景クリックは null）。Enter で確定 |
| `setDialogDefaults(labels)` | `{ confirmLabel?, cancelLabel? }` | ダイアログボタンの既定ラベル（初期値 OK / キャンセル）を差し替える。i18n するアプリはレイアウトで呼ぶ |
| `Dialog` | — | confirmDialog / promptDialog のホスト。Shell / ShellTopnav に内蔵済み。ShellMini / ShellStandalone 等で使う場合のみ自前で配置する |
| `Dropdown` | `trigger: Snippet<[string]>`, `menu: Snippet` | ドロップダウンメニュー。id は自動生成され trigger に渡される |
| `Tooltip` | `text: string` | ツールチップ |
| `Tabs` | `tabs: { id, label, content: Snippet }[]`, `active?: string`, `label: string` | タブ。キーボードナビゲーション対応 |
| `Pagination` | `current: number`, `total: number`, `href?: (page) => string`, `onchange?: (page) => void` | ページネーション |
| `ActionBar` | `count: number`, `sticky?: boolean` | 一括操作バー。`count > 0` で表示 |
| `ErrorPage` | `code: number \| string`, `title: string`, `message: string`, `danger?: boolean` | エラーページ |
| `ThemeSwitcher` | — | テーマ切替 UI（トグルボタン + スタイル選択ドロップダウン） |

## デザイントークン・CSS 詳細

CSS の設計思想、デザイントークン、レイアウトの詳細は `@green-spot/adminkit` のドキュメントを参照。

- 設計思想・セクショニング・余白・アクセシビリティ: `docs/guide.md`
- デザイントークン（色・余白・タイポ・z-index・モーション）: `docs/tokens.md`
- レイアウトプリミティブ・シェルパターン: `docs/layout.md`
- フォームコンポーネント: `docs/components-form.md`
- 表示コンポーネント: `docs/components-display.md`
- フィードバックコンポーネント: `docs/components-feedback.md`
