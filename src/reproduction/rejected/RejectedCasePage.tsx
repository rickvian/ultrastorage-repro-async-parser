import { Link } from 'react-router-dom';
import CaseRunner from '../../components/CaseRunner';
import { runRejectedParserCase } from './case';

export default function RejectedCasePage() {
  return (
    <section className="case-page" aria-labelledby="page-title">
      <div className="case-page-head">
        <p className="eyebrow">
          <Link to="/">← All cases</Link>
        </p>
        <h1 id="page-title">Promise rejects during parsing</h1>
      </div>

      <CaseRunner
        number="CASE 02"
        title="Rejected Promise result"
        prose={
          <p>
            A rejected parser promise produces the same silent <code>unsupported</code> read result.{' '}
            It should instead be rejected with the synchronous-parser <code>TypeError</code>, and the
            underlying promise rejection should be consumed — in 0.8.0 it reaches the browser's
            global <code>unhandledrejection</code> path.
          </p>
        }
        expected={
          <p>
            Detect Promise-like parser output, throw <code>TypeError</code>, and consume the
            rejection so no unhandled rejection leaks.
          </p>
        }
        run={runRejectedParserCase}
      />
    </section>
  );
}