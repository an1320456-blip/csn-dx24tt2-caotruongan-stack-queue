import { Card, Button } from './ui/BaseComponents';
import { cn } from '../lib/cn';
import { Layout } from './Layout';
import { ArrowRight, Layers, Box, Cpu, Braces, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  colorClass?: string;
  link: string;
  badge?: string;
  children?: ReactNode;
}

const FeatureCard = ({ title, desc, icon: Icon, colorClass, link, badge, children }: FeatureCardProps) => (
  <Link to={link}>
    <Card className={cn("relative overflow-hidden cursor-pointer group bg-white/80 dark:bg-slate-900/60 p-10 h-full border-slate-200/80 dark:border-white/5 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 transition-all duration-500 glow-indigo group-hover:bg-white dark:group-hover:bg-slate-900/80", colorClass)}>
      {badge && (
        <span className="absolute top-5 right-5 bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-500/25 dark:border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          {badge}
        </span>
      )}
      <div className="flex flex-col h-full pt-4">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center glow-indigo group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
            <Icon size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors tracking-tight">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg flex-1 mb-8 leading-relaxed font-medium">{desc}</p>
        <div className="flex items-center gap-2.5 font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-5 transition-all">
          <span>Khám phá ngay</span>
          <ArrowRight size={22} className="opacity-70 group-hover:opacity-100" />
        </div>
      </div>
      {children}
    </Card>
  </Link>
);

export const Home = () => {
  return (
    <Layout>
      <div className="py-12 space-y-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-sm font-bold mb-4 tracking-tight"
          >
            <Sparkles size={16} />
            Hành trình chinh phục cấu trúc dữ liệu bắt đầu tại đây
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tighter">
            Học Thuật Toán <br/> 
            <span className="text-gradient">Trực Quan Hóa.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Công cụ hỗ trợ sinh viên nắm vững Stack và Queue thông qua các hiệu ứng hoạt ảnh sinh động và bài toán thực tế.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14">
            <Link to="/stack">
              <Button size="lg" className="px-12 h-16 text-xl font-black glow-indigo rounded-2xl bg-indigo-600 hover:bg-indigo-500">
                Bắt đầu học Stack
              </Button>
            </Link>
            <Link to="/queue">
              <Button size="lg" variant="secondary" className="px-12 h-16 text-xl font-black rounded-2xl">
                Tìm hiểu Queue
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <FeatureCard 
            title="Ngăn xếp (Stack - LIFO)"
            desc="Cấu trúc dữ liệu dạng chồng, phần tử nào vào cuối cùng sẽ ra trước tiên. Tìm hiểu kỹ chế độ Push, Pop và Peek."
            icon={Layers}
            link="/stack"
            badge="Phổ biến nhất"
          />
          <FeatureCard 
            title="Hàng đợi (Queue - FIFO)"
            desc="Học cách dữ liệu được xếp hàng và xử lý theo lượt. Từ Enqueue đến Dequeue, nắm bắt mọi chuyển động."
            icon={Box}
            link="/queue"
            badge="Nền tảng"
          />
        </div>

        {/* Sub-features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-0 mt-20 pt-20 border-t border-slate-200 dark:border-white/5">
           <Card className="p-10 bg-white/70 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/50 border-slate-200/80 dark:border-white/5 transition-all duration-300">
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                  <Braces size={28} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Chuyển đổi Infix</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium h-20 overflow-hidden">Áp dụng Stack để chuyển đổi các biểu thức toán học từ trung tố sang hậu tố (Postfix) một cách mượt mà.</p>
              <Link to="/stack/infix" className="text-cyan-700 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1.5 transition-all hover:gap-3">
                Xem thử <ArrowRight size={18} />
              </Link>
           </Card>
           
           <Card className="p-10 bg-white/70 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/50 border-slate-200/80 dark:border-white/5 transition-all duration-300">
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <Cpu size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Tìm kiếm BFS</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium h-20 overflow-hidden">Sử dụng Queue để duyệt tìm đường đi ngắn nhất trên đồ thị (BFS). Trực quan hóa từng bước hàng đợi hoạt động.</p>
              <Link to="/queue/bfs" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1.5 transition-all hover:gap-3">
                Thử nghiệm <ArrowRight size={18} />
              </Link>
           </Card>

           <Card className="p-10 bg-white/70 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/50 border-slate-200/80 dark:border-white/5 transition-all duration-300">
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                  <BookOpen size={28} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ôn tập trắc nghiệm</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium h-20 overflow-hidden">Đề trắc nghiệm Stack và Queue: lọc chủ đề, làm từng câu, nộp bài và xem điểm ngay.</p>
              <Link to="/practice" className="text-orange-700 dark:text-orange-400 font-bold hover:underline flex items-center gap-1.5 transition-all hover:gap-3">
                Mở Practice <ArrowRight size={18} />
              </Link>
           </Card>
        </div>
      </div>
    </Layout>
  );
};
