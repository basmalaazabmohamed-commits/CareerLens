import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import LensExplorer from './characters/LensExplorer';
import { BriefcaseIcon, TargetIcon, TrendingUpIcon } from './icons/AppIcons';

interface WelcomeModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const STORAGE_KEY = 'careerlens_welcome_modal_dismissed_v2';

export default function WelcomeModal({ forceOpen = false, onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleDismiss = (redirectPath?: string) => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    onClose?.();
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(37, 43, 59, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      onClick={() => handleDismiss()}
    >
      <div
        className="clay-card-elevated animate-scale-in"
        style={{
          maxWidth: 620,
          width: '100%',
          padding: 'var(--space-8) var(--space-8) var(--space-6)',
          position: 'relative',
          background: 'linear-gradient(160deg, #FFFFFF 0%, #F8FAFD 50%, #F1F5FD 100%)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 24px 60px rgba(44, 101, 227, 0.22), inset 2px 2px 4px rgba(255, 255, 255, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={() => handleDismiss()}
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            padding: 0,
            borderRadius: '50%',
            color: 'var(--text-secondary)',
          }}
          aria-label="Close welcome modal"
        >
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Header with Brand Mark and Character */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <LensExplorer size={100} animate={true} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(44, 101, 227, 0.1)', border: '1px solid rgba(44, 101, 227, 0.2)', marginBottom: 'var(--space-2)' }}>
            <BrandLogo size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-blue-accent)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Welcome to CareerLens
            </span>
          </div>

          <h2
            id="welcome-modal-title"
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--color-midnight-plum)',
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem',
            }}
          >
            See Beyond Your CV.
          </h2>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 500 }}>
            Your next career opportunity starts with understanding your skills.
            Explore relevant jobs, discover skill gaps, and uncover practical ways to strengthen your professional profile with AI-powered career intelligence.
          </p>
        </div>

        {/* 3 Crisp Feature Highlights with Custom SVG Icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          {[
            {
              icon: <BriefcaseIcon size={20} color="var(--clay-blue-accent)" />,
              title: 'Discover Relevant Jobs',
              desc: 'Grounded retrieval from our indexed dataset of verified tech roles using hybrid search and cross-encoder reranking.',
              color: 'rgba(44, 101, 227, 0.1)',
            },
            {
              icon: <TargetIcon size={20} color="var(--clay-violet-vivid)" />,
              title: 'Understand Skill Evidence & Gaps',
              desc: 'Evidence-based matching distinguishes between proven CV skills and requirements without supporting documentation.',
              color: 'rgba(140, 114, 232, 0.12)',
            },
            {
              icon: <TrendingUpIcon size={20} color="var(--clay-emerald)" />,
              title: 'Actionable Career Improvements',
              desc: 'Get targeted advice on portfolio projects, CV phrasing improvements, and interview preparation topics.',
              color: 'rgba(57, 134, 110, 0.12)',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="clay-card-sm"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-midnight-plum)', lineHeight: 1.2 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <button
            onClick={() => handleDismiss('/how-it-works')}
            className="btn btn-secondary btn-md"
            style={{ fontSize: '0.875rem' }}
          >
            Explore First
          </button>

          <button
            onClick={() => handleDismiss('/analyze')}
            className="btn btn-primary btn-md"
            style={{ fontSize: '0.875rem' }}
          >
            Get Started & Analyze CV
          </button>
        </div>
      </div>
    </div>
  );
}
