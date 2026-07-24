import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // lucide-svelte は raw .svelte を配布するため、SSR では Vite にバンドルさせる
  // （external のままだと Node が .svelte を解決できず dev サーバーが 500 になる）
  ssr: { noExternal: ['lucide-svelte'] }
});
