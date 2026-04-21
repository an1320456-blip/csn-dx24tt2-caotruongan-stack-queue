import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../shared/components/Layout';
import { Card, Button } from '../../shared/components/ui/BaseComponents';
import { cn } from '../../shared/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, CornerDownLeft, Trash2, Eye, HelpCircle, BookOpen } from 'lucide-react';
import { BookStackItem } from './BookStackItem';
import { BOOK_STACK_DISPLAY_HEIGHT_PX, BOOK_STACK_STEP_PX } from './BookStackItem.utils';

interface StackItem {
  id: string;
  value: string;
}

const STACK_BUBBLE_DEFAULT =
  'Mỗi phần tử là một quyển sách: quyển đặt sau cùng ở trên cùng. Pop lấy đúng quyển trên đỉnh (LIFO).';

/** Chồng khít: mỗi quyển chỉ lộ ~BOOK_STACK_STEP_PX phía dưới quyển trên. */
const bookStackOverlap =
  BOOK_STACK_DISPLAY_HEIGHT_PX > BOOK_STACK_STEP_PX
    ? BOOK_STACK_DISPLAY_HEIGHT_PX - BOOK_STACK_STEP_PX
    : 0;

export const StackVisualizer = () => {
  const navigate = useNavigate();
  const [stack, setStack] = React.useState<StackItem[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [lastAction, setLastAction] = React.useState<string | null>(null);
  const [mascotLine, setMascotLine] = React.useState(STACK_BUBBLE_DEFAULT);
  const [bubbleKey, setBubbleKey] = React.useState(0);
  const [peekRing, setPeekRing] = React.useState(false);
  const peekRingTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (peekRingTimer.current) clearTimeout(peekRingTimer.current);
    };
  }, []);

  const bumpBubble = (line: string) => {
    setMascotLine(line);
    setBubbleKey((k) => k + 1);
  };

  const flashPeekRing = () => {
    if (peekRingTimer.current) clearTimeout(peekRingTimer.current);
    setPeekRing(true);
    peekRingTimer.current = setTimeout(() => {
      setPeekRing(false);
      peekRingTimer.current = null;
    }, 750);
  };

  const push = () => {
    if (!inputValue.trim()) return;
    const newItem: StackItem = {
      id: Math.random().toString(36).substr(2, 9),
      value: inputValue.trim(),
    };
    setStack((prev) => [newItem, ...prev]);
    setInputValue('');
    setLastAction(`Push "${newItem.value}"`);
    bumpBubble(`Thêm quyển mới! “${newItem.value}” nằm trên cùng — đúng LIFO.`);
  };

  const pop = () => {
    if (stack.length === 0) return;
    const removed = stack[0];
    setStack((prev) => prev.slice(1));
    setLastAction(`Pop "${removed.value}"`);
    bumpBubble(`Pop! Lấy quyển “${removed.value}” trên đỉnh trước.`);
  };

  const peek = () => {
    if (stack.length === 0) return;
    setLastAction(`Peek: Top is "${stack[0].value}"`);
    bumpBubble(`Peek: quyển trên cùng là “${stack[0].value}” (chưa pop).`);
    flashPeekRing();
  };

  const clear = () => {
    setStack([]);
    setLastAction('Clear stack');
    bumpBubble('Đã dọn hết — stack trống, có thể xếp sách mới.');
  };

  return (
    <Layout>
      <div className="grid gap-6 md:gap-8 md:grid-cols-[1fr,minmax(260px,320px)] lg:grid-cols-[1fr,350px]">
        <div className="space-y-6 md:space-y-8 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-0 sm:mb-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-slate-900 dark:text-white/90 flex items-center gap-2 sm:gap-3 min-w-0">
              <BookOpen className="text-amber-600/80 dark:text-amber-500/60 shrink-0" size={28} />
              <span className="leading-tight">Manual: Stack Story</span>
            </h2>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-2 sm:px-4 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
              Size: {stack.length} / 10
            </div>
          </div>

          <Card className="comic-dots bg-amber-500/5 border-amber-500/20 p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 min-h-0 sm:min-h-[5.5rem] shadow-inner">
            <div className="text-3xl sm:text-4xl leading-none shrink-0 opacity-80 filter grayscale-[0.2]">📚</div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-amber-800/90 dark:text-amber-200/80 uppercase tracking-tighter text-xs">Phân tích từ thủ thư:</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={bubbleKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-serif italic text-amber-950/85 dark:text-amber-50/90 mt-1"
                >
                  <span className="text-amber-600/50 dark:text-amber-500/40 text-lg">“</span>
                  {mascotLine}
                  <span className="text-amber-600/50 dark:text-amber-500/40 text-lg">”</span>
                </motion.p>
              </AnimatePresence>
            </div>
          </Card>

          <Card className="min-h-[min(52vh,380px)] sm:min-h-[440px] md:min-h-[500px] flex flex-col bg-[#f4f2ef] dark:bg-[#0c0e12] border-slate-300/80 dark:border-[#1e222d] border-b-2 border-x-2 rounded-t-none relative overflow-hidden overflow-x-hidden shadow-xl dark:shadow-2xl">
            {/* Blueprint Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1.5px)', backgroundSize: '24px 24px' }}
            />

            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none grid grid-rows-10 border-t border-amber-800/15 dark:border-amber-900/10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-t border-amber-800/10 dark:border-amber-900/5 w-full" />
              ))}
            </div>

            <div className="book-stack-stage w-full max-w-sm mx-auto z-10 px-2 pt-4 sm:pt-6">
              <div className="flex flex-col items-center">
                <AnimatePresence initial={false}>
                  {stack.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      style={{
                        zIndex: stack.length - index,
                        marginTop: index === 0 ? 0 : -bookStackOverlap,
                      }}
                      initial={{ opacity: 0, y: -56, scale: 0.88 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      className="relative flex flex-col items-center"
                    >
                      <div
                        className={cn(
                          'relative transition-[filter] duration-300',
                          index === 0 &&
                          peekRing &&
                          'brightness-125 saturate-150 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]'
                        )}
                      >
                        <BookStackItem id={item.id} value={item.value} isTop={index === 0} />
                      </div>
                      {index === 0 && (
                        <span className="sticker-badge absolute max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:-top-9 max-sm:translate-y-0 max-sm:w-max max-w-[calc(100vw-4rem)] -left-8 top-1/2 z-10 -translate-y-1/2 sm:translate-x-0 sm:-left-36 sm:max-w-none bg-amber-50 text-amber-950 dark:bg-[#1a1410] dark:text-amber-200 border border-amber-600/40 dark:border-amber-600/50 px-2 py-1.5 sm:px-4 sm:py-2 font-serif font-black text-[9px] tracking-[0.1em] sm:text-[11px] sm:tracking-[0.12em] rounded-lg sm:rounded-xl shadow-md dark:shadow-[0_10px_25px_rgba(0,0,0,0.8)] text-center">
                          Đỉnh · Index {stack.length - 1}
                          <ArrowDown size={14} className="rotate-[-90deg] translate-y-[1px] ml-1 inline opacity-80 max-sm:hidden sm:inline" />
                        </span>
                      )}
                      <span className="hidden sm:block absolute -right-8 top-1/2 z-10 -translate-y-1/2 font-serif italic text-[11px] text-amber-700/90 dark:text-amber-500/80 border-l-2 border-amber-600/25 dark:border-amber-500/20 pl-3 sm:-right-24 pointer-events-none filter drop-shadow-md">
                        Index {stack.length - index - 1}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {stack.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-1 flex-col items-center justify-center text-slate-500 dark:text-slate-600 space-y-3 sm:space-y-4 py-16 sm:py-24"
                >
                  <p className="text-5xl sm:text-6xl">📖</p>
                  <p className="text-lg sm:text-xl font-medium text-center px-2 text-slate-700 dark:text-slate-300">Chưa có quyển nào</p>
                  <p className="text-sm text-center max-w-xs text-slate-600 dark:text-slate-400">
                    Push để đặt thêm một quyển lên đỉnh chồng.
                  </p>
                </motion.div>
              )}

              {/* Desk Surface */}
              <div className="book-desk w-full max-w-[min(100%,320px)] sm:w-[120%] h-10 sm:h-12 bg-[#1a1410] border-t-2 border-[#3d2e24] shadow-[0_-12px_45px_rgba(0,0,0,0.8)] mt-[-12px] relative z-0 flex items-center justify-center self-center">
                <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none absolute inset-0" />
                <div className="w-1/2 h-1 bg-white/5 blur-sm" />
              </div>
            </div>
            {/* Ambient Base Glow */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-amber-200/30 dark:bg-amber-900/10 blur-2xl pointer-events-none" />
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6 min-w-0 order-first md:order-none">
          <Card className="space-y-4 sm:space-y-6 bg-white/75 dark:bg-slate-900/40 p-4 sm:p-6 md:p-8 border-slate-200/80 dark:border-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">Thao tác</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Giá trị (X)</label>
                <div className="relative">
                  <input
                    autoFocus
                    className="w-full bg-white dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-700"
                    placeholder="Nhập phần tử..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && push()}
                  />
                  <CornerDownLeft className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={push}
                  disabled={stack.length >= 10 || !inputValue.trim()}
                  className="h-12 rounded-xl bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] border-none"
                >
                  Push (vào)
                </Button>
                <Button onClick={pop} disabled={stack.length === 0} variant="secondary" className="h-12 rounded-xl">
                  Pop (ra)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={peek}
                  disabled={stack.length === 0}
                  variant="ghost"
                  className="h-12 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-xl"
                >
                  <Eye size={18} /> Peek
                </Button>
                <Button onClick={clear} variant="danger" className="h-12 rounded-xl">
                  <Trash2 size={18} /> Clear
                </Button>
              </div>
            </div>

            {lastAction && (
              <motion.div
                key={lastAction}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/25 dark:border-amber-500/20 text-amber-900/85 dark:text-amber-200/70 text-xs font-mono flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
                {lastAction.toUpperCase()}
              </motion.div>
            )}
          </Card>

          <Card className="bg-white/60 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <HelpCircle size={18} className="text-slate-500" />
              Comic note
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Giống chồng sách: quyển đặt lên sau cùng nằm trên cùng và được lấy ra trước. Đó là LIFO: Last In,
              First Out.
            </p>
            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <code className="text-indigo-600 dark:text-indigo-400 text-xs">stack.push(x)</code>
              <code className="text-indigo-600 dark:text-indigo-400 text-xs block mt-1">stack.pop()</code>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-amber-700/80 dark:text-amber-500/60 hover:text-amber-900 dark:hover:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-500/5 font-serif italic"
              onClick={() => navigate('/stack/infix')}
            >
              Xem ứng dụng Postfix <ArrowDown size={14} className="rotate-[-90deg] ml-1" />
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
