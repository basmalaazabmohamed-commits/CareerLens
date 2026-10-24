import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import {
  DocumentIcon,
  SearchIcon,
  ChatIcon,
  TrendingUpIcon,
  GearIcon,
  ShieldCheckIcon,
} from './icons/AppIcons';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #34345B 0%, #5C477D 55%, #426FCE 100%)',
        color: '#F5F1FF',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* Restrained decorative gradient glow behind content */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157, 138, 239, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 216, 196, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-16) var(--space-8) var(--space-8)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-10)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {/* Column 1: Brand & Tagline */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <BrandLogo size={40} />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                  }}
                >
                  CareerLens
                </span>
                <div style={{ fontSize: '0.75rem', color: '#DADCF5', fontWeight: 600 }}>
                  See Beyond Your CV
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#DADCF5', lineHeight: 1.65, marginBottom: 'var(--space-5)' }}>
              AI-driven career intelligence platform that combines dense vector retrieval, lexical BM25 matching, and cross-encoder reranking to connect your true skills with verified jobs.
            </p>

            {/* Architecture pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.75rem',
                color: '#8BD8C4',
                fontWeight: 600,
              }}
            >
              <ShieldCheckIcon size={14} color="#8BD8C4" />
              <span>Grounded Evidence RAG v2.0</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              Platform
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/analyze" style={{ color: '#DADCF5', transition: 'color var(--transition-fast)' }} onMouseEnter={e => (e.currentTarget.style.color = '#8BD8C4')} onMouseLeave={e => (e.currentTarget.style.color = '#DADCF5')}>
                  CV Analysis &amp; Jobs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#DADCF5', transition: 'color var(--transition-fast)' }} onMouseEnter={e => (e.currentTarget.style.color = '#8BD8C4')} onMouseLeave={e => (e.currentTarget.style.color = '#DADCF5')}>
                  Career Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" style={{ color: '#DADCF5', transition: 'color var(--transition-fast)' }} onMouseEnter={e => (e.currentTarget.style.color = '#8BD8C4')} onMouseLeave={e => (e.currentTarget.style.color = '#DADCF5')}>
                  AI Career Workspace
                </Link>
              </li>
              <li>
                <Link to="/jd-analyzer" style={{ color: '#DADCF5', transition: 'color var(--transition-fast)' }} onMouseEnter={e => (e.currentTarget.style.color = '#8BD8C4')} onMouseLeave={e => (e.currentTarget.style.color = '#DADCF5')}>
                  Job Description Analyzer
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: '#DADCF5', transition: 'color var(--transition-fast)' }} onMouseEnter={e => (e.currentTarget.style.color = '#8BD8C4')} onMouseLeave={e => (e.currentTarget.style.color = '#DADCF5')}>
                  Candidate Evidence Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture & Engineering */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              Engineering &amp; AI
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/how-it-works" style={{ color: '#DADCF5', transition: 'color var(--transition-fast)' }} onMouseEnter={e => (e.currentTarget.style.color = '#8BD8C4')} onMouseLeave={e => (e.currentTarget.style.color = '#DADCF5')}>
                  Transparent Workflow
                </Link>
              </li>
              <li>
                <span className="font-mono" style={{ color: '#DADCF5', fontSize: '0.8125rem' }}>
                  ChromaDB Vector Store
                </span>
              </li>
              <li>
                <span className="font-mono" style={{ color: '#DADCF5', fontSize: '0.8125rem' }}>
                  BM25Okapi Lexical Index
                </span>
              </li>
              <li>
                <span className="font-mono" style={{ color: '#DADCF5', fontSize: '0.8125rem' }}>
                  ms-marco Cross-Encoder
                </span>
              </li>
              <li>
                <span className="font-mono" style={{ color: '#DADCF5', fontSize: '0.8125rem' }}>
                  Pydantic Schema Validation
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Clay Decorative Mini Visual */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              Verified Growth
            </h4>
            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8BD8C4' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#F0D78C' }}>
                  Zero Hallucination Guarantee
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#DADCF5', lineHeight: 1.5 }}>
                Skills are extracted with direct CV section references. Coverage scores represent verifiable requirement overlap, never fabricated hiring odds.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
            marginBottom: 'var(--space-6)',
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            fontSize: '0.8125rem',
            color: '#DADCF5',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CareerLens · Career Intelligence Platform. Built with FastAPI &amp; React.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span className="font-mono" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              RAG Pipeline 2.0
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: '#8BD8C4' }}>
              ● Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
