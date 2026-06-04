export interface ToastItem {
  id: number;
  title: string;
  message?: string;
  variant: 'note' | 'success' | 'warning' | 'danger';
  duration: number | false;
  action?: { label: string; onClick: () => void };
}

let toasts = $state<ToastItem[]>([]);
let nextId = 0;

const DEFAULT_DURATIONS: Record<string, number | false> = {
  note: 5000,
  success: 5000,
  warning: 8000,
  danger: false,
};

// 残り時間を保持し、ホバー中は一時停止できるタイマー（adminkit.js の ToastTimer と同挙動）
interface Timer { remaining: number; start: number; handle: ReturnType<typeof setTimeout> | null; }
const timers = new Map<number, Timer>();

function startTimer(id: number, duration: number) {
  timers.set(id, { remaining: duration, start: Date.now(), handle: setTimeout(() => dismiss(id), duration) });
}

function clearTimer(id: number) {
  const t = timers.get(id);
  if (t?.handle != null) clearTimeout(t.handle);
  timers.delete(id);
}

export function getToasts() {
  return toasts;
}

export function show(opts: {
  title: string;
  message?: string;
  variant?: ToastItem['variant'];
  duration?: number | false;
  action?: { label: string; onClick: () => void };
}) {
  const variant = opts.variant ?? 'note';
  const id = nextId++;
  const duration = opts.duration ?? DEFAULT_DURATIONS[variant];
  const item: ToastItem = { id, title: opts.title, message: opts.message, variant, duration, action: opts.action };
  toasts.push(item);
  if (toasts.length > 5) {
    const removed = toasts.shift();
    if (removed) clearTimer(removed.id);
  }
  if (duration !== false) {
    startTimer(id, duration);
  }
  return { dismiss: () => dismiss(id) };
}

export function clear() {
  for (const t of timers.values()) if (t.handle != null) clearTimeout(t.handle);
  timers.clear();
  toasts = [];
}

export function dismiss(id: number) {
  clearTimer(id);
  toasts = toasts.filter(t => t.id !== id);
}

// コンテナのホバーで全トースト一時停止 / 解除
export function pauseAll() {
  for (const t of timers.values()) {
    if (t.handle == null) continue;
    clearTimeout(t.handle);
    t.handle = null;
    t.remaining -= Date.now() - t.start;
  }
}

export function resumeAll() {
  for (const [id, t] of timers) {
    if (t.handle != null) continue;
    t.start = Date.now();
    t.handle = setTimeout(() => dismiss(id), t.remaining);
  }
}
