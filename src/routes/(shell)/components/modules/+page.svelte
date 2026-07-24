<script>
  import {
    Main, Section, Cluster, PageHeader,
    Badge, Button, Modal, Tabs, Segment, Dropdown,
    Pagination, List, DefinitionList, Fields, Field, Check, Toggle, CheckGroup,
    ThemeSwitcher, Dot, confirmDialog, promptDialog
  } from '$lib';
  import Bell from 'lucide-svelte/icons/bell';
  import CircleHelp from 'lucide-svelte/icons/circle-help';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import Edit from 'lucide-svelte/icons/edit';
  import Copy from 'lucide-svelte/icons/copy';
  import Archive from 'lucide-svelte/icons/archive';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import Pipette from 'lucide-svelte/icons/pipette';

  let modalOpen = $state(false);
  let dialogResult = $state('（未実行）');
  let currentPage = $state(1);
  let segmentPeriod = $state('day');
  let segmentView = $state('list');
</script>

<Main crumbs={[{label: 'モジュール'}]}>
  {#snippet actions()}
    <ThemeSwitcher />
    <a href="#" class="c-button ghost small"><Bell /><Dot count={3} /></a>
    <a href="#" class="c-button ghost small"><CircleHelp /></a>
  {/snippet}

  <PageHeader title="モジュール" />

  <!-- Table -->
  <Section heading="Table">
    <Section heading="基本テーブル + ソート">
      <div class="c-table-scroll">
        <table class="c-table">
          <thead>
            <tr>
              <th aria-sort="ascending"><button>名前</button></th>
              <th aria-sort="none"><button>メール</button></th>
              <th>ロール</th>
              <th aria-sort="none"><button>登録日</button></th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>田中太郎</td>
              <td>tanaka@example.com</td>
              <td>管理者</td>
              <td>2025-01-15</td>
              <td><Badge variant="success">有効</Badge></td>
            </tr>
            <tr>
              <td>佐藤花子</td>
              <td>sato@example.com</td>
              <td>編集者</td>
              <td>2025-03-22</td>
              <td><Badge variant="success">有効</Badge></td>
            </tr>
            <tr>
              <td>鈴木一郎</td>
              <td>suzuki@example.com</td>
              <td>閲覧者</td>
              <td>2025-06-10</td>
              <td><Badge variant="warning">無効</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section heading="Selectable">
      <div class="c-table-scroll">
        <table class="c-table" data-js-table-check="demo-select">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="全選択"></th>
              <th>名前</th>
              <th>ロール</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" aria-label="田中太郎を選択"></td>
              <td>田中太郎</td>
              <td>管理者</td>
              <td><Badge variant="success">有効</Badge></td>
            </tr>
            <tr>
              <td><input type="checkbox" aria-label="佐藤花子を選択"></td>
              <td>佐藤花子</td>
              <td>編集者</td>
              <td><Badge variant="success">有効</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section heading="Compact">
      <div class="c-table-scroll">
        <table class="c-table compact">
          <thead>
            <tr><th>ID</th><th>名前</th><th>ステータス</th></tr>
          </thead>
          <tbody>
            <tr><td>001</td><td>項目A</td><td><Badge variant="success">有効</Badge></td></tr>
            <tr><td>002</td><td>項目B</td><td><Badge variant="warning">無効</Badge></td></tr>
            <tr><td>003</td><td>項目C</td><td><Badge variant="success">有効</Badge></td></tr>
          </tbody>
        </table>
      </div>
    </Section>
  </Section>

  <!-- Fields -->
  <Section heading="Fields">
    <Section heading="基本フィールド">
      <Fields>
        <Field label="テキスト"><input type="text" placeholder="名前を入力..."></Field>
        <Field label="メール"><input type="email" placeholder="email@example.com"></Field>
        <Field label="パスワード" hint="8文字以上で入力してください"><input type="password" placeholder="パスワードを入力..."></Field>
        <Field label="セレクト">
          <select>
            <option value="">選択してください</option>
            <option>オプション1</option>
            <option>オプション2</option>
            <option>オプション3</option>
          </select>
        </Field>
        <Field label="テキストエリア"><textarea placeholder="本文を入力..."></textarea></Field>
      </Fields>
    </Section>

    <Section heading="チェック・トグル・ラジオ">
      <Fields>
        <Check label="利用規約に同意する" />
        <Check label="メール通知を受け取る" hint="新着情報をメールでお届けします" checked />
        <Toggle label="ダークモード" />
        <Toggle label="公開設定" checked hint="プロフィールを公開します" />
        <CheckGroup legend="通知方法">
          <li><Check label="メール" type="radio" name="notify" checked /></li>
          <li><Check label="SMS" type="radio" name="notify" /></li>
          <li><Check label="プッシュ通知" type="radio" name="notify" /></li>
        </CheckGroup>
        <CheckGroup legend="カテゴリ（横並び）" horizontal>
          <li><Check label="テクノロジー" checked /></li>
          <li><Check label="デザイン" /></li>
          <li><Check label="ビジネス" checked /></li>
          <li><Check label="マーケティング" /></li>
        </CheckGroup>
        <CheckGroup legend="優先度（横並びラジオ）" horizontal>
          <li><Check label="低" type="radio" name="priority" /></li>
          <li><Check label="中" type="radio" name="priority" checked /></li>
          <li><Check label="高" type="radio" name="priority" /></li>
        </CheckGroup>
      </Fields>
    </Section>

    <Section heading="その他の入力">
      <Fields>
        <label>
          <span>数値</span>
          <input type="number" value="42" min="0" max="100" step="1">
        </label>
        <label>
          <span>日付</span>
          <input type="date" value="2026-04-12">
        </label>
        <label>
          <span>日時</span>
          <input type="datetime-local" value="2026-04-12T09:00">
        </label>
        <label>
          <span>時刻</span>
          <input type="time" value="09:00">
        </label>
        <label>
          <span>カラー</span>
          <Cluster>
            <input type="color" value="#4f46e5">
            <Pipette style="width: var(--icon-md); height: var(--icon-md); color: var(--text-muted);" />
          </Cluster>
        </label>
        <label>
          <span>レンジ</span>
          <input type="range" min="0" max="100" value="60">
        </label>
      </Fields>
    </Section>

    <Section heading="Horizontal">
      <Fields variant="horizontal">
        <Field label="名前"><input type="text" placeholder="名前を入力..."></Field>
        <Field label="メール"><input type="email" placeholder="email@example.com"></Field>
      </Fields>
    </Section>

    <Section heading="Inline">
      <Fields as="form" variant="inline">
        <Field label="検索" hidden><input type="search" placeholder="検索..."></Field>
        <Field label="カテゴリ" hidden>
          <select>
            <option value="">すべて</option>
            <option>カテゴリA</option>
            <option>カテゴリB</option>
          </select>
        </Field>
        <Button variant="primary">検索</Button>
      </Fields>
    </Section>

    <Section heading="エラー状態（.error クラス）">
      <Fields>
        <Field label="メールアドレス" error="正しいメールアドレスを入力してください">
          <input type="email" class="error" value="invalid-email">
        </Field>
      </Fields>
    </Section>

    <Section heading="バリデーション（:user-invalid）">
      <p>フィールドを操作してからフォーカスを外すと、バリデーションエラーが表示されます。</p>
      <Fields>
        <label>
          <span>メールアドレス</span>
          <input type="email" required aria-describedby="validate-email-error" placeholder="email@example.com">
          <small id="validate-email-error" class="error-message">正しいメールアドレスを入力してください</small>
        </label>
        <label>
          <span>名前</span>
          <input type="text" required aria-describedby="validate-name-error" placeholder="名前を入力...">
          <small id="validate-name-error" class="error-message">名前は必須です</small>
        </label>
      </Fields>
    </Section>
  </Section>

  <!-- Modal -->
  <Section heading="Modal">
    <Cluster>
      <Button variant="primary" onclick={() => modalOpen = true}>モーダルを開く</Button>
    </Cluster>
    <Modal bind:open={modalOpen} label="確認">
      {#snippet header()}<h3>確認</h3>{/snippet}
      <p>この操作を実行してもよろしいですか？</p>
      {#snippet footer()}
        <Button onclick={() => modalOpen = false}>キャンセル</Button>
        <Button variant="primary" onclick={() => modalOpen = false}>確認</Button>
      {/snippet}
    </Modal>

    <Section heading="確認・入力ダイアログ（confirmDialog / promptDialog）">
      <Cluster>
        <Button onclick={async () => { dialogResult = `confirm → ${await confirmDialog({ message: 'この操作を実行してもよろしいですか？' })}`; }}>confirm</Button>
        <Button variant="danger" onclick={async () => { dialogResult = `confirm(danger) → ${await confirmDialog({ message: 'この項目を削除します。\nこの操作は元に戻せません。', title: '削除の確認', danger: true })}`; }}>confirm（danger + タイトル）</Button>
        <Button onclick={async () => { dialogResult = `prompt → ${JSON.stringify(await promptDialog({ message: '新しい名前', initial: 'example.txt' }))}`; }}>prompt</Button>
        <Button onclick={async () => {
          const a = confirmDialog({ message: '1 件目の確認です。' });
          const b = confirmDialog({ message: '2 件目の確認です（キュー動作）。' });
          dialogResult = `queue → ${await a} / ${await b}`;
        }}>連続 2 件（キュー）</Button>
      </Cluster>
      <p>結果: <code>{dialogResult}</code></p>
    </Section>
  </Section>

  <!-- Tabs -->
  <Section heading="Tabs">
    <Tabs
      label="設定タブ"
      tabs={[
        { id: 'general', label: '一般', content: generalTab },
        { id: 'security', label: 'セキュリティ', content: securityTab },
        { id: 'notify', label: '通知', content: notifyTab }
      ]}
    />
  </Section>

  <!-- Segment -->
  <Section heading="Segment">
    <Cluster>
      <Segment
        name="period"
        label="期間"
        bind:value={segmentPeriod}
        options={[
          { value: 'day', label: '日' },
          { value: 'week', label: '週' },
          { value: 'month', label: '月' },
          { value: 'year', label: '年' }
        ]}
      />
      <Segment
        name="view"
        label="表示"
        size="small"
        bind:value={segmentView}
        options={[
          { value: 'list', label: 'リスト' },
          { value: 'grid', label: 'グリッド' }
        ]}
      />
    </Cluster>
  </Section>

  <!-- Dropdown -->
  <Section heading="Dropdown">
    <Dropdown>
      {#snippet trigger(popoverId)}
        <Button popovertarget={popoverId} aria-haspopup="menu" aria-expanded="false">
          アクション<ChevronDown />
        </Button>
      {/snippet}
      {#snippet menu()}
        <li role="presentation"><button role="menuitem"><Edit />編集</button></li>
        <li role="presentation"><button role="menuitem"><Copy />複製</button></li>
        <li role="presentation"><button role="menuitem"><Archive />アーカイブ</button></li>
        <li role="separator"><hr></li>
        <li role="presentation"><button role="menuitem" class="danger"><Trash2 />削除</button></li>
      {/snippet}
    </Dropdown>
  </Section>

  <!-- Action Bar -->
  <Section heading="Action Bar">
    <div class="c-action-bar" role="toolbar" aria-label="保存バー">
      <span>未保存の変更があります</span>
      <Cluster>
        <Button size="small">破棄</Button>
        <Button variant="primary" size="small">保存</Button>
      </Cluster>
    </div>
  </Section>

  <!-- Pagination -->
  <Section heading="Pagination">
    <Pagination total={5} bind:current={currentPage} />
  </Section>

  <!-- List -->
  <Section heading="List">
    <Section heading="ul / ol">
      <Cluster data-gap="2">
        <List variants={['disc']}>
          <li>リスト項目 1</li>
          <li>リスト項目 2</li>
          <li>リスト項目 3</li>
        </List>
        <List as="ol" variants={['decimal']}>
          <li>番号付き項目 1</li>
          <li>番号付き項目 2</li>
          <li>番号付き項目 3</li>
        </List>
      </Cluster>
    </Section>

    <Section heading="Bordered / Striped / Interactive">
      <List variants={['bordered', 'striped', 'interactive']}>
        <li>クリック可能な項目 1</li>
        <li>クリック可能な項目 2</li>
        <li>クリック可能な項目 3</li>
        <li>クリック可能な項目 4</li>
      </List>
    </Section>

    <Section heading="定義リスト (dl)">
      <DefinitionList variants={['bordered']}>
        <div><dt>名前</dt><dd>田中太郎</dd></div>
        <div><dt>メール</dt><dd>tanaka@example.com</dd></div>
        <div><dt>ロール</dt><dd>管理者</dd></div>
        <div><dt>登録日</dt><dd>2025-01-15</dd></div>
      </DefinitionList>
    </Section>
  </Section>
</Main>

{#snippet generalTab()}
  <p>一般設定の内容がここに表示されます。</p>
{/snippet}

{#snippet securityTab()}
  <p>セキュリティ設定の内容がここに表示されます。</p>
{/snippet}

{#snippet notifyTab()}
  <p>通知設定の内容がここに表示されます。</p>
{/snippet}
