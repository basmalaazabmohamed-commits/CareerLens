import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { JobRecord, ChatResponse, SkillGapAnalysis, JobRequirementsData } from '../api/client';
import SkillGapPanel from '../components/SkillGapPanel';
import {
  BriefcaseIcon,
  ChatIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
} from '../components/icons/AppIcons';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { candidateId } = useApp();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [analyzingGap, setAnalyzingGap] = useState(false);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [requirements, setRequirements] = useState<JobRequirementsData | null>(null);
  const [priorityImprovements, setPriorityImprovements] = useState<string[]>([]);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    api.getJob(jobId)
      .then((record) => {
        setJob(record);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err?.detail || `Job with ID '${jobId}' was not found in the dataset.`);
        setLoading(false);
      });
  }, [jobId]);

  const handleAnalyzeAgainstCV = async () => {
    if (!candidateId || !job) return;
    setAnalyzingGap(true);

    try {
      const res: ChatResponse = await api.chat({
        query: `Analyze my CV skills and evidence against this specific job: ${job.title} at ${job.company_name}`,
        candidate_id: candidateId,
        job_description: job.job_text,
      });

      if (res.analysis && 'matched_required_skills' in res.analysis) {
        setSkillGap(res.analysis as SkillGapAnalysis);
      }
      if (res.requirements) {
        setRequirements(res.requirements);
      }
      setPriorityImprovements(res.priority_improvements || []);
    } catch (err: any) {
      alert(err?.detail || 'Failed to perform skill-gap analysis.');
    } finally {
      setAnalyzingGap(false);
    }
  };

  const handleDiscussInChat = () => {
    if (!job) return;
    navigate(`/chat?jobId=${encodeURIComponent(job.job_id)}&jobTitle=${encodeURIComponent(job.title)}`);
  };

  if (loading) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(44,101,227,0.25)', borderTopColor: 'var(--clay-blue-accent)', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4)' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading job details from dataset...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page-content" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div className="clay-card-elevated" style={{ padding: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>Job Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
            {error || 'Unable to locate this job record in the database.'}
          </p>
          <Link to="/analyze" className="btn btn-primary">
            Browse Recommended Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ maxWidth: 1040 }}>
      {/* Back button */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>
      </div>

      {/* Main Job Header */}
      <div className="clay-card-elevated" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)', background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFD 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(44,101,227,0.1)', color: 'var(--clay-blue-accent)', marginBottom: 'var(--space-2)' }}>
              <BriefcaseIcon size={12} color="var(--clay-blue-accent)" />
              Dataset Record: {job.job_id}
            </div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 2 }}>
              {job.title}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {job.company_name}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button
              onClick={handleDiscussInChat}
              className="btn btn-secondary btn-md"
            >
              <ChatIcon size={16} color="var(--clay-blue-accent)" />
              Discuss with AI
            </button>
            {candidateId && !skillGap && (
              <button
                onClick={handleAnalyzeAgainstCV}
                disabled={analyzingGap}
                className="btn btn-primary btn-md"
              >
                <ClipboardCheckIcon size={16} color="white" />
                {analyzingGap ? 'Evaluating Match...' : 'Evaluate Against My CV'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis if executed */}
      {skillGap && (
        <div className="clay-card-elevated animate-fade-in" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', background: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-4)' }}>
            Skill-Gap Analysis Against Your CV
          </h2>
          <SkillGapPanel
            analysis={skillGap}
            requirements={requirements || {
              job_id: job.job_id,
              title: job.title,
              company_name: job.company_name,
              required_skills: [],
              preferred_skills: [],
              experience_requirements: [],
              education_requirements: [],
              responsibilities: [],
            }}
            priorityImprovements={priorityImprovements}
          />
        </div>
      )}

      {/* Job Description Text */}
      <div className="clay-card" style={{ padding: 'var(--space-8)', background: '#FFFFFF' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-midnight-plum)', marginBottom: 'var(--space-4)' }}>
          Job Description & Requirements
        </h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {job.job_text}
        </div>
      </div>
    </div>
  );
}
