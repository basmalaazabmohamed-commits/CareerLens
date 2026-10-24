import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { ChatResponse, SkillGapAnalysis, JobRequirementsData } from '../api/client';
import FileUpload from '../components/FileUpload';
import SkillGapPanel from '../components/SkillGapPanel';
import {
  ClipboardCheckIcon,
  InfoIcon,
  ChatIcon,
  ShieldCheckIcon,
  SearchIcon,
  CheckCircleIcon,
} from '../components/icons/AppIcons';

export default function JobDescriptionAnalyzerPage() {
  const { candidateId } = useApp();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState('');
  const [activeCandidateId, setActiveCandidateId] = useState(candidateId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [requirements, setRequirements] = useState<JobRequirementsData | null>(null);
  const [priorityImprovements, setPriorityImprovements] = useState<string[]>([]);
  const [submittedJd, setSubmittedJd] = useState<string | null>(null);

  const sampleJd = `Senior Machine Learning Engineer
TechCorp AI · Remote (US/EU)
We are seeking an experienced ML Engineer to design, train, and deploy large language model systems.
Requirements:
- 4+ years experience building production ML pipelines in Python.
- Deep expertise in PyTorch, Transformers, HuggingFace, and RAG architectures.
- Experience with vector databases (ChromaDB, Pinecone, or Milvus) and BM25 hybrid search.
- Strong software engineering practices: Docker, CI/CD, FastAPI, unit testing.
Preferred:
- Experience fine-tuning open-source LLMs (Llama, Mistral) and quantization (QLoRA).
- Cloud experience with AWS or GCP.
- Contributions to open-source AI projects.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCandidateId) {
      setError('Please upload or select a processed CV before analyzing a job description.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description to analyze.');
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError('Please provide a complete job description (at least 50 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultAnswer(null);
    setSkillGap(null);
    setRequirements(null);
    setPriorityImprovements([]);

    try {
      const res: ChatResponse = await api.chat({
        query: 'Analyze my CV against this job description and perform a detailed skill gap analysis.',
        candidate_id: activeCandidateId,
        job_description: jobDescription,
      });

      setSubmittedJd(jobDescription);
      setResultAnswer(res.answer);
      setPriorityImprovements(res.priority_improvements || []);

      if (res.analysis && 'matched_required_skills' in res.analysis) {
        setSkillGap(res.analysis as SkillGapAnalysis);
      }
      if (res.requirements) {
        setRequirements(res.requirements);
      }
    } catch (err: any) {
      setError(err?.detail || 'Failed to analyze the job description. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscussInChat = () => {
    navigate(`/chat`);
  };

  return (
    <div className="page-content" style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Custom Job Description Analyzer</h1>
        <p className="section-subtitle">
          Evaluate any job posting against your CV evidence to map confirmed requirements, unverified gaps, and tactical prep roadmaps.
        </p>
      </div>

      {/* Methodology notice */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(66, 111, 206, 0.08)',
          border: '1px solid rgba(66, 111, 206, 0.22)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <InfoIcon size={20} color="var(--color-rich-blue)" />
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-deep-indigo)', lineHeight: 1.5 }}>
          <strong>Evidence Distinction:</strong> Missing evidence indicates a requirement not explicitly proven in your uploaded CV — not that you lack the skill. Skill coverage is not an automated hiring probability.
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: resultAnswer ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        {/* Input Card */}
        <div
          className="clay-card-elevated"
          style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(150deg, #FFFFFF 0%, #F5F9FE 50%, #EAE5F4 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #426FCE 0%, #9D8AEF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <ClipboardCheckIcon size={18} color="#FFFFFF" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-deep-indigo)', margin: 0 }}>
              1. Candidate Context
            </h2>
          </div>

          {!activeCandidateId ? (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Upload your CV to extract your skills and experience profile first:
              </p>
              <FileUpload onSuccess={(cid) => setActiveCandidateId(cid)} />
            </div>
          ) : (
            <div
              className="clay-card-mint"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ShieldCheckIcon size={16} color="var(--text-on-mint)" />
                <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-on-mint)' }}>
                  Active CV: {activeCandidateId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCandidateId('')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px' }}
              >
                Change CV
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #8BD8C4 0%, #4FAEAA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <SearchIcon size={18} color="#FFFFFF" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-deep-indigo)', margin: 0 }}>
              2. Target Job Description
            </h2>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            Paste the full job posting including responsibilities, required qualifications, and tools.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
              <textarea
                className="input-clay"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                rows={10}
                style={{
                  width: '100%',
                  fontSize: '0.8125rem',
                  resize: 'vertical',
                  background: 'linear-gradient(145deg, #FAF7FD 0%, #F5F9FE 100%)',
                }}
              />
              {!jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription(sampleJd)}
                  className="btn btn-secondary btn-sm"
                  style={{ position: 'absolute', bottom: 12, right: 12, fontSize: '11px', padding: '3px 9px' }}
                >
                  Load Sample ML Role
                </button>
              )}
            </div>

            {error && (
              <div
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  fontSize: '0.8125rem',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                type="submit"
                disabled={isLoading || !activeCandidateId || !jobDescription.trim()}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Extracting Requirements &amp; Evidence...
                  </>
                ) : (
                  <>
                    <ClipboardCheckIcon size={18} color="white" />
                    Analyze Skill Match
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {resultAnswer && (
          <div
            className="clay-card-elevated animate-fade-in"
            style={{
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(150deg, #FFFFFF 0%, #FAF8FE 50%, #EAE5F4 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-indigo)' }}>
                Analysis Results
              </h2>
              <button onClick={handleDiscussInChat} className="btn btn-secondary btn-sm">
                <ChatIcon size={14} color="var(--color-rich-blue)" />
                Discuss in Chat
              </button>
            </div>

            {/* AI Summary Answer */}
            <div
              className="clay-card-lavender"
              style={{
                padding: 'var(--space-4) var(--space-5)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: 'var(--color-deep-indigo)',
              }}
            >
              {resultAnswer}
            </div>

            {/* Skill Gap Component */}
            {skillGap && (
              <SkillGapPanel
                analysis={skillGap}
                requirements={requirements || {
                  job_id: 'custom',
                  title: skillGap.title || 'Custom Job Posting',
                  company_name: skillGap.company_name || 'Target Employer',
                  required_skills: [],
                  preferred_skills: [],
                  experience_requirements: [],
                  education_requirements: [],
                  responsibilities: [],
                }}
                priorityImprovements={priorityImprovements}
              />
            )}

            {/* Original Analyzed JD Collapsible */}
            {submittedJd && (
              <details style={{ marginTop: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--color-rich-blue)' }}>
                  View Original Submitted Job Description
                </summary>
                <div
                  style={{
                    marginTop: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(157, 138, 239, 0.25)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 200,
                    overflowY: 'auto',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {submittedJd}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
