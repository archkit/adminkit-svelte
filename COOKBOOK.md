# adminkit-svelte クックブック

管理画面でよくあるページパターンの完全なコード例。

## 一覧ページ（テーブル + フィルタ + ページネーション + 一括操作）

```svelte
<script lang="ts">
  import {
    Main, Section, PageHeader, Fields, Field, Button, Badge,
    Cluster, Modal, Pagination, ThemeSwitcher, Dot
  } from '@green-spot/adminkit-svelte';
  import BellIcon from 'lucide-svelte/icons/bell';
  import CircleHelpIcon from 'lucide-svelte/icons/circle-help';
  import PlusIcon from 'lucide-svelte/icons/plus';
  import DownloadIcon from 'lucide-svelte/icons/download';
  import MoreHorizontalIcon from 'lucide-svelte/icons/more-horizontal';
  import EyeIcon from 'lucide-svelte/icons/eye';
  import EditIcon from 'lucide-svelte/icons/edit';
  import Trash2Icon from 'lucide-svelte/icons/trash-2';

  let deleteOpen = $state(false);
  let currentPage = $state(1);
</script>

<Main crumbs={[{ label: 'ユーザー管理', href: '#' }, { label: '一覧' }]} width="full">
  {#snippet actions()}
    <ThemeSwitcher />
    <a href="#" class="c-button ghost small"><BellIcon /><Dot count={3} /></a>
    <a href="#" class="c-button ghost small"><CircleHelpIcon /></a>
  {/snippet}

  <PageHeader title="ユーザー一覧">
    {#snippet actions()}
      <Button variant="ghost" size="small"><DownloadIcon />エクスポート</Button>
      <Button variant="primary" size="small"><PlusIcon />新規作成</Button>
    {/snippet}
  </PageHeader>

  <!-- フィルタ -->
  <Fields variant="inline" as="form" role="search" aria-label="ユーザー検索">
    <Field label="検索" hidden>
      <input type="search" placeholder="名前・メールで検索...">
    </Field>
    <Field label="ロール" hidden>
      <select>
        <option value="">すべてのロール</option>
        <option>管理者</option>
        <option>編集者</option>
        <option>閲覧者</option>
      </select>
    </Field>
    <Field label="ステータス" hidden>
      <select>
        <option value="">すべてのステータス</option>
        <option>有効</option>
        <option>無効</option>
      </select>
    </Field>
    <Button variant="primary" type="submit">検索</Button>
  </Fields>

  <!-- テーブル -->
  <div class="c-table-scroll">
    <table class="c-table">
      <thead>
        <tr>
          <th><input type="checkbox" aria-label="全選択"></th>
          <th aria-sort="ascending"><button>名前</button></th>
          <th aria-sort="none"><button>メール</button></th>
          <th>ロール</th>
          <th aria-sort="none"><button>登録日</button></th>
          <th>ステータス</th>
          <th class="num">投稿数</th>
          <th class="action"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="checkbox" aria-label="田中太郎を選択"></td>
          <td><a href="/users/1">田中太郎</a></td>
          <td>tanaka@example.com</td>
          <td>管理者</td>
          <td>2025-01-15</td>
          <td><Badge variant="success">有効</Badge></td>
          <td class="num">42</td>
          <td class="action">
            <div class="c-dropdown">
              <button class="c-button ghost small" popovertarget="menu-1" aria-haspopup="menu"><MoreHorizontalIcon /></button>
              <ul popover id="menu-1" role="menu">
                <li role="presentation"><a href="/users/1" role="menuitem"><EyeIcon />詳細</a></li>
                <li role="presentation"><a href="/users/1/edit" role="menuitem"><EditIcon />編集</a></li>
                <li role="separator"><hr></li>
                <li role="presentation"><button role="menuitem" class="danger" onclick={() => deleteOpen = true}><Trash2Icon />削除</button></li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Pagination total={3} bind:current={currentPage} />

  <!-- 削除確認ダイアログ -->
  <Modal bind:open={deleteOpen} label="ユーザーの削除">
    {#snippet header()}<h3>ユーザーの削除</h3>{/snippet}
    <p>このユーザーを削除してもよろしいですか？</p>
    {#snippet footer()}
      <Button onclick={() => deleteOpen = false}>キャンセル</Button>
      <Button variant="danger" onclick={() => deleteOpen = false}>削除する</Button>
    {/snippet}
  </Modal>
</Main>
```

