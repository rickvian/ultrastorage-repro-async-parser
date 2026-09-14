export interface TimelineEntry {
  level: 'info' | 'error';
  message: string;
}

export default function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <ol className="timeline" aria-live="polite">
        <li>Awaiting a run.</li>
      </ol>
    );
  }

  return (
    <ol className="timeline" aria-live="polite">
      {entries.map((entry, index) => (
        <li key={index} className={`timeline-item timeline-item--${entry.level}`}>
          {entry.message}
        </li>
      ))}
    </ol>
  );
}