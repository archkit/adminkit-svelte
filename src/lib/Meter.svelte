<script module lang="ts">
  /**
   * 内訳の帯（.c-meter）。1 本の帯を複数の区分で埋めて構成比を見せる。
   *
   * 単一の進捗（0〜100% の 1 値）は Progress（native <progress>）を使う。
   * <progress> は値を 1 つしか持てないため、区分が複数ある表現はこちらが担当する。
   */
  export type MeterVariant = 'success' | 'warning' | 'danger';

  export interface MeterSegment {
    /** 帯に占める割合（%）。合計が 100 未満なら残りは地のまま見える */
    width: number;
    variant?: MeterVariant;
  }
</script>

<script lang="ts">
  interface Props {
    segments: MeterSegment[];
    /** 既定 / 区分を複数並べる（stacked） / 行に添える（inline） */
    size?: 'default' | 'stacked' | 'inline';
    /** 読み上げ用のラベル。value を渡したときは見出しとしても表示する */
    label: string;
    /** 右側に出す値（例 "68%"）。渡すとラベル行（.c-meter-label）が出る */
    value?: string;
    class?: string;
    [key: string]: unknown;
  }

  let { segments, size = 'default', label, value, class: className = '', ...rest }: Props = $props();

  const cls = $derived(
    ['c-meter', size !== 'default' && size, className].filter(Boolean).join(' ')
  );
</script>

{#if value !== undefined}
  <div class="c-meter-label"><span>{label}</span><span>{value}</span></div>
{/if}
<div class={cls} role="img" aria-label={value === undefined ? label : `${label} ${value}`} {...rest}>
  {#each segments as seg}
    <span class={seg.variant} style="width: {seg.width}%"></span>
  {/each}
</div>