> 表・コード・長文など既定幅（32rem）に収まらない内容を出すモーダルは `<Modal size="wide">`（48rem）を使う。利用側で `.c-modal` の幅を `:global` 上書きしない。

## 一覧ページ（DataTable 版）

`DataTable` を使うと、テーブルのヘッダー・ソート・チェックボックス・アクション列が自動生成される。`filter` snippet でフィルタバーを統合、`Dropdown` の id は自動生成。

```svelte
<script lang="ts">
  import {
    Main, PageHeader, DataTable, Badge, Button, Dropdown,
    Fields, Field, Pagination, ActionBar, ThemeSwitcher
  } from '@green-spot/adminkit-svelte';
  import PlusIcon from 'lucide-svelte/icons/plus';
  import MoreHorizontalIcon from 'lucide-svelte/icons/more-horizontal';
  import EyeIcon from 'lucide-svelte/icons/eye';
  import EditIcon from 'lucide-svelte/icons/edit';
  import Trash2Icon from 'lucide-svelte/icons/trash-2';

  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    date: string;
    status: string;
    statusVariant: 'success' | 'warning' | 'danger';
  }

  const users: User[] = [
    { id: 1, name: '田中太郎', email: 'tanaka@example.com', role: '管理者', date: '2025-01-15', status: '有効', statusVariant: 'success' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', role: '編集者', date: '2025-03-22', status: '有効', statusVariant: 'success' },
    { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: '閲覧者', date: '2025-06-10', status: '無効', statusVariant: 'warning' },
  ];

  const columns = [
    { key: 'name', label: '名前', sortable: true },
    { key: 'email', label: 'メール', sortable: true },
    { key: 'role', label: 'ロール' },
    { key: 'date', label: '登録日', sortable: true },
    { key: 'status', label: 'ステータス' },
  ];

  let selected = $state(new Set<number>());
  let sort = $state<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  let currentPage = $state(1);
</script>

<Main crumbs={[{ label: 'ユーザー管理', href: '#' }, { label: '一覧' }]} width="full">
  {#snippet actions()}<ThemeSwitcher />{/snippet}

  <PageHeader title="ユーザー一覧">
    {#snippet actions()}
      <Button variant="primary" size="small"><PlusIcon />新規作成</Button>
    {/snippet}
  </PageHeader>

  <!-- searchQuery, roleFilter は $state で定義し、filteredUsers を $derived で算出 -->
  <DataTable data={filteredUsers} {columns} selectable bind:selected bind:sort>
    {#snippet filter()}
      <Fields variant="inline">
        <Field label="検索" hidden>
          <Search placeholder="名前・メールで検索..." bind:value={searchQuery} />
        </Field>
        <Field label="ロール" hidden>
          <select bind:value={roleFilter}>
            <option value="">すべてのロール</option>
            <option>管理者</option>
            <option>編集者</option>
          </select>
        </Field>
      </Fields>
    {/snippet}
    {#snippet row(item)}
      <td><a href="/users/{item.id}">{item.name}</a></td>
      <td>{item.email}</td>
      <td>{item.role}</td>
      <td>{item.date}</td>
      <td><Badge variant={item.statusVariant}>{item.status}</Badge></td>
    {/snippet}
    {#snippet actions(item)}
      <Dropdown>
        {#snippet trigger(popoverId)}
          <button class="c-button ghost small" popovertarget={popoverId} aria-haspopup="menu"><MoreHorizontalIcon /></button>
        {/snippet}
        {#snippet menu()}
          <li role="presentation"><a href="/users/{item.id}" role="menuitem"><EyeIcon />詳細</a></li>
          <li role="presentation"><a href="/users/{item.id}/edit" role="menuitem"><EditIcon />編集</a></li>
          <li role="separator"><hr></li>
          <li role="presentation"><button role="menuitem" class="danger"><Trash2Icon />削除</button></li>
        {/snippet}
      </Dropdown>
    {/snippet}
  </DataTable>

  <Pagination total={3} bind:current={currentPage} />
</Main>

<!-- ActionBar は Main の bar snippet で main-content の外に配置 -->
```

