import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { JobAnalysis, ChatResponse } from '../api/client';
import FileUpload from '../components/FileUpload';
import JobCard from '../components/JobCard';
import SkeletonLoader from '../components/SkeletonLoader';
import AIAnalyst from '../components/characters/AIAnalyst';
import DocumentUploadIllustration from '../components/characters/DocumentUploadIllustration';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ChatIcon,
  InfoIcon,
  RefreshIcon,
  DocumentIcon,
} from '../components/icons/AppIcons';

type PageState = 'upload' | 'analyzing' | 'results' | 'error';

export default function AnalyzePage() {
  const { candidateId } = useApp();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>(candidateId ? 'analyzing' : 'upload');
  const [jobs, setJobs] = useState<JobAnalysis[]>([]);
  const [answer, setAnswer] = useState('');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCandidateId, setActiveCandidateId] = useState(candidateId || '');

  useEffect(() => {
    if (candidateId && pageState === 'analyzing') {
      runAnalysis(candidateId);
    }
  }, []);


  const runAnalysis = async (cid: string) => {
    setPageState('analyzing');
    setError(null);
    setJobs([]);

    try {
      const res: ChatResponse = await api.chat({
        query: 'Find jobs that match my CV skills and background.',
        candidate_id: cid,
        retrieval_k: 30,
        rerank_k: 10,
      });

      if (res.route === 'candidate_job_search' && res.analysis && 'jobs' in res.analysis) {
        setJobs(res.analysis.jobs as JobAnalysis[]);
      } else if (res.route === 'general_job_search' || res.route === 'candidate_job_search') {
        setJobs([]);
      }
      setAnswer(res.answer);
      setFollowUps(res.follow_up_questions || []);
      setImprovements(res.priority_improvements || []);
      setPageState('results');
    } catch (err: any) {
      setError(err?.detail || 'Analysis failed. Please ensure the backend is running.');
      setPageState('error');
    }
  };

  const handleUploadSuccess = async (cid: string) => {
    setActiveCandidateId(cid);
    await runAnalysis(cid);
  };

  const handleDiscuss = (jobId: string, title: string) => {
    navigate(`/chat?jobId=${encodeURIComponent(jobId)}&jobTitle=${encodeURIComponent(title)}`);
  };

  const isUploadView = pageState === 'upload' || !activeCandidateId;

  return (
    <div className="page-content" style={{ maxWidth: isUploadView ? '100%' : 1160, margin: '0 auto', width: '100%' }}>
      {/* Centered Upload Card View when no CV is active or user requested switch */}
      {isUploadView ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - var(--topnav-height) - 100px)',
            width: '100%',
            padding: 'var(--space-4) var(--space-2)',
          }}
        >
          <div
            className="clay-card-elevated animate-scale-in"
            style={{
              width: '100%',
              maxWidth: 680,
              padding: 'var(--space-8) var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              background: 'linear-gradient(150deg, #FFFFFF 0%, #F5F9FE 40%, #EAE5F4 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              boxShadow: 'var(--shadow-clay-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Custom 3D Clay Illustration */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <DocumentUploadIllustration size={135} animate={true} />
            </div>

            {/* Heading & Subtitle */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--color-deep-indigo)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-2)',
              }}
            >
              Upload Your CV for AI Intelligence
            </h1>

            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: 520,
                marginBottom: 'var(--space-6)',
              }}
            >
              Parse your resume into structured evidence, perform hybrid semantic + BM25 search across verified jobs, and receive ms-marco cross-encoder ranked matches.
            </p>

            {/* Dropzone component */}
            <div style={{ width: '100%', marginBottom: 'var(--space-6)' }}>
              <FileUpload onSuccess={handleUploadSuccess} />
            </div>

            {/* Workflow architecture indicators */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 'var(--space-3)',
                width: '100%',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid rgba(157, 138, 239, 0.25)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-rich-blue)' }} />
                <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  01 · Pydantic Extraction
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-lavender)' }} />
                <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  02 · Hybrid ChromaDB
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-teal)' }} />
                <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  03 · Evidence Verification
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results / Analyzing / Error view */
        <div>
          {/* Header */}
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1 className="section-title">CV Analysis &amp; Job Recommendations</h1>
              <p className="section-subtitle">
                Discover matching roles with cross-encoder reranked evidence and verified skill-gap metrics.
              </p>
            </div>

            {/* Active CV Status Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <div
                className="clay-card-mint"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-clay-sm)',
                }}
              >
                <ShieldCheckIcon size={16} color="var(--text-on-mint)" />
                <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-on-mint)' }}>
                  Active CV: {activeCandidateId}
                </span>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setPageState('upload'); setJobs([]); setAnswer(''); }}
              >
                <DocumentIcon size={14} color="var(--color-rich-blue)" />
                Switch CV
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => runAnalysis(activeCandidateId)}
                disabled={pageState === 'analyzing'}
              >
                <RefreshIcon size={14} color="var(--color-rich-blue)" />
                Re-run Search
              </button>
            </div>
          </div>

          {/* Analyzing state with AI Analyst Mascot */}
          {pageState === 'analyzing' && (
            <div>
              <div
                className="clay-card-lavender animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-6)',
                  marginBottom: 'var(--space-8)',
                  padding: 'var(--space-6) var(--space-8)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-clay-md)',
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <AIAnalyst size={88} animate={true} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1875rem', color: 'var(--color-deep-indigo)', marginBottom: '0.25rem' }}>
                    Analyzing Your Profile Across Verified Dataset Jobs...
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Hybrid ChromaDB vector retrieval → ms-marco cross-encoder reranking → Job requirements extraction → Grounded skill-gap validation
                  </p>
                </div>
              </div>

              <div className="job-grid">
                <SkeletonLoader type="job" count={3} />
              </div>
            </div>
          )}

          {/* Error state */}
          {pageState === 'error' && error && (
            <div
              className="clay-card-elevated"
              style={{
                padding: 'var(--space-8)',
                textAlign: 'center',
                maxWidth: 520,
                margin: 'var(--space-8) auto',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FEEFEF 100%)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--color-error-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                }}
              >
                <InfoIcon size={26} color="var(--color-error)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-indigo)', marginBottom: 'var(--space-2)' }}>
                Analysis Failed
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
                {error}
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => activeCandidateId && runAnalysis(activeCandidateId)}>
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {pageState === 'results' && (
            <div className="animate-fade-in">
              {/* Grounded AI answer */}
              {answer && (
                <div
                  className="clay-card-lavender"
                  style={{
                    padding: 'var(--space-6)',
                    marginBottom: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-clay-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <CheckCircleIcon size={16} color="white" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-deep-indigo)' }}>
                      Grounded Career Intelligence
                    </span>
                  </div>

                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                    {answer}
                  </div>

                  {followUps.length > 0 && (
                    <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(157, 138, 239, 0.25)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {followUps.map((q, i) => (
                        <button
                          key={i}
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/chat?q=${encodeURIComponent(q)}`)}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <ChatIcon size={12} color="var(--color-rich-blue)" />
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Job cards */}
              {jobs.length > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-indigo)' }}>
                      Top Ranked Matching Roles
                      <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: 'var(--space-3)' }}>
                        {jobs.length} jobs retrieved from verified dataset
                      </span>
                    </h2>
                  </div>

                  <div
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(66, 111, 206, 0.08)',
                      border: '1px solid rgba(66, 111, 206, 0.2)',
                      fontSize: '0.75rem',
                      color: 'var(--color-deep-indigo)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-6)',
                    }}
                  >
                    <InfoIcon size={16} color="var(--color-rich-blue)" />
                    <span>
                      Results retrieved via hybrid search + ms-marco cross-encoder reranking. Coverage measures requirements with supporting CV evidence — not an automated hiring probability.
                    </span>
                  </div>

                  <div className="job-grid">
                    {jobs.map((job) => (
                      <JobCard key={job.job_id} jobAnalysis={job} onDiscuss={handleDiscuss} />
                    ))}
                  </div>
                </>
              ) : (
                answer && (
                  <div
                    className="clay-card-elevated"
                    style={{
                      padding: 'var(--space-8)',
                      textAlign: 'center',
                      maxWidth: 480,
                      margin: 'var(--space-6) auto',
                      borderRadius: 'var(--radius-xl)',
                      background: 'linear-gradient(135deg, #F8FAFD 0%, #EAE5F4 100%)',
                    }}
                  >
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-deep-indigo)', marginBottom: 'var(--space-2)' }}>
                      No Direct Job Analyses Returned
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 'var(--space-4)' }}>
                      Try asking the AI Career Workspace to query specific job titles, or paste a posting into the Custom JD Analyzer.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/chat')}>Open Chat</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jd-analyzer')}>JD Analyzer</button>
                    </div>
                  </div>
                )
              )}

              {/* Priority improvements if returned */}
              {improvements.length > 0 && (
                <div
                  className="clay-card-peach"
                  style={{
                    padding: 'var(--space-6)',
                    marginTop: 'var(--space-8)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-clay-md)',
                  }}
                >
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-terracotta)', marginBottom: 'var(--space-4)' }}>
                    Targeted Career Improvement Priorities
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {improvements.map((imp, i) => (
                      <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #E58C80 0%, #C77D62 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: 'white',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                          }}
                        >
                          {i + 1}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-on-peach)', lineHeight: 1.6 }}>{imp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
