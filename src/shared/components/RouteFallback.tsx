/** Hiển thị khi chunk route đang tải (lazy). */
export function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 py-16" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-400" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Đang tải…</p>
    </div>
  );
}
