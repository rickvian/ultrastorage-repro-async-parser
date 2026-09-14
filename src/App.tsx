import { type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResolvedCasePage from './reproduction/resolved/ResolvedCasePage';
import RejectedCasePage from './reproduction/rejected/RejectedCasePage';

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case/resolved" element={<ResolvedCasePage />} />
        <Route path="/case/rejected" element={<RejectedCasePage />} />
      </Routes>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to results
      </a>
      <main id="main-content" className="shell">
        {children}
      </main>
    </>
  );
}