### DataTable の cell snippet（簡易版）

`cell` snippet を使うと、`<td>` のクラス（`num` 等）が columns 定義から自動付与される。

```svelte
<DataTable data={users} {columns}>
  {#snippet cell(item, col)}
    {#if col.key === 'name'}
      <a href="/users/{item.id}">{item.name}</a>
    {:else if col.key === 'status'}
      <Badge variant={item.statusVariant}>{item.status}</Badge>
    {:else}
      {item[col.key]}
    {/if}
  {/snippet}
</DataTable>
```

## フォームバリデーション

Field の `errorMessage` を使うと、`:user-invalid` 時に自動表示されるエラーメッセージを設定できる。ユーザーがフィールドを操作するまでエラーは表示されない。

```svelte
<Fields>
  <Field label="メールアドレス" errorMessage="正しいメールアドレスを入力してください">
    <input type="email" required placeholder="email@example.com">
  </Field>
  <Field label="名前" errorMessage="名前は必須です">
    <input type="text" required placeholder="名前を入力...">
  </Field>
</Fields>
```

サーバーサイドバリデーションのエラーは `error` props で表示する。

```svelte
<Field label="メールアドレス" error="このメールアドレスは既に登録されています">
  <input type="email" value="existing@example.com">
</Field>
```

## 編集ページ（フォーム + サイドバー）

```svelte
<script lang="ts">
  import {
    Main, Section, Stack, Cluster, SidebarLayout, PageHeader,
    Fields, Field, Check, Tag, Upload, Button, Card, ThemeSwitcher
  } from '@green-spot/adminkit-svelte';
  import EyeIcon from 'lucide-svelte/icons/eye';
  import XIcon from 'lucide-svelte/icons/x';
</script>

<Main crumbs={[{ label: '記事', href: '/articles' }, { label: '記事編集' }]} width="wide">
  {#snippet actions()}<ThemeSwitcher />{/snippet}

  <PageHeader title="記事編集">
    {#snippet actions()}
      <a href="#" class="c-button ghost small"><EyeIcon />プレビュー</a>
    {/snippet}
  </PageHeader>

  <form class="contents">
    <SidebarLayout>
      <!-- メインエリア -->
      <Stack>
        <Section heading="基本情報">
          <Fields>
            <label>
              <span>タイトル</span>
              <input type="text" value="記事タイトル" required>
            </label>
            <label>
              <span>スラッグ</span>
              <input type="text" value="article-slug">
              <small>URLに使用される識別子です</small>
            </label>
          </Fields>
        </Section>

        <Section heading="本文">
          <Fields>
            <Field label="本文" hidden>
              <textarea placeholder="本文を入力..." rows="12"></textarea>
            </Field>
          </Fields>
        </Section>

        <Section heading="SEO">
          <Fields>
            <label>
              <span>メタタイトル</span>
              <input type="text" placeholder="検索結果に表示されるタイトル">
              <small>60文字以内を推奨</small>
            </label>
            <label>
              <span>メタディスクリプション</span>
              <textarea placeholder="検索結果に表示される説明文" rows="3"></textarea>
              <small>160文字以内を推奨</small>
            </label>
          </Fields>
        </Section>
      </Stack>

      <!-- サイドバー -->
      <Section heading="サイドバー" hideHeading>
        <Card heading="公開">
          <Fields>
            <label>
              <span>ステータス</span>
              <select>
                <option>下書き</option>
                <option selected>公開</option>
              </select>
            </label>
            <label>
              <span>公開日時</span>
              <input type="datetime-local" value="2026-04-10T09:00">
            </label>
          </Fields>
          <Cluster justify="right">
            <Button>キャンセル</Button>
            <Button variant="primary">保存</Button>
          </Cluster>
        </Card>

        <Card heading="カテゴリ">
          <Fields>
            <Check label="お知らせ" />
            <Check label="ブログ" checked />
            <Check label="ヘルプ" />
          </Fields>
        </Card>

        <Card heading="タグ">
          <div class="c-tag-list">
            <Tag variant="primary" ondismiss={() => {}}>テクノロジー</Tag>
            <Tag variant="primary" ondismiss={() => {}}>AI</Tag>
          </div>
        </Card>

        <Card heading="アイキャッチ画像">
          <Upload accept="image/*">
            <p>画像をアップロード</p>
            <small>PNG, JPG（最大 5MB）</small>
          </Upload>
        </Card>
      </Section>
    </SidebarLayout>
  </form>
</Main>
```

