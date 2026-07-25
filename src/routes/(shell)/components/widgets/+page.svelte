<script lang="ts">
  import {
    Main, Section, Stack, Cluster, Grid, PageHeader,
    Button, Badge, Alert, Banner, Card, Divider, Avatar, Tooltip,
    Skeleton, SkeletonRow, Spinner, LoadingState, CopyButton,
    Search, Tag, TagList, Dot, ToggleGroup, Stats, Progress,
    Stepper, EmptyState, Upload, showToast, ThemeSwitcher
  } from '$lib';
  import Bell from 'lucide-svelte/icons/bell';
  import CircleHelp from 'lucide-svelte/icons/circle-help';
  import Mail from 'lucide-svelte/icons/mail';
  import MessageSquare from 'lucide-svelte/icons/message-square';
  import Inbox from 'lucide-svelte/icons/inbox';
  import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
  import ShoppingBag from 'lucide-svelte/icons/shopping-bag';
  import User from 'lucide-svelte/icons/user';
  import Plus from 'lucide-svelte/icons/plus';
  import Download from 'lucide-svelte/icons/download';
  import UserPlus from 'lucide-svelte/icons/user-plus';
  import SearchX from 'lucide-svelte/icons/search-x';
  import Users from 'lucide-svelte/icons/users';
  import InboxIcon from 'lucide-svelte/icons/inbox';
  import UploadCloud from 'lucide-svelte/icons/upload-cloud';
  import Files from 'lucide-svelte/icons/files';
  import ListIcon from 'lucide-svelte/icons/list';
  import Grid2x2 from 'lucide-svelte/icons/grid-2x2';
  import Kanban from 'lucide-svelte/icons/kanban';

  let toggleValue = $state('list');
  let togglePeriod = $state('day');
</script>

<Progress value={40} label="ページ進捗" pageTop />

