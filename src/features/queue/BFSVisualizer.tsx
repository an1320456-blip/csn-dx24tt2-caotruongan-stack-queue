import { useState } from 'react';
import { Card, Button } from '../../shared/components/ui/BaseComponents';
import { cn } from '../../shared/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../shared/components/Layout';
import { Box, Play, RotateCcw, MousePointer2, Grid, Flag, Zap, HelpCircle } from 'lucide-react';

const GRID_SIZE = 12;

interface Node {
  r: number;
  c: number;
  type: 'empty' | 'wall' | 'start' | 'end' | 'visiting' | 'visited' | 'path';
  parent?: Node;
}

export const BFSVisualizer = () => {
  const createInitialGrid = (): Node[][] => {
    const newGrid: Node[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: Node[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let type: Node['type'] = 'empty';
        if (r === 2 && c === 2) type = 'start';
        if (r === GRID_SIZE - 3 && c === GRID_SIZE - 3) type = 'end';
        row.push({ r, c, type });
      }
      newGrid.push(row);
    }
    return newGrid;
  };

  const [grid, setGrid] = useState<Node[][]>(() => createInitialGrid());
  const [isRunning, setIsRunning] = useState(false);
  const [queue, setQueue] = useState<Node[]>([]);
  const [mode, setMode] = useState<'wall' | 'start' | 'end'>('wall');

  const initGrid = () => {
    setGrid(createInitialGrid());
    setQueue([]);
    setIsRunning(false);
  };

  const handleCellClick = (r: number, c: number) => {
    if (isRunning) return;
    const newGrid: Node[][] = grid.map(row => row.map(node => ({ ...node })));
    const cell = newGrid[r][c];

    if (mode === 'wall') {
      if (cell.type === 'empty') cell.type = 'wall';
      else if (cell.type === 'wall') cell.type = 'empty';
    } else if (mode === 'start') {
      // Clear old start
      newGrid.forEach(row => row.forEach(node => { if (node.type === 'start') node.type = 'empty'; }));
      cell.type = 'start';
    } else if (mode === 'end') {
      // Clear old end
      newGrid.forEach(row => row.forEach(node => { if (node.type === 'end') node.type = 'empty'; }));
      cell.type = 'end';
    }
    setGrid(newGrid);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runBFS = async () => {
    if (isRunning) return;
    setIsRunning(true);

    const startNode = grid.flat().find(n => n.type === 'start');
    const endNode = grid.flat().find(n => n.type === 'end');
    if (!startNode || !endNode) return;

    const q: Node[] = [startNode];
    const visited = new Set<string>();
    visited.add(`${startNode.r},${startNode.c}`);

    const newGrid: Node[][] = grid.map(row => 
      row.map(n => ({
        ...n, 
        type: (n.type === 'wall' || n.type === 'start' || n.type === 'end' ? n.type : 'empty') as Node['type']
      }))
    );

    while (q.length > 0) {
      setQueue([...q]);
      const curr = q.shift()!;
      
      if (curr.r === endNode.r && curr.c === endNode.c) {
        // Found path
        let temp: Node | undefined = curr;
        while (temp) {
          if (temp.type !== 'start' && temp.type !== 'end') {
            newGrid[temp.r][temp.c].type = 'path';
          }
          temp = temp.parent;
          setGrid(newGrid.map(row => row.map(node => ({ ...node }))));
          await sleep(50);
        }
        setIsRunning(false);
        setQueue([]);
        return;
      }

      if (curr.type !== 'start' && curr.type !== 'end') {
        newGrid[curr.r][curr.c].type = 'visited';
      }

      const neighbors = [
        { r: curr.r - 1, c: curr.c },
        { r: curr.r + 1, c: curr.c },
        { r: curr.r, c: curr.c - 1 },
        { r: curr.r, c: curr.c + 1 },
      ];

      for (const n of neighbors) {
        if (n.r >=0 && n.r < GRID_SIZE && n.c >= 0 && n.c < GRID_SIZE) {
          const neighbor = newGrid[n.r][n.c];
          if (neighbor.type !== 'wall' && !visited.has(`${n.r},${n.c}`)) {
            visited.add(`${n.r},${n.c}`);
            neighbor.parent = curr;
            if (neighbor.type !== 'end') neighbor.type = 'visiting';
            q.push(neighbor);
          }
        }
      }

      setGrid(newGrid.map(row => row.map(node => ({ ...node }))));
      await sleep(100);
    }
    
    setIsRunning(false);
    setQueue([]);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Zap className="text-emerald-600 dark:text-emerald-400" size={32} />
              Ứng dụng Queue: BFS
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Thuật toán Tìm kiếm theo chiều rộng (Breadth-First Search) để tìm đường đi ngắn nhất.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant={mode === 'start' ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={() => setMode('start')}
              className="rounded-xl px-4 h-11"
            >
              <MousePointer2 size={16} className="mr-2" /> Đặt Điểm Đầu
            </Button>
            <Button 
              variant={mode === 'end' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setMode('end')}
              className="rounded-xl px-4 h-11"
            >
              <Flag size={16} className="mr-2" /> Đặt Điểm Cuối
            </Button>
            <Button 
              variant={mode === 'wall' ? 'danger' : 'ghost'} 
              size="sm" 
              onClick={() => setMode('wall')}
              className="rounded-xl px-4 h-11"
            >
              <Grid size={16} className="mr-2" /> Vẽ Tường
            </Button>
            <div className="w-px h-11 bg-slate-300 dark:bg-slate-800 mx-2" />
            <Button onClick={runBFS} disabled={isRunning} className="rounded-xl px-6 h-11 glow-indigo">
              <Play size={16} className="mr-2" /> Chạy BFS
            </Button>
            <Button variant="ghost" onClick={initGrid} disabled={isRunning} className="rounded-xl h-11">
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          <Card className="p-4 bg-white/75 dark:bg-slate-900/40 flex items-center justify-center overflow-hidden border-slate-200 dark:border-transparent">
             <div 
               className="grid gap-1 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-2xl" 
               style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
             >
                {grid.map((row, r) => row.map((node, c) => (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 border border-slate-200/90 dark:border-white/5 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center relative",
                      node.type === 'empty' && "bg-white/90 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-white/5",
                      node.type === 'wall' && "bg-slate-500 dark:bg-slate-700 shadow-inner scale-95",
                      node.type === 'start' && "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20",
                      node.type === 'end' && "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] z-20",
                      node.type === 'visiting' && "bg-cyan-500/40 animate-pulse border-cyan-400/50",
                      node.type === 'visited' && "bg-indigo-600/30 border-indigo-500/20",
                      node.type === 'path' && "bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                    )}
                  >
                    {node.type === 'start' && <span className="text-white font-black text-xs">S</span>}
                    {node.type === 'end' && <span className="text-white font-black text-xs">E</span>}
                  </div>
                )))}
             </div>
          </Card>

          <div className="space-y-6">
             <Card className="bg-white/75 dark:bg-slate-900/40 p-8 min-h-[300px] flex flex-col border-slate-200 dark:border-transparent">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Box size={20} className="text-emerald-600 dark:text-emerald-400" />
                  Hàng Đợi Hiện Tại (Queue)
                </h3>
                <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
                   <AnimatePresence>
                     {queue.map((node) => (
                       <motion.div
                         key={`${node.r}-${node.c}`}
                         initial={{ opacity: 0, scale: 0.5 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                         className="px-3 py-1 bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/35 dark:border-emerald-400/40 rounded-lg text-xs font-mono text-emerald-800 dark:text-emerald-300"
                       >
                         ({node.r},{node.c})
                       </motion.div>
                     ))}
                   </AnimatePresence>
                   {queue.length === 0 && !isRunning && (
                     <div className="w-full h-full flex flex-col items-center justify-center pt-10 opacity-10">
                        <Box size={80} />
                        <p className="mt-4 font-bold tracking-widest uppercase">Queue Trống</p>
                     </div>
                   )}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-500 flex justify-between">
                   <span>Kích thước Queue:</span>
                   <span className="font-bold text-emerald-600 dark:text-emerald-400">{queue.length}</span>
                </div>
             </Card>

             <Card className="bg-white/65 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <HelpCircle size={18} className="text-slate-500" />
                  Bạn có biết?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ở mỗi bước, BFS lấy một node từ <strong>đầu hàng đợi</strong> ra để xử lý, sau đó thêm tất cả các hàng xóm chưa thăm vào <strong>cuối hàng đợi</strong>. 
                  Điều này đảm bảo chúng ta duyệt cây theo từng "lớp" cách đều node bắt đầu.
                </p>
             </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