## 設定ページ（horizontal フォーム + トグル + Danger Zone）

```svelte
<script lang="ts">
  import {
    Main, Section, Cluster, PageHeader, Fields, Toggle,
    Button, Card, ThemeSwitcher, Dot
  } from '@green-spot/adminkit-svelte';
  import BellIcon from 'lucide-svelte/icons/bell';
  import CircleHelpIcon from 'lucide-svelte/icons/circle-help';
</script>

<Main crumbs={[{ label: '設定', href: '#' }, { label: '一般設定' }]}>
  {#snippet actions()}
    <ThemeSwitcher />
    <a href="#" class="c-button ghost small"><BellIcon /><Dot count={3} /></a>
    <a href="#" class="c-button ghost small"><CircleHelpIcon /></a>
  {/snippet}

  <PageHeader title="一般設定" />

  <form class="contents">
    <Section heading="サイト情報">
      <Fields variant="horizontal">
        <label><span>サイト名</span><input type="text" value="My Application"></label>
        <label><span>サイトURL</span><input type="url" value="https://example.com"></label>
      </Fields>
    </Section>

    <Section heading="通知設定">
      <Fields>
        <Toggle label="メール通知" hint="重要な更新をメールで受け取ります" checked />
        <Toggle label="Slack通知" hint="Slackチャンネルに通知を送信します" />
      </Fields>
    </Section>

    <Section heading="危険な操作">
      <Card variant="danger" heading="アカウント削除">
        <p>アカウントを削除すると、すべてのデータが完全に消去されます。この操作は取り消せません。</p>
        <Button variant="danger">アカウントを削除する</Button>
      </Card>
    </Section>

    <Cluster justify="right">
      <Button variant="primary">保存</Button>
    </Cluster>
  </form>
</Main>
```

## プロフィールページ（タブ + フォーム）

