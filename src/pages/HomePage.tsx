import CaseCard from '../components/CaseCard';

export default function HomePage() {
  return (
    <section className="home" aria-labelledby="home-title">
      <div className="masthead">
        <p className="eyebrow">ultrastorage@0.8.0 · behavior reproduction</p>
        <h1 id="home-title">Asynchronous custom parsers become unsupported data</h1>
        <p className="lede">
          A custom parser is a synchronous contract. Each case below isolates one consequence of a
          parser returning a Promise instead of a value.
        </p>
      </div>

      <div className="cases">
        <CaseCard
          number="01"
          to="/case/resolved"
          title="Promise resolves to a valid envelope"
          summary={
            <p>
              A parser returning <code>Promise.resolve(validEnvelope)</code> is silently classified
              as <code>unsupported</code> instead of throwing the synchronous-parser{' '}
              <code>TypeError</code> it should.
            </p>
          }
        />
        <CaseCard
          number="02"
          to="/case/rejected"
          title="Promise rejects during parsing"
          summary={
            <p>
              A parser returning a rejecting promise produces the same silent{'\u00A0'}
              <code>unsupported</code> read result and surfaces an unhandled browser rejection.
            </p>
          }
        />
      </div>

      <div className="how-to">
        <h2>Inspect it</h2>
        <p>
          Open browser Developer Tools, select the Console tab, then run a case. Each event is logged
          with a <code>[reproduction]</code> prefix; the captured error is the intended symptom.
        </p>
        <nav aria-label="Project documentation">
          <a href="./README.md">README</a>
          <a href="./MANUAL_TESTING.md">Manual testing</a>
          <a href="https://www.npmjs.com/package/ultrastorage/v/0.8.0">ultrastorage@0.8.0</a>
          <a href="./src/reproduction/resolved/case.ts">Resolver source</a>
          <a href="./src/reproduction/rejected/case.ts">Rejector source</a>
        </nav>
      </div>
    </section>
  );
}