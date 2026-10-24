import type { SkillGapAnalysis } from '../api/client';

interface CoverageChartProps {
  analysis: SkillGapAnalysis;
  compact?: boolean;
}

export default function CoverageChart({ analysis, compact = false }: CoverageChartProps) {
  const {
    required_skill_coverage,
    matched_required_skill_count,
    required_skill_count,
    matched_preferred_skill_count,
    preferred_skill_count,
    coverage_note,
  } = analysis;

  const pct = required_skill_coverage !== null ? Math.round(required_skill_coverage * 100) : null;

  if (compact) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-muted-slate)', fontFamily: 'var(--font-heading)' }}>
            Required Skill Coverage
          </span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-midnight-plum)', fontFamily: 'var(--font-heading)' }}>
            {pct !== null ? `${pct}%` : 'N/A'}
          </span>
        </div>
        <div className="coverage-bar-track">
          <div
            className="coverage-bar-fill"
            style={{ width: pct !== null ? `${pct}%` : '0%' }}
            role="progressbar"
            aria-valuenow={pct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Required skill coverage: ${matched_required_skill_count} of ${required_skill_count}`}
          />
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-slate)', marginTop: 'var(--space-1)' }}>
          {matched_required_skill_count} of {required_skill_count} required skills with CV evidence
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Required skills bar */}
      <div className="clay-card-sm" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-midnight-plum)' }}>
              Extracted Required-Skill Coverage
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-slate)', marginTop: 2 }}>
              {matched_required_skill_count} of {required_skill_count} required skills with CV evidence
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: pct !== null && pct >= 50 ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {pct !== null ? `${pct}%` : '–'}
            </span>
          </div>
        </div>

        <div className="coverage-bar-track" style={{ height: 14 }}>
          <div
            className="coverage-bar-fill"
            style={{ width: pct !== null ? `${pct}%` : '0%' }}
            role="progressbar"
            aria-valuenow={pct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Required skill coverage ${pct ?? 0}%`}
          />
        </div>
      </div>

      {/* Preferred skills bar */}
      {preferred_skill_count > 0 && (
        <div className="clay-card-sm" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-midnight-plum)' }}>
                Preferred-Skill Coverage
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-slate)', marginTop: 2 }}>
                {matched_preferred_skill_count} of {preferred_skill_count} preferred skills with CV evidence
              </p>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-soft-lavender)' }}>
              {analysis.preferred_skill_coverage !== null
                ? `${Math.round(analysis.preferred_skill_coverage * 100)}%`
                : '–'}
            </span>
          </div>
          <div className="coverage-bar-track">
            <div
              className="coverage-bar-fill"
              style={{
                width: analysis.preferred_skill_coverage !== null
                  ? `${Math.round(analysis.preferred_skill_coverage * 100)}%`
                  : '0%',
                background: 'linear-gradient(135deg, #A99AFF 0%, #C4B8FF 100%)',
              }}
              role="progressbar"
              aria-valuenow={analysis.preferred_skill_coverage !== null ? Math.round(analysis.preferred_skill_coverage * 100) : 0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Coverage note */}
      <div className="alert alert-info" style={{ fontSize: 'var(--text-xs)' }}>
        <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{coverage_note}</span>
      </div>
    </div>
  );
}