```svelte
<script lang="ts">
  import {
    Main, Section, Cluster, PageHeader, Fields, Toggle,
    Button, Card, Avatar, Tabs, ThemeSwitcher, Dot
  } from '@green-spot/adminkit-svelte';
  import BellIcon from 'lucide-svelte/icons/bell';
</script>

<Main crumbs={[{ label: 'プロフィール' }]}>
  {#snippet actions()}
    <ThemeSwitcher />
    <a href="#" class="c-button ghost small"><BellIcon /><Dot count={3} /></a>
  {/snippet}

  <PageHeader title="プロフィール" />

  <!-- プロフィールカードは見出しの位置が特殊（アバターの後）なので heading props を使わず直接記述 -->
  <Card class="profile-card">
    <Avatar label="田中太郎" initial="田" size="large" />
    <h2>田中太郎</h2>
    <p>管理者 · tanaka@example.com</p>
  </Card>

  <Tabs
    label="プロフィールタブ"
    tabs={[
      { id: 'account', label: 'アカウント', content: accountTab },
      { id: 'security', label: 'セキュリティ', content: securityTab },
      { id: 'notifications', label: '通知', content: notificationsTab }
    ]}
  />
</Main>

{#snippet accountTab()}
  <form class="l-stack">
    <Section heading="基本情報">
      <Fields variant="horizontal">
        <label><span>名前</span><input type="text" value="田中太郎"></label>
        <label><span>メールアドレス</span><input type="email" value="tanaka@example.com"></label>
        <label><span>電話番号</span><input type="tel" value="090-1234-5678"></label>
      </Fields>
    </Section>
    <Section heading="プロフィール">
      <Fields>
        <label><span>自己紹介</span><textarea placeholder="自己紹介を入力..." rows="4"></textarea></label>
        <label><span>ウェブサイト</span><input type="url" placeholder="https://..."></label>
      </Fields>
    </Section>
    <Cluster justify="right">
      <Button variant="primary">保存</Button>
    </Cluster>
  </form>
{/snippet}

{#snippet securityTab()}
  <form class="l-stack">
    <Section heading="パスワード変更">
      <Fields>
        <label><span>現在のパスワード</span><input type="password" placeholder="現在のパスワード"></label>
        <label><span>新しいパスワード</span><input type="password" placeholder="新しいパスワード"><small>8文字以上、英数字を含めてください</small></label>
        <label><span>確認</span><input type="password" placeholder="もう一度入力"></label>
      </Fields>
    </Section>
    <Cluster justify="right">
      <Button variant="primary">パスワードを変更</Button>
    </Cluster>
    <Section heading="二要素認証">
      <Card heading="認証アプリ">
        <p>Google Authenticator や Authy 等の認証アプリを使用します。</p>
        <div><Button size="small">設定する</Button></div>
      </Card>
    </Section>
  </form>
{/snippet}

{#snippet notificationsTab()}
  <form class="l-stack">
    <Section heading="通知設定">
      <Fields>
        <Toggle label="メール通知" hint="重要な更新をメールで受け取ります" checked />
        <Toggle label="セキュリティアラート" hint="不審なログインを検知した場合に通知します" checked />
        <Toggle label="マーケティング" hint="新機能やキャンペーンの案内を受け取ります" />
        <Toggle label="週次レポート" hint="毎週月曜日にアクティビティレポートを送信します" checked />
      </Fields>
    </Section>
    <Cluster justify="right">
      <Button variant="primary">保存</Button>
    </Cluster>
  </form>
{/snippet}
```

## ダッシュボード（KPI + リスト + テーブル）

```svelte
<script lang="ts">
  import {
    Main, Section, Grid, Stats, Badge, List, PageHeader,
    ThemeSwitcher, Dot
  } from '@green-spot/adminkit-svelte';
  import BellIcon from 'lucide-svelte/icons/bell';
  import CircleHelpIcon from 'lucide-svelte/icons/circle-help';
</script>

<Main width="full">
  {#snippet actions()}
    <ThemeSwitcher />
    <a href="#" class="c-button ghost small"><BellIcon /><Dot count={3} /></a>
    <a href="#" class="c-button ghost small"><CircleHelpIcon /></a>
  {/snippet}

  <PageHeader title="ダッシュボード" />

  <Section heading="KPI" hideHeading>
    <Grid cols={4}>
      <Stats label="ユーザー数" value="1,284">
        {#snippet sub()}前月比 <Badge variant="success">+12.5%</Badge>{/snippet}
      </Stats>
      <Stats label="注文数" value="568">
        {#snippet sub()}前月比 <Badge variant="success">+8.2%</Badge>{/snippet}
      </Stats>
      <Stats label="売上" value="¥3,420,000">
        {#snippet sub()}前月比 <Badge variant="warning">-2.1%</Badge>{/snippet}
      </Stats>
      <Stats label="コンバージョン率" value="3.6%">
        {#snippet sub()}前月比 <Badge variant="success">+0.4%</Badge>{/snippet}
      </Stats>
    </Grid>
  </Section>

  <Section heading="最近のアクティビティ">
    <List variants={['bordered']}>
      <li>田中太郎が新しい記事を投稿しました <small>5分前</small></li>
      <li>佐藤花子がプロフィールを更新しました <small>15分前</small></li>
      <li>鈴木一郎が新規登録しました <small>1時間前</small></li>
    </List>
  </Section>

  <Section heading="最近の注文">
    <div class="c-table-scroll">
      <table class="c-table">
        <thead>
          <tr>
            <th>注文ID</th>
            <th>顧客名</th>
            <th>商品</th>
            <th class="num">金額</th>
            <th>ステータス</th>
            <th>日時</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1045</td>
            <td>田中太郎</td>
            <td>プレミアムプラン</td>
            <td class="num">¥12,000</td>
            <td><Badge variant="success">完了</Badge></td>
            <td>2026-04-08</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Section>
</Main>
```

