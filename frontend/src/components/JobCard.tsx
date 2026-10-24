import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { JobAnalysis } from '../api/client';
import CoverageChart from './CoverageChart';
import SkillGapPanel from './SkillGapPanel';
import { BriefcaseIcon, ChatIcon, CheckCircleIcon } from './icons/AppIcons';

interface JobCardProps {
  jobAnalysis: JobAnalysis;
  onDiscuss?: (jobId: string, title: string) => void;
}

export default function JobCard({ jobAnalysis, onDiscuss }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { job_id, title, company_name, skill_gap, requirements } = jobAnalysis;

  const pct = skill_gap.required_skill_coverage !== null
    ? Math.round(skill_gap.required_skill_coverage * 100)
    : null;

  const coverageColor = pct === null ? 'var(--text-secondary)'
    : pct >= 70 ? 'var(--color-teal)'
    : pct >= 40 ? 'var(--color-warning)'
    : 'var(--color-coral)';

  return (
    <article
      className="clay-card animate-fade-in"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        background: 'linear-gradient(135deg, #FAF8FD 0%, #EAE5F4 100%)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        borderLeft: '4px solid var(--color-rich-blue)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        {/* Sculpted clay icon capsule */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #426FCE 0%, #9D8AEF 100%)',
            boxShadow: 'var(--shadow-clay-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <BriefcaseIcon size={22} color="#FFFFFF" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            className="truncate"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.0625rem',
              color: 'var(--color-deep-indigo)',
              marginBottom: 2,
            }}
          >
            {title || 'Untitled Role'}
          </h3>
          <p className="truncate" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {company_name || 'Verified Employer'}
          </p>
        </div>

        {/* Coverage Percentage Badge */}
        {pct !== null && (
          <div
            style={{
              textAlign: 'center',
              flexShrink: 0,
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FE 100%)',
              boxShadow: 'var(--shadow-clay-sm)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.125rem', color: coverageColor, lineHeight: 1 }}>
              {pct}%
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>
              evidence
            </div>
          </div>
        )}
      </div>

      {/* Coverage Progress Bar */}
      <CoverageChart analysis={skill_gap} compact />

      {/* Skill Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
        {skill_gap.matched_required_skills.slice(0, 4).map((s, i) => (
          <span key={i} className="skill-chip skill-chip-matched" title="CV Evidence Found">
            <CheckCircleIcon size={12} color="var(--text-on-mint)" />
            {s.skill}
          </span>
        ))}
        {skill_gap.required_skills_not_found_in_cv.slice(0, 3).map((s, i) => (
          <span key={i} className="skill-chip skill-chip-missing" title="Not found in your CV">
            {s.skill}
          </span>
        ))}
        {(skill_gap.matched_required_skills.length + skill_gap.required_skills_not_found_in_cv.length) > 7 && (
          <span className="skill-chip skill-chip-neutral">
            +{skill_gap.matched_required_skills.length + skill_gap.required_skills_not_found_in_cv.length - 7} more
          </span>
        )}
      </div>

      {/* Experience requirement badge if available */}
      {requirements.experience_requirements.length > 0 && (
        <div
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(224, 234, 249, 0.45)',
            border: '1px solid rgba(157, 138, 239, 0.25)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--color-rich-blue)' }}>Experience: </span>
          {requirements.experience_requirements[0]}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid rgba(157, 138, 239, 0.25)',
          marginTop: 'auto',
          alignItems: 'center',
        }}
      >
        <button
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide Analysis' : 'View Skill Match'}
        </button>

        <Link
          to={`/job/${encodeURIComponent(job_id)}`}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.7rem' }}
          title="Open Dedicated Job Page"
        >
          <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>

        {onDiscuss && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onDiscuss(job_id, title)}
            title="Discuss with AI Assistant"
            style={{ padding: '0.4rem 0.75rem' }}
          >
            <ChatIcon size={14} color="#FFFFFF" />
          </button>
        )}
      </div>

      {/* Expanded analysis */}
      {expanded && (
        <div
          className="animate-fade-in"
          style={{
            borderTop: '1px solid rgba(157, 138, 239, 0.25)',
            paddingTop: 'var(--space-4)',
          }}
        >
          <SkillGapPanel analysis={skill_gap} requirements={requirements} />
        </div>
      )}
    </article>
  );
}