<Main crumbs={[{label: 'ウィジェット'}]}>
  {#snippet actions()}
    <ThemeSwitcher />
    <a href="#" class="c-button ghost small"><Bell /><Dot count={3} /></a>
    <a href="#" class="c-button ghost small"><CircleHelp /></a>
  {/snippet}

  <PageHeader title="ウィジェット" />

  <!-- Button -->
  <Section heading="Button">
    <Section heading="バリアント">
      <Cluster>
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </Cluster>
    </Section>
    <Section heading="サイズ・状態">
      <Cluster>
        <Button size="small">Small</Button>
        <Button variant="primary" size="small">Primary Small</Button>
        <Button size="small" disabled>Disabled</Button>
      </Cluster>
    </Section>
    <Section heading="アイコン付き">
      <Cluster>
        <Button variant="primary" size="small"><Plus />新規作成</Button>
        <Button variant="ghost" size="small"><Download />エクスポート</Button>
      </Cluster>
    </Section>
  </Section>

  <!-- Badge -->
  <Section heading="Badge">
    <Cluster>
      <Badge>Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </Cluster>
  </Section>

  <!-- Alert -->
  <Section heading="Alert">
    <Stack>
      <Alert><strong>お知らせ</strong> システムメンテナンスを予定しています。</Alert>
      <Alert variant="success"><strong>完了</strong> データの保存が完了しました。</Alert>
      <Alert variant="warning"><strong>注意</strong> ディスク使用量が80%を超えています。</Alert>
      <Alert variant="danger"><strong>エラー</strong> 接続に失敗しました。再試行してください。</Alert>
    </Stack>
  </Section>

  <!-- Banner -->
  <Section heading="Banner">
    <Stack>
      <Banner><p>新機能が追加されました。詳細はリリースノートをご確認ください。</p></Banner>
      <Banner variant="warning"><p>APIの利用制限に近づいています。</p></Banner>
      <Banner variant="danger"><p>サーバーとの接続が不安定です。</p></Banner>
      <Banner variant="warning" dismissible><p>この通知は閉じることができます。</p></Banner>
    </Stack>
  </Section>

  <!-- Card -->
  <Section heading="Card">
    <Stack>
      <Card>
        <h3>デフォルトカード</h3>
        <p>カードの内容がここに入ります。情報をグループ化して表示するのに使用します。</p>
      </Card>
      <Card variant="danger">
        <h3>Danger Zone</h3>
        <p>この操作は取り消せません。アカウントを削除すると、すべてのデータが失われます。</p>
        <Cluster>
          <Button variant="danger">アカウントを削除</Button>
        </Cluster>
      </Card>
    </Stack>
  </Section>

  <!-- Divider -->
  <Section heading="Divider">
    <Stack>
      <Divider />
      <Divider label="または" />
      <Divider label="セクション" />
    </Stack>
  </Section>

  <!-- Avatar -->
  <Section heading="Avatar">
    <Cluster>
      <Avatar label="小林" initial="小" size="small" />
      <Avatar label="田中" initial="田" />
      <Avatar label="佐藤" initial="佐" size="large" />
    </Cluster>
  </Section>

  <!-- Tooltip -->
  <Section heading="Tooltip">
    <Cluster>
      <Tooltip text="ツールチップの内容"><Button>ホバーしてください</Button></Tooltip>
      <Tooltip text="保存します"><Button variant="primary">保存</Button></Tooltip>
      <Tooltip text="田中太郎"><Avatar label="田中" initial="田" /></Tooltip>
    </Cluster>
  </Section>

  <!-- Toast -->
  <Section heading="Toast">
    <Cluster>
      <Button onclick={() => showToast({ title: '通知', message: 'これは通知です' })}>通知</Button>
      <Button variant="success" onclick={() => showToast({ title: '成功', message: 'データを保存しました', variant: 'success' })}>成功</Button>
      <Button onclick={() => showToast({ title: '警告', message: '注意してください', variant: 'warning' })}>警告</Button>
      <Button variant="danger" onclick={() => showToast({ title: 'エラー', message: '接続に失敗しました', variant: 'danger' })}>エラー</Button>
      <Button variant="ghost" onclick={() => showToast({ title: '削除しました', variant: 'success', action: { label: '元に戻す', onClick: () => {} } })}>アクション付き</Button>
    </Cluster>
  </Section>

  <!-- Skeleton -->
  <Section heading="Skeleton">
    <Section heading="基本">
      <Stack>
        <Skeleton shape="text" />
        <Skeleton shape="text" />
        <Skeleton shape="circle" />
      </Stack>
    </Section>
    <Section heading="カード内">
      <div class="c-card">
        <Cluster>
          <Skeleton shape="circle" />
          <Stack data-gap="0.5">
            <Skeleton shape="text" />
            <Skeleton shape="text" />
          </Stack>
        </Cluster>
      </div>
    </Section>
    <Section heading="テーブルの行（SkeletonRow）">
      <!-- 実テーブルの中に入れる。ヘッダーが残り、列幅もテーブルレイアウトが決める -->
      <div class="c-table-scroll">
        <table class="c-table" aria-busy="true">
          <thead>
            <tr><th>名前</th><th>種別</th><th>ステータス</th><th>更新日時</th></tr>
          </thead>
          <tbody>
            {#each [0, 1, 2] as i (i)}<SkeletonRow cols={4} />{/each}
          </tbody>
        </table>
      </div>
    </Section>
  </Section>

  <!-- Spinner -->
  <Section heading="Spinner">
    <Section heading="サイズ">
      <Cluster>
        <Spinner size="small" />
        <Spinner />
        <Spinner size="large" />
      </Cluster>
    </Section>
    <Section heading="領域の読み込み中（LoadingState）">
      <div class="c-card">
        <LoadingState message="読み込み中..." />
      </div>
    </Section>
    <Section heading="狭い領域（compact）">
      <div class="c-card">
        <LoadingState compact />
      </div>
    </Section>
    <Section heading="ボタン内（current）">
      <Cluster>
        <Button variant="primary" disabled>
          <Spinner size="small" current label={null} />送信中...
        </Button>
        <Button disabled>
          <Spinner size="small" current label={null} />保存中...
        </Button>
      </Cluster>
    </Section>
  </Section>

  <!-- CopyButton -->
  <Section heading="CopyButton">
    <Section heading="基本（アイコンのみ / 文字あり）">
      <Cluster>
        <code>git@github.com:owner/repo.git</code>
        <CopyButton
          text="git@github.com:owner/repo.git"
          label="クローン URL をコピー"
          variant="ghost"
          size="small"
          oncopied={() => showToast({ title: 'コピーしました', variant: 'success' })}
          onfailed={() => showToast({ title: 'コピーに失敗しました', variant: 'danger' })}
        />
        <CopyButton
          text="git@github.com:owner/repo.git"
          label="クローン URL をコピー"
          oncopied={() => showToast({ title: 'コピーしました', variant: 'success' })}
        >
          コピー
        </CopyButton>
        <CopyButton text={null} label="コピー対象なし" variant="ghost" size="small" />
      </Cluster>
    </Section>
  </Section>

  <!-- Search -->
  <Section heading="Search">
    <Section heading="基本">
      <Stack>
        <Search placeholder="検索..." />
      </Stack>
    </Section>
    <Section heading="Small">
      <Search placeholder="検索..." size="small" />
    </Section>
  </Section>

  <!-- Tag -->
  <Section heading="Tag / Chip">
    <Section heading="バリアント">
      <TagList>
        <Tag>Default</Tag>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="danger">Danger</Tag>
      </TagList>
    </Section>
    <Section heading="アイコン・削除ボタン付き">
      <TagList>
        <Tag><User />ユーザー</Tag>
        <Tag variant="primary" ondismiss={() => {}}>React</Tag>
        <Tag variant="success" ondismiss={() => {}}>公開済み</Tag>
        <Tag variant="danger" ondismiss={() => {}}>要対応</Tag>
      </TagList>
    </Section>
  </Section>

  <!-- Notification Dot -->
  <Section heading="Notification Dot">
    <Cluster>
      <Button variant="ghost"><Bell />通知<Dot /></Button>
      <Button variant="ghost"><Mail />メール<Dot variant="accent" /></Button>
      <Button variant="ghost"><MessageSquare />チャット<Dot variant="success" /></Button>
      <Button variant="ghost"><Inbox />受信箱<Dot count={3} /></Button>
      <Button variant="ghost"><ShoppingCart />カート<Dot count={12} variant="accent" /></Button>
    </Cluster>
  </Section>

  <!-- Toggle Group -->
  <Section heading="Toggle Group">
    <Section heading="基本">
      <Cluster>
        <ToggleGroup
          label="表示モード"
          bind:value={toggleValue}
          options={[
            { value: 'list', label: 'リスト', icon: listIconSnippet },
            { value: 'grid', label: 'グリッド', icon: gridIconSnippet },
            { value: 'board', label: 'ボード', icon: kanbanIconSnippet }
          ]}
        />
      </Cluster>
    </Section>
    <Section heading="Small・テキストのみ">
      <Cluster>
        <ToggleGroup
          label="期間"
          size="small"
          bind:value={togglePeriod}
          options={[
            { value: 'day', label: '日' },
            { value: 'week', label: '週' },
            { value: 'month', label: '月' },
            { value: 'year', label: '年' }
          ]}
        />
      </Cluster>
    </Section>
  </Section>

  <!-- Stats Card -->
  <Section heading="Stats Card">
    <Section heading="基本">
      <Grid cols={4}>
        <Stats label="ユーザー数" value="1,284">{#snippet sub()}前月比 <Badge variant="success">+12.5%</Badge>{/snippet}</Stats>
        <Stats label="注文数" value="568">{#snippet sub()}前月比 <Badge variant="success">+8.2%</Badge>{/snippet}</Stats>
        <Stats label="売上" value="¥3.4M">{#snippet sub()}前月比 <Badge variant="warning">-2.1%</Badge>{/snippet}</Stats>
        <Stats label="CVR" value="3.6%">{#snippet sub()}前月比 <Badge variant="success">+0.4%</Badge>{/snippet}</Stats>
      </Grid>
    </Section>
    <Section heading="アクセントバー付き">
      <Grid cols={3}>
        <Stats accent label="アクティブユーザー" value="842" />
        <Stats accent label="セッション" value="2,451" />
        <Stats accent label="直帰率" value="32.4%" />
      </Grid>
    </Section>
    <Section heading="アイコン付き">
      <Grid cols={2}>
        <Stats label="総ユーザー数" value="1,284">
          {#snippet icon()}<Users />{/snippet}
          {#snippet sub()}前月比 +12.5%{/snippet}
        </Stats>
        <Stats label="今月の注文" value="568">
          {#snippet icon()}<ShoppingBag />{/snippet}
          {#snippet sub()}前月比 +8.2%{/snippet}
        </Stats>
      </Grid>
    </Section>
  </Section>

  <!-- Progress -->
  <Section heading="Progress">
    <Section heading="バリアント">
      <Stack>
        <Progress value={60} label="デフォルト" />
        <Progress value={100} variant="success" label="成功" />
        <Progress value={25} variant="danger" label="エラー" />
      </Stack>
    </Section>
    <Section heading="ラベル付き">
      <Progress value={73} label="ストレージ使用量" showLabel />
    </Section>
    <Section heading="Page Top">
      <p>body 直下に配置すると画面最上部に固定表示されます。このページの上部に表示されています。</p>
    </Section>
  </Section>

  <!-- Empty State -->
  <Section heading="Empty State">
    <Section heading="基本">
      <EmptyState>
        <InboxIcon />
        <h3>データがありません</h3>
        <p>まだ記事が投稿されていません。最初の記事を作成してみましょう。</p>
        <Button variant="primary" size="small"><Plus />新規作成</Button>
      </EmptyState>
    </Section>
    <Section heading="検索結果なし">
      <EmptyState>
        <SearchX />
        <h3>検索結果が見つかりません</h3>
        <p>別のキーワードで再度お試しください。</p>
      </EmptyState>
    </Section>
    <Section heading="カード内">
      <Card>
        <EmptyState>
          <Users />
          <h3>メンバーがいません</h3>
          <p>チームにメンバーを招待して共同作業を始めましょう。</p>
          <Button variant="primary" size="small"><UserPlus />メンバーを招待</Button>
        </EmptyState>
      </Card>
    </Section>
  </Section>

  <!-- Stepper -->
  <Section heading="Stepper">
    <Section heading="基本（ステップ2が現在）">
      <Stepper steps={[
        { label: 'アカウント情報', state: 'done' },
        { label: 'プラン選択', state: 'active' },
        { label: 'お支払い' },
        { label: '完了' }
      ]} />
    </Section>
    <Section heading="完了状態">
      <Stepper steps={[
        { label: '入力', state: 'done' },
        { label: '確認', state: 'done' },
        { label: '完了', state: 'done' }
      ]} />
    </Section>
    <Section heading="最初のステップ">
      <Stepper steps={[
        { label: '基本設定', state: 'active' },
        { label: '詳細設定' },
        { label: '確認' }
      ]} />
    </Section>
  </Section>

  <!-- Upload -->
  <Section heading="Upload">
    <Section heading="基本">
      <Upload accept="image/*">
        <UploadCloud />
        <p>クリックまたはドラッグ＆ドロップ</p>
        <small>PNG, JPG, GIF（最大 10MB）</small>
      </Upload>
    </Section>
    <Section heading="複数ファイル">
      <Upload multiple>
        <Files />
        <p>ファイルを選択またはドロップ</p>
        <small>CSV, Excel, PDF（最大 50MB）</small>
      </Upload>
    </Section>
  </Section>
</Main>

{#snippet listIconSnippet()}<ListIcon />{/snippet}
{#snippet gridIconSnippet()}<Grid2x2 />{/snippet}
{#snippet kanbanIconSnippet()}<Kanban />{/snippet}
