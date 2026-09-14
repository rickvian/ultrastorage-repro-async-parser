import { Link } from 'react-router-dom';
import CaseRunner from '../../components/CaseRunner';
import { runResolvedParserCase } from './case';

export default function ResolvedCasePage() {
  return (
    <section className="case-page" aria-labelledby="page-title">
      <div className="case-page-head">
        <p className="eyebrow">
          <Link to="/">← All cases</Link>
        </p>
        <h1 id="page-title">Promise resolves to a valid envelope</h1>
      </div>

      <CaseRunner
        number="CASE 01"
        title="Resolved Promise result"
        prose={
          <p>
            The parser is expected to return a plain envelope value. Returning{' '}
            <code>Promise.resolve(validEnvelope())</code> should be detected and rejected as an
            asynchronous parser — not read as unsupported data.
          </p>
        }
        expected={
          <p>
            Throw a clear <code>TypeError</code> saying parsers must be synchronous.
          </p>
        }
        run={() => Promise.resolve(runResolvedParserCase())}
      />
    </section>
  );
}