## ログインページ（standalone）

```svelte
<script lang="ts">
  import { ShellStandalone, Fields, Button, Divider } from '@green-spot/adminkit-svelte';
</script>

<ShellStandalone width="narrow">
  <form>
    <h1>My App</h1>
    <Fields>
      <label>
        <span>メールアドレス</span>
        <input type="email" required placeholder="you@example.com">
      </label>
      <label>
        <span>パスワード</span>
        <input type="password" required placeholder="パスワード">
      </label>
    </Fields>
    <Button variant="primary" class="full">ログイン</Button>
    <Divider label="または" />
    <Button class="full">Google でログイン</Button>
    <p><a href="#">パスワードを忘れた方</a></p>
  </form>
</ShellStandalone>
```

## エラーページ

```svelte
<script lang="ts">
  import { ErrorPage, Button } from '@green-spot/adminkit-svelte';
  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import HomeIcon from 'lucide-svelte/icons/home';
</script>

<ErrorPage code={404} title="ページが見つかりません" message="お探しのページは存在しないか、移動した可能性があります。">
  <Button onclick={() => history.back()}><ArrowLeftIcon />前のページへ</Button>
  <a href="/" class="c-button primary"><HomeIcon />ダッシュボードへ</a>
</ErrorPage>
```

## シェルレイアウトの構築（+layout.svelte）

```svelte
<script lang="ts">
  import '@green-spot/adminkit/css';
  import { page } from '$app/state';
  import { Shell, Dot, Badge } from '@green-spot/adminkit-svelte';
  import LayoutDashboardIcon from 'lucide-svelte/icons/layout-dashboard';
  import UsersIcon from 'lucide-svelte/icons/users';
  import SettingsIcon from 'lucide-svelte/icons/settings';
  import FileTextIcon from 'lucide-svelte/icons/file-text';
  import ListIcon from 'lucide-svelte/icons/list';
  import PlusIcon from 'lucide-svelte/icons/plus';
  import LogOutIcon from 'lucide-svelte/icons/log-out';

  let { children } = $props();

  function current(href: string) {
    const path = page.url.pathname;
    if (href === '/') return path === '/' ? 'page' : undefined;
    return path === href || path.startsWith(href + '/') ? 'page' : undefined;
  }
</script>

<Shell title="My App">
  {#snippet nav()}
    <ul>
      <li><a href="/" aria-current={current('/')}><LayoutDashboardIcon /><span>ダッシュボード</span></a></li>
    </ul>
    <div role="group" aria-labelledby="nav-content">
      <span class="label" id="nav-content">コンテンツ</span>
      <ul>
        <li>
          <details open={page.url.pathname.startsWith('/articles')}>
            <summary><FileTextIcon /><span>記事</span></summary>
            <ul>
              <li><a href="/articles" aria-current={current('/articles')}><ListIcon /><span>一覧</span></a></li>
              <li><a href="/articles/new" aria-current={current('/articles/new')}><PlusIcon /><span>新規作成</span></a></li>
            </ul>
          </details>
        </li>
        <li><a href="/users" aria-current={current('/users')}><UsersIcon /><span>ユーザー</span></a></li>
      </ul>
    </div>
    <div role="group" aria-labelledby="nav-system">
      <span class="label" id="nav-system">システム</span>
      <ul>
        <li><a href="/settings" aria-current={current('/settings')}><SettingsIcon /><span>設定</span><Badge variant="warning">3</Badge></a></li>
      </ul>
    </div>
  {/snippet}
  {#snippet sidebarFooter()}
    <a href="/logout"><LogOutIcon /><span>ログアウト</span></a>
  {/snippet}

  {@render children()}
</Shell>
```
