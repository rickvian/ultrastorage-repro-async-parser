import { runReproduction, type TimelineEntry } from './reproduction';
import './styles.css';

const runButton = requiredElement<HTMLButtonElement>('run-button');
const status = requiredElement<HTMLElement>('status');
const resolvedActual = requiredElement<HTMLOutputElement>('resolved-actual');
const rejectedActual = requiredElement<HTMLOutputElement>('rejected-actual');
const timeline = requiredElement<HTMLOListElement>('timeline');

runButton.addEventListener('click', async () => {
  runButton.disabled = true;
  status.textContent = 'Running reproduction…';
  try {
    const result = await runReproduction();
    resolvedActual.textContent = result.resolved.actual;
    rejectedActual.textContent = result.rejected.actual;
    renderTimeline(result.timeline);
    status.textContent = result.resolved.reproduced && result.rejected.reproduced
      ? 'Reproduction complete: both asynchronous parser cases were observed.'
      : 'Reproduction completed, but this runtime did not capture every expected symptom.';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    status.textContent = `The demonstration could not complete: ${message}`;
    console.error('[reproduction] unexpected demonstration failure', error);
  } finally {
    runButton.disabled = false;
  }
});

function renderTimeline(entries: TimelineEntry[]) {
  timeline.replaceChildren(...entries.map((entry) => {
    const item = document.createElement('li');
    item.className = `timeline-item timeline-item--${entry.level}`;
    item.textContent = entry.message;
    if (entry.level === 'error') console.error(`[reproduction] ${entry.message}`);
    else console.log(`[reproduction] ${entry.message}`);
    return item;
  }));
}

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required element #${id}`);
  return element as T;
}
