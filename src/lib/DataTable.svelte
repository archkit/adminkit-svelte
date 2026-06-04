<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'num' | 'action';
  }

  interface Props {
    data: T[];
    columns: Column[];
    compact?: boolean;
    auto?: boolean;
    selectable?: boolean;
    selected?: Set<number>;
    sort?: { key: string; direction: 'ascending' | 'descending' } | null;
    filter?: Snippet;
    row?: Snippet<[T, number]>;
    cell?: Snippet<[T, Column]>;
    actions?: Snippet<[T, number]>;
  }

  let {
    data,
    columns,
    compact = false,
    auto = false,
    selectable = false,
    selected = $bindable(new Set()),
    sort = $bindable(null),
    filter,
    row,
    cell,
    actions,
  }: Props = $props();

  const tableCls = $derived(
    ['c-table', compact && 'compact', auto && 'auto'].filter(Boolean).join(' ')
  );

  const allSelected = $derived(
    data.length > 0 && selected.size === data.length
  );

  const someSelected = $derived(
    selected.size > 0 && selected.size < data.length
  );

  function toggleAll() {
    if (allSelected) {
      selected = new Set();
    } else {
      selected = new Set(data.map((_, i) => i));
    }
  }

  function toggleRow(index: number) {
    const next = new Set(selected);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    selected = next;
  }

  function toggleSort(key: string) {
    if (sort?.key === key) {
      sort = sort.direction === 'ascending'
        ? { key, direction: 'descending' }
        : null;
    } else {
      sort = { key, direction: 'ascending' };
    }
  }

  function sortAttr(key: string): 'none' | 'ascending' | 'descending' {
    if (!sort || sort.key !== key) return 'none';
    return sort.direction;
  }
</script>

{#if filter}
  {@render filter()}
{/if}

<div class="c-table-scroll">
  <table class={tableCls}>
    <thead>
      <tr>
        {#if selectable}
          <th><input type="checkbox" aria-label="全選択" checked={allSelected} indeterminate={someSelected} onchange={toggleAll}></th>
        {/if}
        {#each columns as col}
          <th
            class={col.align || undefined}
            aria-sort={col.sortable ? sortAttr(col.key) : undefined}
          >
            {#if col.sortable}
              <button onclick={() => toggleSort(col.key)}>{col.label}</button>
            {:else}
              {col.label}
            {/if}
          </th>
        {/each}
        {#if actions}
          <th class="action"></th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each data as item, i}
        <tr class:selected={selectable && selected.has(i)}>
          {#if selectable}
            <td><input type="checkbox" aria-label="選択" checked={selected.has(i)} onchange={() => toggleRow(i)}></td>
          {/if}
          {#if row}
            {@render row(item, i)}
          {:else if cell}
            {#each columns as col}
              <td class={col.align || undefined}>
                {@render cell(item, col)}
              </td>
            {/each}
          {/if}
          {#if actions}
            <td class="action">
              {@render actions(item, i)}
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
