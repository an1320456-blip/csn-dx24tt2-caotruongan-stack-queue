import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../shared/lib/cn';

const markdownComponents: Components = {
  h1: ({ children, className }) => (
    <h1
      className={cn(
        'text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-6 mt-2',
        className
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className }) => (
    <h2
      className={cn(
        'text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 border-b border-slate-200 dark:border-white/10 pb-2',
        className
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className }) => (
    <h3 className={cn('text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3', className)}>{children}</h3>
  ),
  h4: ({ children, className }) => (
    <h4 className={cn('text-base font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2', className)}>{children}</h4>
  ),
  p: ({ children, className }) => (
    <p className={cn('text-slate-700 dark:text-slate-300 leading-relaxed mb-4', className)}>{children}</p>
  ),
  ul: ({ children, className }) => (
    <ul className={cn('list-disc pl-6 space-y-2 my-4 text-slate-700 dark:text-slate-300', className)}>{children}</ul>
  ),
  ol: ({ children, className }) => (
    <ol className={cn('list-decimal pl-6 space-y-2 my-4 text-slate-700 dark:text-slate-300', className)}>{children}</ol>
  ),
  li: ({ children, className }) => <li className={cn('leading-relaxed', className)}>{children}</li>,
  a: ({ href, children, className }) => (
    <a
      href={href}
      className={cn(
        'text-indigo-600 dark:text-indigo-400 font-semibold underline decoration-indigo-400/50 underline-offset-2 hover:decoration-indigo-500',
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children, className }) => (
    <strong className={cn('font-bold text-slate-900 dark:text-white', className)}>{children}</strong>
  ),
  hr: () => <hr className="my-10 border-slate-200 dark:border-white/10" />,
  blockquote: ({ children, className }) => (
    <blockquote
      className={cn(
        'border-l-4 border-indigo-500/60 pl-4 my-4 text-slate-600 dark:text-slate-400 italic',
        className
      )}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className?.includes('language-'));
    if (!isBlock) {
      return (
        <code
          className="rounded-md bg-slate-200/90 dark:bg-slate-800 px-1.5 py-0.5 text-[0.875em] font-mono text-rose-700 dark:text-rose-300"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn('font-mono text-sm text-slate-100', className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, className }) => (
    <pre
      className={cn(
        'overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-slate-900 p-4 my-4 shadow-inner',
        className
      )}
    >
      {children}
    </pre>
  ),
  table: ({ children, className }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-white/10">
      <table className={cn('min-w-full text-sm text-left', className)}>{children}</table>
    </div>
  ),
  thead: ({ children, className }) => (
    <thead className={cn('bg-slate-100 dark:bg-slate-900/80', className)}>{children}</thead>
  ),
  tbody: ({ children, className }) => <tbody className={cn('divide-y divide-slate-200 dark:divide-white/10', className)}>{children}</tbody>,
  tr: ({ children, className }) => <tr className={cn('border-slate-200 dark:border-white/5', className)}>{children}</tr>,
  th: ({ children, className }) => (
    <th className={cn('px-4 py-3 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10', className)}>
      {children}
    </th>
  ),
  td: ({ children, className }) => (
    <td className={cn('px-4 py-2.5 text-slate-700 dark:text-slate-300 align-top', className)}>{children}</td>
  ),
};

export function MarkdownArticle({ markdown }: { markdown: string }) {
  return (
    <article className="max-w-3xl prose-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
