import { useState, useEffect } from 'react';
import { Card, Button } from '../../shared/components/ui/BaseComponents';
import { cn } from '../../shared/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../shared/components/Layout';
import { Layers, Play, SkipForward, RotateCcw, Info } from 'lucide-react';

interface Step {
  char: string;
  action: string;
  stack: string[];
  postfix: string;
  description: string;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1, '-': 1,
  '*': 2, '/': 2,
  '^': 3,
};

export const InfixToPostfix = () => {
  const [infix, setInfix] = useState(() => localStorage.getItem('infix_input') || 'A+B*C');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    localStorage.setItem('infix_input', infix);
  }, [infix]);

  const generateSteps = (input: string) => {
    const newSteps: Step[] = [];
    const stack: string[] = [];
    let postfix = '';

    // Initial state
    newSteps.push({
      char: '',
      action: 'Start',
      stack: [],
      postfix: '',
      description: 'Bắt đầu quá trình chuyển đổi.'
    });

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === ' ') continue;

      if (/[a-zA-Z0-9]/.test(char)) {
        postfix += char;
        newSteps.push({
          char,
          action: 'Operand',
          stack: [...stack],
          postfix,
          description: `"${char}" là toán hạng, đưa trực tiếp vào Postfix.`
        });
      } else if (char === '(') {
        stack.push(char);
        newSteps.push({
          char,
          action: 'Push (',
          stack: [...stack],
          postfix,
          description: `Đẩy dấu ngoặc mở "(" vào Stack.`
        });
      } else if (char === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          const op = stack.pop()!;
          postfix += op;
          newSteps.push({
            char,
            action: 'Pop to Postfix',
            stack: [...stack],
            postfix,
            description: `Gặp ")", lấy "${op}" từ Stack bỏ vào Postfix.`
          });
        }
        stack.pop(); // Remove '('
        newSteps.push({
          char,
          action: 'Remove (',
          stack: [...stack],
          postfix,
          description: `Loại bỏ dấu ngoặc tương ứng.`
        });
      } else if (PRECEDENCE[char]) {
        while (
          stack.length > 0 &&
          stack[stack.length - 1] !== '(' &&
          PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[char]
        ) {
          const op = stack.pop()!;
          postfix += op;
          newSteps.push({
            char,
            action: 'Pop higher/equal',
            stack: [...stack],
            postfix,
            description: `"${stack[stack.length - 1] || ''}" có ưu tiên >= "${char}". Lấy ra.`
          });
        }
        stack.push(char);
        newSteps.push({
          char,
          action: `Push ${char}`,
          stack: [...stack],
          postfix,
          description: `Đẩy toán tử "${char}" vào Stack.`
        });
      }
    }

    while (stack.length > 0) {
      const op = stack.pop()!;
      postfix += op;
      newSteps.push({
        char: '',
        action: 'Pop remaining',
        stack: [...stack],
        postfix,
        description: `Hết chuỗi, lấy nốt "${op}" từ Stack.`
      });
    }

    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isPlaying && currentStepIdx < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIdx((prev) => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps]);


  const currentStep = steps[currentStepIdx] || null;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <RotateCcw className="text-indigo-600 dark:text-indigo-400" size={32} />
              Infix to Postfix
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Sử dụng thuật toán Shunting-yard của Dijkstra.</p>
          </div>

          <div className="flex gap-3 h-14">
            <input
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-6 outline-none focus:border-indigo-500 font-mono font-bold text-slate-900 dark:text-white w-64 shadow-lg dark:shadow-2xl"
              value={infix}
              onChange={(e) => setInfix(e.target.value)}
              placeholder="A+B*C"
            />
            <Button onClick={() => generateSteps(infix)} className="rounded-2xl px-8">
              Bắt đầu
            </Button>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Process Card */}
              <Card className="bg-white/75 dark:bg-slate-900/40 p-10 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-500">Tiến trình</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? 'Dừng' : <><Play size={14} className="mr-2" /> Tự động</>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}>
                      <SkipForward size={14} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-12">
                  <div>
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-500 mb-4 uppercase tracking-wider">Ký tự đang xét</h4>
                    <div className="flex h-20 items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-4xl font-black text-indigo-600 dark:text-indigo-400">
                      {currentStep?.char || '—'}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-500 mb-4 uppercase tracking-wider">Hành động</h4>
                    <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      {currentStep?.action || 'Chưa bắt đầu'}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{currentStep?.description}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-500 mb-4 uppercase tracking-wider">Kết quả Postfix</h4>
                    <div className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider h-12 flex items-center">
                      {currentStep?.postfix || '...'}
                      <motion.span
                        animate={{ opacity: [0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-1 h-8 bg-emerald-600/50 dark:bg-emerald-500/50 inline-block ml-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-indigo-500/10 dark:bg-indigo-600/5 border-indigo-500/25 dark:border-indigo-500/20 p-6 flex gap-4">
                <Info className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Quy tắc quan trọng:</strong> Khi gặp toán tử, nếu toán tử đầu Stack có độ ưu tiên <strong>cao hơn hoặc bằng</strong> toán tử hiện tại, ta lấy toán tử đầu Stack ra trước.
                </div>
              </Card>
            </div>

            {/* Stack Visualizer Card */}
            <div className="space-y-6">
              <Card className="h-full min-h-[600px] flex flex-col bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900">
                <div className="text-center p-6 border-b border-slate-200 dark:border-slate-900 mb-8">
                  <h3 className="font-bold flex items-center justify-center gap-2 text-slate-600 dark:text-slate-500">
                    <Layers size={18} /> OPERATOR STACK
                  </h3>
                </div>

                <div className="flex-1 flex flex-col-reverse items-center justify-start p-8 space-y-reverse space-y-3">
                  <AnimatePresence mode="popLayout">
                    {currentStep?.stack.map((op, idx) => (
                      <motion.div
                        key={`${idx}-${op}`}
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-24 h-24 rounded-3xl bg-indigo-600/15 dark:bg-indigo-600/20 border-2 border-indigo-500/45 dark:border-indigo-500/40 flex items-center justify-center text-4xl font-black text-indigo-700 dark:text-indigo-300 shadow-xl glow-indigo"
                      >
                        {op}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {(!currentStep || currentStep.stack.length === 0) && (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                      <Layers size={120} />
                      <span className="font-bold mt-4 uppercase tracking-widest">Stack Trống</span>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-slate-100/80 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-900 rounded-b-3xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-600 uppercase">
                    <span>Bước: {currentStepIdx + 1} / {steps.length}</span>
                    <div className="flex gap-1">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            i <= currentStepIdx ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-800"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
