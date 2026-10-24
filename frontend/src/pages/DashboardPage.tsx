import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { CandidateProfile } from '../api/client';
import CareerGrowth from '../components/characters/CareerGrowth';
import DocumentUploadIllustration from '../components/characters/DocumentUploadIllustration';
import {
  SearchIcon,
  ClipboardCheckIcon,
  ChatIcon,
  UserIcon,
  ZapIcon,
  RocketIcon,
  BriefcaseIcon,
  AcademicIcon,
  ShieldCheckIcon,
  DocumentIcon,
  SparklesIcon,
} from '../components/icons/AppIcons';

export default function DashboardPage() {
  const { candidateId, profile, setProfile } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recentSessions, setRecentSessions] = useState<Array<{ id: string; title: string; updatedAt: string; messageCount: number }>>([]);

  useEffect(() => {
    if (candidateId && !profile) {
      setLoading(true);
      api.getCandidateProfile(candidateId)
        .then((p) => {
          setProfile(p);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [candidateId, profile, setProfile]);

  // Load recent local conversation sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem('careerlens_chat_sessions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSessions(
            parsed.slice(0, 3).map((s: any) => ({
              id: s.id,
              title: s.title || 'Untitled Session',
              updatedAt: s.updatedAt || '',
              messageCount: Array.isArray(s.messages) ? s.messages.length : 0,
            }))
          );
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  /* ========================================================
     Empty Dashboard State (When user has not uploaded a CV)
     ======================================================== */
  if (!candidateId) {
    return (
      <div className="page-content" style={{ maxWidth: 860, margin: '0 auto', width: '100%' }}>
        <div
          className="clay-card-elevated animate-scale-in"
          style={{
            padding: 'var(--space-12) var(--space-8)',
            textAlign: 'center',
            background: 'linear-gradient(150deg, #FFFFFF 0%, #F5F9FE 45%, #EAE5F4 100%)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-clay-lg)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
            <DocumentUploadIllustration size={135} animate={true} />
          </div>

          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              marginBottom: 'var(--space-3)',
              color: 'var(--color-deep-indigo)',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to Your Career Dashboard
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: 'var(--space-8)',
              fontSize: '1.0625rem',
              maxWidth: 560,
              margin: '0 auto var(--space-8)',
            }}
          >
            Upload your CV to unlock personalized job recommendations, verified skill-gap analysis, and AI-powered career intelligence grounded in verified datasets.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
            <Link to="/analyze" className="btn btn-primary btn-lg">
              <DocumentIcon size={20} color="white" />
              Upload My CV
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary btn-lg">
              Explore RAG Architecture
            </Link>
          </div>

          {/* Explanation of what happens after upload */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 'var(--space-4)',
              textAlign: 'left',
              paddingTop: 'var(--space-8)',
              borderTop: '1px solid rgba(157, 138, 239, 0.25)',
            }}
          >
            <div className="clay-card-sm clay-card-blue" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-rich-blue)' }}>01</span>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-deep-indigo)', margin: 0 }}>Extract Proof</h4>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Skills mapped to source sections with Pydantic schema validation.
              </p>
            </div>

            <div className="clay-card-sm clay-card-mint" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-teal)' }}>02</span>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-deep-indigo)', margin: 0 }}>Hybrid Search</h4>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Dense ChromaDB + BM25Okapi + ms-marco cross-encoder reranking.
              </p>
            </div>

            <div className="clay-card-sm clay-card-peach" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>03</span>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-deep-indigo)', margin: 0 }}>Verified Gaps</h4>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Clear evidence coverage metrics and targeted preparation roadmaps.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const p: CandidateProfile | null = profile;

  const quickActions = [
    {
      label: 'Find Matching Jobs',
      icon: <SearchIcon size={22} color="var(--color-rich-blue)" />,
      to: '/analyze',
      desc: 'RAG hybrid search over real jobs dataset',
      paletteClass: 'clay-card-blue',
    },
    {
      label: 'Analyze Custom Job',
      icon: <ClipboardCheckIcon size={22} color="var(--color-terracotta)" />,
      to: '/jd-analyzer',
      desc: 'Paste any job posting for skill gap analysis',
      paletteClass: 'clay-card-peach',
    },
    {
      label: 'AI Career Chat',
      icon: <ChatIcon size={22} color="var(--color-plum)" />,
      to: '/chat',
      desc: 'Ask about roles, skill gaps & CV prep',
      paletteClass: 'clay-card-lavender',
    },
    {
      label: 'Manage Profile',
      icon: <UserIcon size={22} color="var(--color-teal)" />,
      to: '/profile',
      desc: 'Review extracted skills & source evidence',
      paletteClass: 'clay-card-mint',
    },
  ];

  return (
    <div className="page-content" style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
      {/* Top Banner with Career Growth Character */}
      <div
        className="clay-card-elevated"
        style={{
          padding: 'var(--space-6) var(--space-8)',
          marginBottom: 'var(--space-8)',
          background: 'linear-gradient(135deg, #F5F9FE 0%, #E0EAF9 50%, #EAE5F4 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          boxShadow: 'var(--shadow-clay-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-6)',
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(139, 216, 196, 0.2) 0%, rgba(224, 234, 249, 0.25) 100%)',
              border: '1px solid rgba(139, 216, 196, 0.5)',
              color: 'var(--text-on-mint)',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: 'var(--space-2)',
            }}
          >
            <ShieldCheckIcon size={14} color="var(--color-teal)" />
            Profile Active &amp; Grounded
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--color-deep-indigo)',
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
            }}
          >
            Career Intelligence Dashboard
          </h1>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Analyzing candidate: <strong className="font-mono" style={{ color: 'var(--color-rich-blue)' }}>{candidateId}</strong>
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button onClick={() => navigate('/analyze')} className="btn btn-primary btn-sm">
              <SearchIcon size={16} color="white" />
              Discover Matching Jobs
            </button>
            <button onClick={() => navigate('/chat')} className="btn btn-secondary btn-sm">
              <ChatIcon size={16} color="var(--color-rich-blue)" />
              Career Chat
            </button>
          </div>
        </div>

        {/* Career Growth Mascot Animation */}
        <div style={{ flexShrink: 0 }}>
          <CareerGrowth size={120} animate={true} />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid rgba(66, 111, 206, 0.25)',
              borderTopColor: 'var(--color-rich-blue)',
              animation: 'spin 1s linear infinite',
              margin: '0 auto var(--space-3)',
            }}
          />
          Synchronizing candidate profile...
        </div>
      )}

      {/* Stats row with Curated Palette Claymorphic Panels */}
      {p && (
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          {[
            { label: 'Skills Extracted', value: p.skills.length, icon: <ZapIcon size={22} color="var(--color-rich-blue)" />, paletteClass: 'clay-card-blue' },
            { label: 'Projects with Tech', value: p.projects.length, icon: <RocketIcon size={22} color="var(--color-teal)" />, paletteClass: 'clay-card-mint' },
            { label: 'Work Experience', value: p.experience.length, icon: <BriefcaseIcon size={22} color="var(--color-terracotta)" />, paletteClass: 'clay-card-peach' },
            { label: 'Degrees & Certs', value: p.education.length + p.certifications.length, icon: <AcademicIcon size={22} color="var(--color-plum)" />, paletteClass: 'clay-card-lavender' },
          ].map((stat, i) => (
            <div key={i} className={`clay-card ${stat.paletteClass}`} style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{stat.label}</span>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: '#FFFFFF',
                    boxShadow: 'var(--shadow-clay-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--color-deep-indigo)', lineHeight: 1.1 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Tools */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-indigo)', marginBottom: 'var(--space-4)' }}>
          Intelligence Workspace
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className={`clay-card ${action.paletteClass}`}
              style={{
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFFFF',
                  boxShadow: 'var(--shadow-clay-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {action.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-deep-indigo)', fontSize: '1rem', marginBottom: 4 }}>
                {action.label}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Local Conversations if available */}
      {recentSessions.length > 0 && (
        <div className="clay-card-lavender" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-deep-indigo)', margin: 0 }}>
              Recent AI Discussions
            </h2>
            <Link to="/chat" style={{ fontSize: '0.8125rem', color: 'var(--color-rich-blue)', fontWeight: 700 }}>
              Open Chat Workspace →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
            {recentSessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => navigate('/chat')}
                className="clay-card-sm"
                style={{
                  padding: 'var(--space-4)',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                  <ChatIcon size={14} color="var(--color-rich-blue)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-deep-indigo)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sess.title}
                  </span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {sess.updatedAt} · {sess.messageCount} messages
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Skills Cloud with Evidence Excerpt info */}
      {p && p.skills.length > 0 && (
        <div className="clay-card-mint" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-on-mint)', margin: 0 }}>
                Skills with Supporting CV Evidence
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-on-mint)', opacity: 0.85, marginTop: 2 }}>
                Verified skills extracted across your experience, education, and project sections
              </p>
            </div>
            <Link to="/profile" style={{ fontSize: '0.8125rem', color: 'var(--color-teal)', fontWeight: 700 }}>
              View full profile →
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {p.skills.slice(0, 24).map((skill, i) => (
              <span key={i} className="skill-chip skill-chip-matched">
                <ShieldCheckIcon size={12} color="var(--text-on-mint)" />
                {skill.name}
              </span>
            ))}
            {p.skills.length > 24 && (
              <span className="skill-chip skill-chip-neutral">
                +{p.skills.length - 24} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
