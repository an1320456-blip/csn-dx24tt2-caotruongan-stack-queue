import React from 'react';
import { Link } from 'react-router-dom';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary:', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Đã xảy ra lỗi</p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Không thể hiển thị nội dung</h1>
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Bạn có thể tải lại trang hoặc quay về trang chủ.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
            <Link
              to="/"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
