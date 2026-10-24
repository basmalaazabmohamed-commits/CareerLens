import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { CandidateProfile } from '../api/client';
import FileUpload from '../components/FileUpload';
import CareerGuide from '../components/characters/CareerGuide';
import {
  UserIcon,
  ZapIcon,
  BriefcaseIcon,
  RocketIcon,
  AcademicIcon,
  AwardIcon,
  ShieldCheckIcon,
  SearchIcon,
} from '../components/icons/AppIcons';

export default function ProfilePage() {
  const { candidateId, profile, setProfile, setCandidateId } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (candidateId && !profile) {
      setLoading(true);
      setError(null);
      api.getCandidateProfile(candidateId)
        .then((p) => {
          setProfile(p);
          setLoading(false);
        })
        .catch((err: any) => {
          setError(err?.detail || 'Failed to fetch candidate profile.');
          setLoading(false);
        });
    }
  }, [candidateId, profile, setProfile]);

  const handleClearProfile = () => {
    if (confirm('Disconnect active CV profile from this browser session?')) {
      setCandidateId(null);
      setProfile(null);
      setShowUploader(true);
    }
  };

  if (!candidateId || showUploader) {
    return (
      <div className="page-content" style={{ maxWidth: 680, margin: 'auto' }}>
        <div className="section-header" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <CareerGuide size={120} animate={true} />
          </div>
          <h1 className="section-title">Upload Candidate CV</h1>
          <p className="section-subtitle">
            Upload your resume (PDF or DOCX) to extract structured skills, experiences, projects, and education.
          </p>
        </div>

        <div className="clay-card-elevated" style={{ padding: 'var(--space-8)', background: '#FFFFFF' }}>
          <FileUpload
            onSuccess={(cid) => {
              setShowUploader(false);
              setLoading(true);
              api.getCandidateProfile(cid)
                .then((p) => {
                  setProfile(p);
                  setLoading(false);
                })
                .catch(() => setLoading(false));
            }}
          />
          {candidateId && (
            <button
              onClick={() => setShowUploader(false)}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 'var(--space-4)', width: '100%', justifyContent: 'center' }}
            >
              Cancel & Return to Current Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  const p: CandidateProfile | null = profile;

  return (
    <div className="page-content" style={{ maxWidth: 1040 }}>
      {/* Header */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="section-title">Candidate Profile & CV Management</h1>
            <p className="section-subtitle">
              Structured representation parsed by CareerLens AI from your uploaded resume.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setShowUploader(true)}
              className="btn btn-secondary btn-sm"
            >
              Upload New CV
            </button>
            <button
              onClick={handleClearProfile}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-error)' }}
            >
              Disconnect CV
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(44,101,227,0.25)', borderTopColor: 'var(--clay-blue-accent)', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4)' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading candidate profile data...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--color-error-bg)', color: 'var(--color-error)', marginBottom: 'var(--space-6)' }}>
          {error}
        </div>
      )}

      {p && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Identity & Status Card */}
          <div className="clay-card-elevated" style={{ padding: 'var(--space-6) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5FD 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <UserIcon size={28} color="white" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-midnight-plum)', margin: 0 }}>
                    Candidate ID: {p.candidate_id}
                  </h2>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(57,134,110,0.15)', color: 'var(--clay-emerald)', fontWeight: 800 }}>
                    Active
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Profile is active across all RAG recommendations, custom job gap evaluations, and career chat queries.
                </p>
              </div>
            </div>

            <button onClick={() => navigate('/analyze')} className="btn btn-primary btn-sm">
              <SearchIcon size={14} color="white" />
              Find Matching Jobs
            </button>
          </div>

          {/* Professional Summary */}
          {p.summary && (
            <div className="clay-card" style={{ padding: 'var(--space-6)', background: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-2)' }}>
                Professional Summary
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                {p.summary}
              </p>
            </div>
          )}

          {/* Extracted Skills */}
          <div className="clay-card" style={{ padding: 'var(--space-6)', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-midnight-plum)', margin: 0 }}>
                Extracted Skills ({p.skills.length})
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Verified evidence extracted from CV sections
              </span>
            </div>

            {p.skills.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No skills extracted.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {p.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="skill-chip skill-chip-matched"
                    title={skill.evidence ? `Evidence: ${skill.evidence}` : skill.name}
                  >
                    <ZapIcon size={12} color="#065F46" />
                    <span>{skill.name}</span>
                    {skill.source_section && (
                      <span style={{ fontSize: '9px', opacity: 0.7, marginLeft: 4 }}>({skill.source_section})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experience Timeline */}
          {p.experience.length > 0 && (
            <div className="clay-card" style={{ padding: 'var(--space-6)', background: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-4)' }}>
                Experience Entries ({p.experience.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {p.experience.map((exp, i) => (
                  <div key={i} className="clay-card-sm" style={{ padding: 'var(--space-4)', background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFD 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-midnight-plum)' }}>
                        {exp.role || 'Role'} <span style={{ color: 'var(--clay-blue-accent)' }}>@ {exp.company || 'Company'}</span>
                      </h4>
                      {exp.duration && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {p.projects.length > 0 && (
            <div className="clay-card" style={{ padding: 'var(--space-6)', background: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-4)' }}>
                Projects ({p.projects.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                {p.projects.map((proj, i) => (
                  <div key={i} className="clay-card-sm" style={{ padding: 'var(--space-4)', background: '#FFFFFF' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-midnight-plum)' }}>
                      {proj.name}
                    </h4>
                    {proj.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'var(--space-3)' }}>
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="skill-chip skill-chip-neutral" style={{ fontSize: '10px' }}>
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {p.education.length > 0 && (
              <div className="clay-card" style={{ padding: 'var(--space-6)', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-3)' }}>
                  Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {p.education.map((edu, i) => (
                    <div key={i} style={{ fontSize: '0.75rem', borderLeft: '3px solid var(--clay-blue-accent)', paddingLeft: 'var(--space-3)' }}>
                      <div style={{ fontWeight: 800, color: 'var(--color-midnight-plum)' }}>{edu.degree} in {edu.field_of_study}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{edu.institution} {edu.graduation_date && `· ${edu.graduation_date}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.certifications.length > 0 && (
              <div className="clay-card" style={{ padding: 'var(--space-6)', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-3)' }}>
                  Certifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {p.certifications.map((cert, i) => (
                    <div key={i} style={{ fontSize: '0.75rem', borderLeft: '3px solid var(--clay-emerald)', paddingLeft: 'var(--space-3)' }}>
                      <div style={{ fontWeight: 800, color: 'var(--color-midnight-plum)' }}>{cert.name}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{cert.issuer} {cert.date && `· ${cert.date}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
