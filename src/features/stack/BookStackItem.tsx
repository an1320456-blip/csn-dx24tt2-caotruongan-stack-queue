import { bookPalette } from './BookStackItem.utils';
import { cn } from '../../shared/lib/cn';

export interface BookStackItemProps {
  id: string;
  value: string;
  isTop: boolean;
}

export const BookStackItem = ({ id, value, isTop }: BookStackItemProps) => {
  const p = bookPalette(id);
  const displayValue = value.length > 25 ? `${value.slice(0, 23)}…` : value;

  return (
    <div
      className={cn(
        "relative w-[280px] sm:w-[320px] h-[72px] transition-all duration-300 group",
        isTop ? "z-10 -translate-y-2 drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]" : "hover:-translate-y-1 drop-shadow-sm"
      )}
    >
      {/* BOTTOM LAYER: Pages Block (shifted right and down for thickness) */}
      <div
        className="absolute w-[98%] h-full right-0 top-[20px] bg-white rounded-2xl border border-slate-200 shadow-[0_8px_16px_rgba(0,0,0,0.1)] overflow-hidden transition-all"
      >
        <div className="w-full h-full bg-[repeating-linear-gradient(to_bottom,transparent,transparent_3px,#f1f5f9_3px,#f1f5f9_6px)] opacity-80" />
      </div>

      {/* BOTTOM LAYER: Spine Cover (to connect cover and pages on the left) */}
      <div
        className="absolute top-[20px] left-0 w-10 h-full rounded-bl-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] opacity-95 transition-all"
        style={{ backgroundColor: p.coverDark }}
      />

      {/* TOP LAYER: Main Cover */}
      <div
        className="absolute inset-0 rounded-2xl flex items-center px-4 border shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: p.coverMain,
          borderColor: p.coverDark
        }}
      >
        {/* Hinge shadow (spine gutter) */}
        <div className="w-1.5 h-[120%] absolute left-5 -top-2 bg-black/15 shadow-[1px_0_0_rgba(255,255,255,0.2)]" />

        <span className="ml-7 flex-1 font-sans font-bold text-lg text-white tracking-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] select-none">
          {displayValue}
        </span>

        {/* Bento-style Icon/Mark */}
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-sm shadow-inner hidden sm:flex">
          <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-1000", isTop ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/40")} />
        </div>

        {/* Glare effect */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
