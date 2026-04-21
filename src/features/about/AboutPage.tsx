import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../shared/components/Layout';
import { cn } from '../../shared/lib/cn';
import { MarkdownArticle } from './MarkdownArticle';
import {
  ABOUT_SECTIONS,
  DEFAULT_ABOUT_SLUG,
  getSectionBySlug,
  isValidAboutSlug,
} from './aboutSources';
import type { AboutSlug } from './aboutSources';

export const AboutPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugParam = searchParams.get('doc');

  const activeSlug: AboutSlug = useMemo(() => {
    if (slugParam && isValidAboutSlug(slugParam)) return slugParam;
    return DEFAULT_ABOUT_SLUG;
  }, [slugParam]);

  const active = useMemo(() => getSectionBySlug(activeSlug), [activeSlug]);

  useEffect(() => {
    if (slugParam !== null && slugParam !== '' && !isValidAboutSlug(slugParam)) {
      setSearchParams({}, { replace: true });
    }
  }, [slugParam, setSearchParams]);

  const setDoc = (slug: AboutSlug) => {
    setSearchParams(slug === DEFAULT_ABOUT_SLUG ? {} : { doc: slug }, { replace: true });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <aside className="w-full shrink-0 lg:w-72">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Tài liệu đồ án</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Nội dung Markdown trong <code className="text-xs font-mono text-rose-600 dark:text-rose-300">docs/bao-cao-do-an/</code>.
          </p>

          <label className="lg:hidden block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Chọn mục</label>
          <select
            className="lg:hidden w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white mb-4"
            value={activeSlug}
            onChange={(e) => setDoc(e.target.value as AboutSlug)}
          >
            {ABOUT_SECTIONS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>

          <nav className="hidden lg:block space-y-0.5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
            {ABOUT_SECTIONS.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setDoc(s.slug)}
                className={cn(
                  'w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors',
                  activeSlug === s.slug
                    ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                )}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 p-6 sm:p-8 shadow-sm">
          <MarkdownArticle markdown={active.content} />
        </div>
      </div>
    </Layout>
  );
};
