<script lang="ts">
  import Skeleton from './Skeleton.svelte';

  interface Props {
    /** 列数。置かれるテーブルのヘッダー列数に合わせる */
    cols: number;
  }

  let { cols }: Props = $props();

  const list = $derived(Array.from({ length: Math.max(1, cols) }, (_, i) => i));
</script>

<!--
  テーブルの <tbody> 内に置く読み込み中プレースホルダ（1 行分）。
  実テーブルの中に入れることで、ヘッダーが消えず、列幅もブラウザのテーブルレイアウトが
  決めるため、読み込み後のレイアウトのずれが小さくなる。
  読み上げは各セルではなく <table aria-busy={loading}> 側に集約する（二重読みを避ける）。
-->
<tr aria-hidden="true">
  {#each list as c (c)}
    <td><Skeleton shape="text" label={null} /></td>
  {/each}
</tr>
