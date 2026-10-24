import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { ChatResponse, JobAnalysis, SkillGapAnalysis } from '../api/client';
import JobCard from '../components/JobCard';
import SkillGapPanel from '../components/SkillGapPanel';
import AIAnalyst from '../components/characters/AIAnalyst';
import {
  ChatIcon,
  SparklesIcon,
  DocumentIcon,
  BriefcaseIcon,
  TargetIcon,
  ShieldCheckIcon,
  InfoIcon,
} from '../components/icons/AppIcons';

interface ChatHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: Array<{ job_id: string; title: string; company_name: string }>;
    followUps?: string[];
    priorityImprovements?: string[];
    analysis?: any;
    requirements?: any;
    route?: string;
  }>;
}

const STORAGE_KEY = 'careerlens_chat_sessions_v2';

const SUGGESTED_PROMPTS = [
  {
    label: 'Find matching jobs',
    prompt: 'Find jobs that match my CV skills and background.',
    icon: <BriefcaseIcon size={16} color="var(--color-rich-blue)" />,
    cardClass: 'clay-card-blue',
  },
  {
    label: 'ML Engineer skills',
    prompt: 'What skills should I develop for an ML Engineer role?',
    icon: <TargetIcon size={16} color="var(--color-teal)" />,
    cardClass: 'clay-card-mint',
  },
  {
    label: 'Improve my CV',
    prompt: 'How can I improve my chances and resume evidence for a Data Scientist role?',
    icon: <DocumentIcon size={16} color="var(--color-terracotta)" />,
    cardClass: 'clay-card-peach',
  },
  {
    label: 'Data Scientist vs ML',
    prompt: 'Explain the difference between Data Scientist and ML Engineer roles in practice.',
    icon: <SparklesIcon size={16} color="var(--color-plum)" />,
    cardClass: 'clay-card-lavender',
  },
];

