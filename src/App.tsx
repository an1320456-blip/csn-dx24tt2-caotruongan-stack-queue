import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { RouteFallback } from './shared/components/RouteFallback';

const Home = lazy(() => import('./shared/components/Home').then((m) => ({ default: m.Home })));
const StackVisualizer = lazy(() =>
  import('./features/stack/StackVisualizer').then((m) => ({ default: m.StackVisualizer }))
);
const InfixToPostfix = lazy(() =>
  import('./features/stack/InfixToPostfix').then((m) => ({ default: m.InfixToPostfix }))
);
const QueueVisualizer = lazy(() =>
  import('./features/queue/QueueVisualizer').then((m) => ({ default: m.QueueVisualizer }))
);
const BFSVisualizer = lazy(() =>
  import('./features/queue/BFSVisualizer').then((m) => ({ default: m.BFSVisualizer }))
);
const PracticePage = lazy(() =>
  import('./features/practice/PracticePage').then((m) => ({ default: m.PracticePage }))
);
const AboutPage = lazy(() => import('./features/about/AboutPage').then((m) => ({ default: m.AboutPage })));
const NotFoundPage = lazy(() =>
  import('./shared/components/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stack" element={<StackVisualizer />} />
          <Route path="/stack/infix" element={<InfixToPostfix />} />
          <Route path="/queue" element={<QueueVisualizer />} />
          <Route path="/queue/bfs" element={<BFSVisualizer />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/playground" element={<Navigate to="/practice" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
