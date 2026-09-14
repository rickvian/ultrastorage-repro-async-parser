import { type ReactNode, useState } from 'react';
import TimelineList from './TimelineList';

interface TimelineEntry {
  level: 'info' | 'error';
  message: string;
}

interface ReproductionCase {
  actual: string;
  reproduced: boolean;
  timeline: TimelineEntry[];
}

export interface CaseRunnerProps {
  number: string;
  title: string;
  prose: ReactNode;
  expected: ReactNode;
  run: () => Promise<ReproductionCase>;
}

export default function CaseRunner({ number, title, prose, expected, run }: CaseRunnerProps) {
  const [result, setResult] = useState<ReproductionCase | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setStatus('Running…');
    try {
      const next = await run();
      next.timeline.forEach(logTimelineEntry);
      setResult(next);
      setStatus(next.reproduced ? 'Reproduced.' : 'Completed, but not every symptom was captured.');
    } catch (error) {
      setStatus(`Failed: ${toMessage(error)}`);
      console.error('[reproduction] unexpected failure', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="case-card" aria-labelledby="case-title">
      <header>
        <p className="case-number">{number}</p>
        <h2 id="case-title">{title}</h2>
        <div className="case-prose">{prose}</div>
      </header>

      <div className="run-row">
        <button type="button" onClick={handleRun} disabled={running}>
          {running ? 'Running…' : 'Run this case'}
        </button>
        <p className="status" role="status" aria-live="polite">
          {status ?? 'Not run yet.'}
        </p>
      </div>

      <div className="comparison">
        <section className="expected">
          <h3>Expected</h3>
          {expected}
        </section>
        <section className="actual">
          <h3>Actual</h3>
          <output>{result?.actual ?? 'Run this case to inspect the result.'}</output>
        </section>
      </div>

      <div className="case-log">
        <h3>Event log</h3>
        <TimelineList entries={result?.timeline ?? []} />
      </div>
    </section>
  );
}

function logTimelineEntry(entry: TimelineEntry) {
  if (entry.level === 'error') console.error(`[reproduction] ${entry.message}`);
  else console.log(`[reproduction] ${entry.message}`);
}

function toMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}