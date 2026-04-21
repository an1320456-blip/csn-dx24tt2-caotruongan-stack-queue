import React from 'react';
import { Layout } from '../../shared/components/Layout';
import { Card, Button } from '../../shared/components/ui/BaseComponents';
import { cn } from '../../shared/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Trash2, Eye, HelpCircle, MoveRight, PlayCircle, Film, ChevronLeft, ChevronRight } from 'lucide-react';

interface QueueItem {
  id: string;
  value: string;
  color: string;
}

const CINEMA_BUBBLE_DEFAULT =
  'Chào mừng đến với buổi công chiếu! Khách đến trước sẽ được soát vé và vào rạp trước — đúng chuẩn FIFO (First In, First Out).';

const CinemaTicket = ({ value, index, isFirst, isLast }: { value: string; index: number; isFirst: boolean; isLast: boolean }) => {
  return (
    <div className="ticket-3d-host group">
      <div className="ticket-3d-face">
        <div className={cn(
          "ticket-body",
          isFirst && "ring-2 ring-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        )}>
          <div className="ticket-perforation" />
          <div className="ticket-perforation-right" />
          <div className="ticket-stub-line" />
          <div className="ticket-logo">PREMIERE TICKET</div>
          
          <div className="ticket-content">
            <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Admit One</div>
            <div className="text-lg font-black truncate pr-10">{value}</div>
            <div className="mt-2 flex items-center justify-between text-[9px] font-bold uppercase opacity-60">
              <span>Row: {index}</span>
              <span className="pr-2">#00{index + 1}</span>
            </div>
          </div>
        </div>
      </div>
      
      {isFirst && (
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticker-badge absolute -top-12 left-1/2 -translate-x-1/2 bg-amber-500/20 px-3 py-1 text-amber-200 font-black text-[10px] uppercase tracking-widest whitespace-nowrap border-amber-500/30"
        >
          SOÁT VÉ TIẾP THEO <MoveRight size={12} className="inline ml-1 rotate-90" />
        </motion.span>
      )}

      {isLast && (
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-600 dark:text-slate-500 font-bold text-[10px] uppercase tracking-tighter">
          Vừa xếp hàng
        </span>
      )}
    </div>
  );
};

export const QueueVisualizer = () => {
  const [queue, setQueue] = React.useState<QueueItem[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [lastAction, setLastAction] = React.useState<string | null>(null);
  const [mascotLine, setMascotLine] = React.useState(CINEMA_BUBBLE_DEFAULT);
  const [bubbleKey, setBubbleKey] = React.useState(0);
  const ticketStripRef = React.useRef<HTMLDivElement>(null);
  const [stripScroll, setStripScroll] = React.useState({ canLeft: false, canRight: false, needsScroll: false });

  const updateStripArrows = React.useCallback(() => {
    const el = ticketStripRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const sl = el.scrollLeft;
    setStripScroll({
      canLeft: sl > 1,
      canRight: sl < max - 1,
      needsScroll: max > 1,
    });
  }, []);

  React.useLayoutEffect(() => {
    updateStripArrows();
  }, [queue, updateStripArrows]);

  React.useEffect(() => {
    const el = ticketStripRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateStripArrows());
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateStripArrows]);

  const scrollTicketStrip = (dir: -1 | 1) => {
    const el = ticketStripRef.current;
    if (!el) return;
    const step = Math.max(220, Math.floor(el.clientWidth * 0.55));
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const el = ticketStripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const canScrollX = el.scrollWidth > el.clientWidth;
      if (!canScrollX) return;
      const atLeft = el.scrollLeft <= 0;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((e.deltaY < 0 && atLeft) || (e.deltaY > 0 && atRight)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const bumpBubble = (line: string) => {
    setMascotLine(line);
    setBubbleKey((k) => k + 1);
  };

  const enqueue = () => {
    if (!inputValue.trim()) return;
    const newItem: QueueItem = {
      id: Math.random().toString(36).substr(2, 9),
      value: inputValue.trim(),
      color: '', // Managed by CSS theme now
    };
    setQueue((prev) => [...prev, newItem]);
    setInputValue('');
    setLastAction(`Enqueue "${newItem.value}"`);
    bumpBubble(`Khách "${newItem.value}" đã lấy số và đứng vào cuối hàng.`);
  };

  const dequeue = () => {
    if (queue.length === 0) return;
    const removed = queue[0];
    setQueue((prev) => prev.slice(1));
    setLastAction(`Dequeue "${removed.value}"`);
    bumpBubble(`Chúc khách "${removed.value}" xem phim vui vẻ! Đã soát vé xong.`);
  };

  const peekHead = () => {
    if (queue.length === 0) return;
    setLastAction(`Front is "${queue[0].value}"`);
    bumpBubble(`Kiểm tra: vé tiếp theo thuộc về "${queue[0].value}".`);
  };

  const clear = () => {
    setQueue([]);
    setLastAction('Clear queue');
    bumpBubble('Rạp đã đóng cửa. Hẹn gặp lại quý khách sau!');
  };

  return (
    <Layout>
      <div className="grid lg:grid-cols-[1fr,350px] gap-8">
        <div className="space-y-8 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter italic uppercase">
                <Film className="text-amber-600 dark:text-amber-500" size={32} />
                Cinema Story: The Premiere
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-500">Mô phỏng hàng đợi lấy vé xem rạp — Đúng chuẩn FIFO</p>
            </div>
            <div className="text-sm font-bold text-amber-800 dark:text-amber-500/80 bg-amber-50 dark:bg-slate-900 px-5 py-2.5 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-lg dark:shadow-xl">
              Capacity: {queue.length} / 6
            </div>
          </div>

          <Card className="comic-bubble bg-amber-500/5 border-amber-500/10 p-6 flex items-start gap-5 min-h-[6rem] shadow-inner marker:border-amber-500/20">
            <div className="text-4xl leading-none shrink-0 filter drop-shadow-lg">🤵‍♂️</div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-amber-500 text-[10px] uppercase tracking-widest mb-1">Nhân viên soát vé:</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={bubbleKey}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-base font-medium text-amber-950/90 dark:text-amber-50/90 leading-snug"
                >
                  “{mascotLine}”
                </motion.p>
              </AnimatePresence>
            </div>
          </Card>

          <Card className="min-h-[450px] flex items-center justify-start bg-[#e8eef5] dark:bg-[#020617] border-slate-300/80 dark:border-slate-900 overflow-hidden relative cinema-stage p-0 min-w-0">
            {/* Red Carpet background element */}
            <div className="red-carpet" />
            
            {/* Barrier Ropes */}
            <div className="barrier-ropes" />
            <div className="barrier-post left-[20%]" />
            <div className="barrier-post left-[50%]" />
            <div className="barrier-post left-[80%]" />

            {/* Cinema Door (Exit) */}
            <div className="absolute left-0 bottom-0 top-0 z-40">
              <div className="cinema-door" />
            </div>

            {queue.length > 0 && stripScroll.needsScroll && (
              <>
                <button
                  type="button"
                  aria-label="Cuộn hàng vé sang trái"
                  disabled={!stripScroll.canLeft}
                  onClick={() => scrollTicketStrip(-1)}
                  className={cn(
                    'absolute left-2 top-1/2 z-[45] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/40 bg-white/95 dark:bg-slate-950/90 text-amber-700 dark:text-amber-400 shadow-lg shadow-black/10 dark:shadow-black/40 backdrop-blur-sm transition-all hover:border-amber-500/60 hover:bg-amber-50 dark:hover:bg-slate-900 hover:text-amber-900 dark:hover:text-amber-300',
                    !stripScroll.canLeft && 'pointer-events-none opacity-25',
                  )}
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Cuộn hàng vé sang phải"
                  disabled={!stripScroll.canRight}
                  onClick={() => scrollTicketStrip(1)}
                  className={cn(
                    'absolute right-2 top-1/2 z-[45] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/40 bg-white/95 dark:bg-slate-950/90 text-amber-700 dark:text-amber-400 shadow-lg shadow-black/10 dark:shadow-black/40 backdrop-blur-sm transition-all hover:border-amber-500/60 hover:bg-amber-50 dark:hover:bg-slate-900 hover:text-amber-900 dark:hover:text-amber-300',
                    !stripScroll.canRight && 'pointer-events-none opacity-25',
                  )}
                >
                  <ChevronRight size={22} strokeWidth={2.5} />
                </button>
              </>
            )}

            <div 
              ref={ticketStripRef}
              onScroll={updateStripArrows}
              className="min-w-0 w-full max-w-full flex items-center gap-12 px-20 pl-48 pr-72 z-10 overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth pb-20 custom-scrollbar touch-pan-x select-none cursor-grab active:cursor-grabbing [scrollbar-gutter:stable]"
            >
              <AnimatePresence initial={false}>
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 300, scale: 0.9, rotateY: 45 }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, x: -500, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.5 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="shrink-0"
                  >
                    <CinemaTicket 
                      value={item.value} 
                      index={index} 
                      isFirst={index === 0}
                      isLast={index === queue.length - 1}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {queue.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-500/70 dark:text-slate-700/40 z-0 pl-16 pt-10 pointer-events-none"
                >
                  <Ticket size={120} strokeWidth={1} />
                  <p className="text-xl font-black uppercase tracking-[0.2em] mt-4">Sảnh đang trống</p>
                  <p className="text-xs font-bold">Hãy mời thêm khách bằng Enqueue</p>
                </motion.div>
              )}
            </div>

            {/* Ambient Lighting */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/25 dark:from-black/60 to-transparent z-20" />
            <div className="absolute left-48 top-0 w-32 h-full bg-amber-500/5 blur-3xl pointer-events-none z-0" />
          </Card>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-6">
          <Card className="space-y-6 bg-white/80 dark:bg-slate-900/60 p-8 shadow-xl dark:shadow-2xl border-slate-200/80 dark:border-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Ticket className="text-amber-600 dark:text-amber-500" size={20} />
              Quầy Vé
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed italic">Nhập tên khách hàng và bấm Enqueue để thêm vào hàng đợi.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500">Tên Khách Hàng</label>
                <div className="relative">
                  <input
                    autoFocus
                    className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-all font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-inner"
                    placeholder="Nguyễn Văn A..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enqueue()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={enqueue} 
                  disabled={queue.length >= 6 || !inputValue.trim()} 
                  className="h-14 rounded-xl bg-amber-600 border-amber-500 hover:bg-amber-500 text-amber-950 font-black text-base shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all active:scale-95"
                >
                  Enqueue (Mời vào)
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={dequeue} disabled={queue.length === 0} variant="secondary" className="h-12 rounded-xl group relative overflow-hidden">
                    <span className="relative z-10">Soát Vé</span>
                    <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors" />
                  </Button>
                  <Button onClick={peekHead} disabled={queue.length === 0} variant="ghost" className="h-12 border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-900">
                    <Eye size={18} className="mr-2" /> Xem
                  </Button>
                </div>
              </div>

              <Button onClick={clear} variant="ghost" className="w-full h-10 border-transparent text-slate-500 hover:text-red-600 dark:text-slate-600 dark:hover:text-red-400 rounded-xl transition-colors text-xs font-bold uppercase">
                <Trash2 size={14} className="mr-2" /> Đóng rạp (Clear)
              </Button>
            </div>

            {lastAction && (
              <motion.div
                key={lastAction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 text-amber-900/80 dark:text-amber-200/60 text-[10px] font-mono tracking-tighter flex items-center justify-center gap-3 uppercase"
              >
                <PlayCircle size={12} className="text-amber-500" />
                {lastAction}
              </motion.div>
            )}
          </Card>

          <Card className="bg-white/65 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 p-8 space-y-5 shadow-lg dark:shadow-2xl">
            <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <HelpCircle size={18} className="text-amber-600/80 dark:text-amber-500/60" />
              Kiến thức FIFO
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic font-serif">
                "Tại rạp phim, người nào mua vé trước sẽ được vào rạp trước. Đây chính là chuẩn mực của Hàng đợi."
              </p>
              <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-amber-700 dark:text-amber-400 text-[10px] font-bold">enqueue()</code>
                  <span className="text-[9px] text-slate-500 dark:text-slate-600 uppercase">Vào cuối hàng (Tail)</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-amber-700 dark:text-amber-400 text-[10px] font-bold">dequeue()</code>
                  <span className="text-[9px] text-slate-500 dark:text-slate-600 uppercase">Ra từ đầu hàng (Front)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