export default function ChatPage() {
  const { candidateId } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<ChatHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed[0].id : '';
    } catch {
      return '';
    }
  });

  const [inputQuery, setInputQuery] = useState('');
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore
    }
  }, [sessions]);

  // Handle URL parameters for discussing a job or initial prompt
  useEffect(() => {
    const q = searchParams.get('q');
    const jobId = searchParams.get('jobId');
    const jobTitle = searchParams.get('jobTitle');
    if (jobId && jobTitle) {
      setInputQuery(`What skills do I need to develop for ${jobTitle} (ID: ${jobId}) and how can I bridge any missing evidence?`);
      textareaRef.current?.focus();
    } else if (q) {
      setInputQuery(q);
      textareaRef.current?.focus();
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const currentSession = sessions.find((s) => s.id === activeSessionId);
  const messages = currentSession?.messages || [];

  const createNewSession = () => {
    const newSession: ChatHistoryItem = {
      id: 'session_' + Date.now(),
      title: 'New Conversation',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInputQuery('');
    setShowJdInput(false);
    setJobDescriptionInput('');
    setError(null);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this conversation from local browser history?')) {
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : '');
      }
    }
  };

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt !== undefined ? overridePrompt : inputQuery;
    if (!textToSend.trim() || isLoading) return;

    let targetSessionId = activeSessionId;
    let updatedSessions = [...sessions];

    if (!targetSessionId || !updatedSessions.some((s) => s.id === targetSessionId)) {
      const newSession: ChatHistoryItem = {
        id: 'session_' + Date.now(),
        title: textToSend.slice(0, 32) + (textToSend.length > 32 ? '...' : ''),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [],
      };
      updatedSessions = [newSession, ...updatedSessions];
      targetSessionId = newSession.id;
      setActiveSessionId(targetSessionId);
    }

    const userMessageId = 'msg_' + Date.now();
    const newUserMsg = {
      id: userMessageId,
      role: 'user' as const,
      content: textToSend,
    };

    const targetIndex = updatedSessions.findIndex((s) => s.id === targetSessionId);
    if (targetIndex !== -1) {
      const sess = updatedSessions[targetIndex];
      const newTitle = sess.messages.length === 0
        ? textToSend.slice(0, 36) + (textToSend.length > 36 ? '...' : '')
        : sess.title;

      updatedSessions[targetIndex] = {
        ...sess,
        title: newTitle,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [...sess.messages, newUserMsg],
      };
      setSessions(updatedSessions);
    }

    const prevQuery = inputQuery;
    const prevJd = jobDescriptionInput;
    setInputQuery('');
    setShowJdInput(false);
    setJobDescriptionInput('');
    setIsLoading(true);
    setError(null);

    const apiHistory = (currentSession?.messages || []).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response: ChatResponse = await api.chat({
        query: textToSend,
        candidate_id: candidateId || undefined,
        job_description: prevJd.trim() ? prevJd : undefined,
        history: apiHistory,
        retrieval_k: 30,
        rerank_k: 10,
      });

      const assistantMsg = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant' as const,
        content: response.answer,
        citations: response.citations,
        followUps: response.follow_up_questions,
        priorityImprovements: response.priority_improvements,
        analysis: response.analysis,
        requirements: response.requirements,
        route: response.route,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? { ...s, messages: [...s.messages, assistantMsg] }
            : s
        )
      );
    } catch (err: any) {
      setError(err?.detail || 'Failed to reach the CareerLens backend. Please verify that the API is running.');
      setInputQuery(prevQuery);
      if (prevJd) {
        setShowJdInput(true);
        setJobDescriptionInput(prevJd);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: 1240, margin: '0 auto', width: '100%', paddingBottom: 'var(--space-6)' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: 2 }}>AI Career Workspace</h1>
            <p className="section-subtitle">
              Interactive career intelligence grounded in verified job requirements and candidate proof.
            </p>
          </div>
          {candidateId ? (
            <div
              className="clay-card-mint"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-clay-sm)',
              }}
            >
              <ShieldCheckIcon size={14} color="var(--text-on-mint)" />
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-on-mint)' }}>
                Active Context: {candidateId}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/analyze')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8125rem' }}
            >
              <DocumentIcon size={14} color="var(--color-rich-blue)" />
              Upload CV for Personalized Grounding
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout with strictly constrained sub-grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(230px, 280px) minmax(0, 1fr)',
          gap: 'var(--space-6)',
          minHeight: '620px',
        }}
      >
        {/* Sessions Sidebar */}
        <div
          className="clay-card-lavender"
          style={{
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '740px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-clay-md)',
          }}
        >
          <button
            onClick={createNewSession}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginBottom: 'var(--space-4)', justifyContent: 'center' }}
          >
            <SparklesIcon size={14} color="white" />
            New Conversation
          </button>

          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '0 var(--space-2) var(--space-2)',
            }}
          >
            Saved Conversations (Local)
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sessions.length === 0 ? (
              <div style={{ padding: 'var(--space-6) var(--space-2)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                No conversations yet. Choose a prompt or type below to begin.
              </div>
            ) : (
              sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className="clay-card-sm"
                  style={{
                    padding: '0.55rem 0.75rem',
                    background: sess.id === activeSessionId ? 'linear-gradient(135deg, rgba(66, 111, 206, 0.16) 0%, rgba(157, 138, 239, 0.14) 100%)' : 'rgba(255, 255, 255, 0.75)',
                    border: sess.id === activeSessionId ? '1px solid rgba(66, 111, 206, 0.4)' : '1px solid rgba(255, 255, 255, 0.85)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: sess.id === activeSessionId ? 'var(--color-rich-blue)' : 'var(--color-deep-indigo)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sess.title}
                    </div>
                    <div className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: 2 }}>
                      {sess.updatedAt} · {sess.messages.length} msgs
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteSession(sess.id, e)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 6px', color: 'var(--text-muted)', fontSize: '12px' }}
                    title="Delete local conversation"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation Workspace */}
        <div
          className="clay-card-elevated"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '740px',
            padding: 0,
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F9FE 50%, #EAE5F4 100%)',
          }}
        >
          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {messages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 540, padding: 'var(--space-6)' }}>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <AIAnalyst size={110} animate={true} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-indigo)', marginBottom: 'var(--space-2)' }}>
                  How can CareerLens assist you today?
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                  Ask questions grounded in our indexed jobs dataset, explore required skill evidence, or attach a custom job description for on-the-fly analysis.
                </p>

                {/* Suggested Prompt Cards with Claymorphic Colors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-3)' }}>
                  {SUGGESTED_PROMPTS.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(item.prompt)}
                      className={`clay-card-sm ${item.cardClass}`}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        cursor: 'pointer',
                        transition: 'transform var(--transition-fast)',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.85)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-deep-indigo)', lineHeight: 1.3 }}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  <div
                    style={{
                      maxWidth: msg.role === 'user' ? '82%' : '92%',
                      padding: 'var(--space-4) var(--space-5)',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #E0EAF9 0%, #DADCF5 100%)'
                        : 'linear-gradient(145deg, #FAF8FE 0%, #EAE5F4 100%)',
                      color: 'var(--color-deep-indigo)',
                      boxShadow: msg.role === 'user' ? 'var(--shadow-clay-sm)' : 'var(--shadow-clay-md)',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      lineHeight: 1.7,
                      fontSize: '0.875rem',
                    }}
                  >
                    {/* Assistant identity header */}
                    {msg.role === 'assistant' && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          marginBottom: 'var(--space-3)',
                          paddingBottom: 'var(--space-2)',
                          borderBottom: '1px solid rgba(157, 138, 239, 0.25)',
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--gradient-brand)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          <SparklesIcon size={12} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--color-deep-indigo)' }}>
                          CareerLens Intelligence
                        </span>
                        {msg.route && (
                          <span
                            className="font-mono"
                            style={{
                              marginLeft: 'auto',
                              fontSize: '9px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(79, 174, 170, 0.15)',
                              color: 'var(--color-teal)',
                              fontWeight: 700,
                            }}
                          >
                            {msg.route}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Text content */}
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-deep-indigo)' }}>
                      {msg.content}
                    </div>

                    {/* Dataset Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(157, 138, 239, 0.25)' }}>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            marginBottom: 'var(--space-2)',
                          }}
                        >
                          Dataset Citations ({msg.citations.length})
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                          {msg.citations.map((c, idx) => (
                            <button
                              key={idx}
                              onClick={() => navigate(`/job/${encodeURIComponent(c.job_id)}`)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '0.25rem 0.65rem' }}
                            >
                              <BriefcaseIcon size={12} color="var(--color-rich-blue)" />
                              {c.title} · {c.company_name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rich Job Cards if dataset jobs analysis was returned */}
                    {msg.analysis && 'jobs' in msg.analysis && Array.isArray(msg.analysis.jobs) && (
                      <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-deep-indigo)' }}>
                          Matched Job Analyses ({msg.analysis.jobs.length})
                        </div>
                        {msg.analysis.jobs.map((job: JobAnalysis) => (
                          <JobCard
                            key={job.job_id}
                            jobAnalysis={job}
                            onDiscuss={(jid, jtitle) => {
                              setInputQuery(`Can you explain why ${jtitle} is a match and what CV evidence stood out?`);
                              textareaRef.current?.focus();
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Skill gap panel if custom JD was analyzed */}
                    {msg.analysis && 'matched_required_skills' in msg.analysis && msg.requirements && (
                      <div style={{ marginTop: 'var(--space-4)' }}>
                        <SkillGapPanel
                          analysis={msg.analysis as SkillGapAnalysis}
                          requirements={msg.requirements}
                          priorityImprovements={msg.priorityImprovements}
                        />
                      </div>
                    )}

                    {/* Follow-up question chips */}
                    {msg.followUps && msg.followUps.length > 0 && (
                      <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        {msg.followUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fu)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', borderRadius: 'var(--radius-full)' }}
                          >
                            <ChatIcon size={10} color="var(--color-rich-blue)" />
                            {fu}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div
                className="clay-card-lavender"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  maxWidth: 380,
                  boxShadow: 'var(--shadow-clay-sm)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: '3px solid rgba(66, 111, 206, 0.2)',
                    borderTopColor: 'var(--color-rich-blue)',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Retrieving grounded evidence from dataset...
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <InfoIcon size={16} color="var(--color-error)" />
                  <span>{error}</span>
                </div>
                <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}>
                  ✕
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderTop: '1px solid rgba(157, 138, 239, 0.25)',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => setShowJdInput((v) => !v)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', color: showJdInput ? 'var(--color-rich-blue)' : 'var(--text-secondary)' }}
              >
                {showJdInput ? '− Hide Job Description Input' : '+ Attach Job Description to Query'}
              </button>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Enter to send · Shift+Enter for newline
              </span>
            </div>

            {showJdInput && (
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <textarea
                  className="input-clay"
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder="Paste the target job description here for skill-gap comparison..."
                  rows={4}
                  style={{ width: '100%', fontSize: '0.8125rem', resize: 'vertical' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
              <textarea
                ref={textareaRef}
                className="input-clay"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={candidateId ? 'Ask about matching jobs, skill requirements, or improvements...' : 'Ask general career questions, or upload a CV for personal matching...'}
                rows={2}
                disabled={isLoading}
                style={{ flex: 1, resize: 'none', fontSize: '0.875rem' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputQuery.trim()}
                className="btn btn-primary"
                style={{ padding: 'var(--space-3) var(--space-5)', height: 48, borderRadius: 'var(--radius-md)' }}
                aria-label="Send message"
              >
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
