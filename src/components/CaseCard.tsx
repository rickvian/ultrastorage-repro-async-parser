import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CaseRunner from './CaseRunner';

export interface CaseCardProps {
  number: string;
  to: string;
  title: string;
  summary: ReactNode;
}

export default function CaseCard({ number, to, title, summary }: CaseCardProps) {
  return (
    <Link className="case-link" to={to} aria-labelledby={`link-${number}`}>
      <p className="case-number">{number}</p>
      <h2 id={`link-${number}`}>{title}</h2>
      {summary}
      <p className="case-link-cta">Open case →</p>
    </Link>
  );
}