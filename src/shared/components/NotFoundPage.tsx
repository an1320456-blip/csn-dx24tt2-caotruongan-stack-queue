import { Link } from 'react-router-dom';
import { Layout } from './Layout';
import { Button } from './ui/BaseComponents';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-6xl font-black tabular-nums text-slate-300 dark:text-slate-700">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy trang</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Đường dẫn không tồn tại hoặc đã được đổi.</p>
        <Link to="/" className="mt-10 inline-block">
          <Button className="gap-2">
            <Home size={18} />
            Về trang chủ
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
