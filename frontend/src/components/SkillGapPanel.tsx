import { useState } from 'react';
import type { SkillGapAnalysis, JobRequirementsData } from '../api/client';
import CoverageChart from './CoverageChart';

interface SkillGapPanelProps {
  analysis: SkillGapAnalysis;
  requirements: JobRequirementsData;
  priorityImprovements?: string[];
}

type Tab = 'overview' | 'matched' | 'gaps' | 'improvements';

export default function SkillGapPanel({ analysis, requirements, priorityImprovements }: SkillGapPanelProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [expandedEvidence, setExpandedEvidence] = useState<Set<number>>(new Set());

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'matched', label: 'Matched', count: analysis.matched_required_skills.length + analysis.matched_preferred_skills.length },
    { key: 'gaps', label: 'Gaps', count: analysis.required_skills_not_found_in_cv.length },
    { key: 'improvements', label: 'Improvements', count: priorityImprovements?.length },
  ];

  const toggleEvidence = (idx: number) => {
    setExpandedEvidence(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(169,154,255,0.08)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 'var(--space-4)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="btn btn-sm"
            style={{
              flex: 1,
              background: tab === t.key ? 'white' : 'transparent',
              boxShadow: tab === t.key ? 'var(--shadow-clay-sm)' : 'none',
              color: tab === t.key ? 'var(--color-midnight-plum)' : 'var(--color-muted-slate)',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              padding: 'var(--space-2) var(--space-2)',
              justifyContent: 'center',
            }}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span style={{ marginLeft: 4, background: tab === t.key ? 'rgba(169,154,255,0.2)' : 'rgba(169,154,255,0.1)', borderRadius: 'var(--radius-full)', padding: '0 6px', fontSize: '10px', fontWeight: 700 }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div>
          <CoverageChart analysis={analysis} />

          {/* Requirements summary */}
          {requirements.experience_requirements.length > 0 && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-2)' }}>
                Experience Requirements
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {requirements.experience_requirements.map((exp, i) => (
                  <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted-slate)', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-soft-lavender)', marginTop: 4 }}>•</span>
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requirements.education_requirements.length > 0 && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-2)' }}>
                Education Requirements
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {requirements.education_requirements.map((edu, i) => (
                  <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted-slate)', display: 'flex', gap: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-soft-lavender)', marginTop: 4 }}>•</span>
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Matched skills tab */}
      {tab === 'matched' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {analysis.matched_required_skills.length === 0 && analysis.matched_preferred_skills.length === 0 && (
            <p style={{ color: 'var(--color-muted-slate)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-6)' }}>
              No matched skills found in this analysis.
            </p>
          )}

          {analysis.matched_required_skills.length > 0 && (
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted-slate)', marginBottom: 'var(--space-2)' }}>
                Required Skills with CV Evidence ({analysis.matched_required_skills.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {analysis.matched_required_skills.map((skill, i) => (
                  <div key={i} className="clay-card-sm" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="skill-chip skill-chip-matched">{skill.skill}</span>
                        <span style={{ fontSize: '10px', color: 'var(--color-muted-slate)' }}>
                          {skill.status === 'matched_by_alias' ? 'alias match' : skill.status === 'matched_by_evidence' ? 'evidence match' : 'exact match'}
                        </span>
                      </div>
                      {skill.candidate_evidence && (
                        <button
                          onClick={() => toggleEvidence(i)}
                          className="btn btn-ghost"
                          style={{ padding: '2px 8px', fontSize: '10px', color: 'var(--color-soft-lavender)' }}
                        >
                          {expandedEvidence.has(i) ? 'Hide' : 'Evidence'}
                        </button>
                      )}
                    </div>
                    {expandedEvidence.has(i) && skill.candidate_evidence && (
                      <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', background: 'rgba(104,216,203,0.08)', fontSize: 'var(--text-xs)', color: 'var(--color-muted-slate)', lineHeight: 1.6, borderLeft: '3px solid var(--color-mint)' }}>
                        {skill.candidate_evidence}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.matched_preferred_skills.length > 0 && (
            <div style={{ marginTop: 'var(--space-2)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted-slate)', marginBottom: 'var(--space-2)' }}>
                Preferred Skills with CV Evidence ({analysis.matched_preferred_skills.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {analysis.matched_preferred_skills.map((skill, i) => (
                  <span key={i} className="skill-chip skill-chip-preferred">{skill.skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gaps tab */}
      {tab === 'gaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {analysis.required_skills_not_found_in_cv.length === 0 ? (
            <div className="alert alert-success">
              <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              All extracted required skills have CV evidence.
            </div>
          ) : (
            <>
              <div className="alert alert-info" style={{ fontSize: 'var(--text-xs)' }}>
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                "Not found in CV" means no supporting evidence was extracted — it does not confirm the skill is absent.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {analysis.required_skills_not_found_in_cv.map((skill, i) => (
                  <div key={i} className="clay-card-sm" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="skill-chip skill-chip-missing">{skill.skill}</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-muted-slate)' }}>Not found in CV</span>
                    </div>
                    {skill.job_evidence && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-slate)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 600 }}>Job requires: </span>{skill.job_evidence}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {analysis.preferred_skills_not_found_in_cv.length > 0 && (
            <div style={{ marginTop: 'var(--space-2)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted-slate)', marginBottom: 'var(--space-2)' }}>
                Preferred Skills — No CV Evidence
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {analysis.preferred_skills_not_found_in_cv.map((skill, i) => (
                  <span key={i} className="skill-chip skill-chip-neutral">{skill.skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Improvements tab */}
      {tab === 'improvements' && (
        <div>
          {!priorityImprovements || priorityImprovements.length === 0 ? (
            <p style={{ color: 'var(--color-muted-slate)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-6)' }}>
              No improvement suggestions available for this job.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {priorityImprovements.map((item, i) => (
                <div key={i} className="clay-card-sm" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'white' }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-deep-ink)', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }} />
          <span style={{ fontSize: '11px', color: 'var(--color-muted-slate)' }}>Skill with CV evidence</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-error)' }} />
          <span style={{ fontSize: '11px', color: 'var(--color-muted-slate)' }}>No supporting evidence found</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-soft-lavender)' }} />
          <span style={{ fontSize: '11px', color: 'var(--color-muted-slate)' }}>Preferred skill with evidence</span>
        </div>
      </div>
    </div>
  );
}
