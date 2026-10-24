import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { useApp } from '../context/AppContext';
import WelcomeModal from '../components/WelcomeModal';
import HeroIllustration from '../components/characters/HeroIllustration';
import Footer from '../components/Footer';
import {
  DocumentIcon,
  SearchIcon,
  TargetIcon,
  ChatIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  BarChartIcon,
  UploadIcon,
} from '../components/icons/AppIcons';

const features = [
  {
    icon: <DocumentIcon size={24} color="var(--color-rich-blue)" />,
    title: 'Evidence-Based CV Extraction',
    description: 'AI extracts verified skills, projects, and work history directly from PDF or DOCX without hallucinations.',
    paletteClass: 'clay-card-blue',
  },
  {
    icon: <SearchIcon size={24} color="var(--color-plum)" />,
    title: 'Hybrid RAG Job Discovery',
    description: 'Dense ChromaDB vector search combined with BM25 lexical retrieval and ms-marco cross-encoder reranking over dataset jobs.',
    paletteClass: 'clay-card-lavender',
  },
  {
    icon: <TargetIcon size={24} color="var(--color-teal)" />,
    title: 'Transparent Skill-Gap Analysis',
    description: 'Distinguishes required skills with CV evidence from requirements not documented in your resume.',
    paletteClass: 'clay-card-mint',
  },
  {
    icon: <ChatIcon size={24} color="var(--color-terracotta)" />,
    title: 'Interactive Career Intelligence',
    description: 'Discuss roles, practice interview topics, or evaluate custom job descriptions on the fly with grounded AI.',
    paletteClass: 'clay-card-peach',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Upload Your CV',
    desc: 'Secure PDF or DOCX resume parsing into structured candidate profile.',
    cardClass: 'clay-card-blue',
    headingColor: 'var(--color-rich-blue)',
    iconBg: 'linear-gradient(135deg, #426FCE 0%, #679BF1 100%)',
    icon: <UploadIcon size={22} color="#FFFFFF" />,
    badgeColor: 'var(--color-rich-blue)',
    detail: 'Text-based parsing up to 10 MB',
  },
  {
    step: '02',
    title: 'Extract Profile & Evidence',
    desc: 'Pydantic schema validation mapping verified skills directly to source resume sections.',
    cardClass: 'clay-card-lavender',
    headingColor: 'var(--color-plum)',
    iconBg: 'linear-gradient(135deg, #5C477D 0%, #9D8AEF 100%)',
    icon: <DocumentIcon size={22} color="#FFFFFF" />,
    badgeColor: 'var(--color-plum)',
    detail: 'Zero hallucinated credentials',
  },
  {
    step: '03',
    title: 'Hybrid Retrieval & Reranking',
    desc: 'Dense embeddings + BM25Okapi lexical index + ms-marco cross-encoder precision reranker.',
    cardClass: 'clay-card-mint',
    headingColor: 'var(--color-teal)',
    iconBg: 'linear-gradient(135deg, #4FAEAA 0%, #8BD8C4 100%)',
    icon: <SearchIcon size={22} color="#FFFFFF" />,
    badgeColor: 'var(--color-teal)',
    detail: 'ChromaDB vector space',
  },
  {
    step: '04',
    title: 'Requirement & Gap Analysis',
    desc: 'Normalized skill matching comparing candidate proof directly against job excerpts.',
    cardClass: 'clay-card-peach',
    headingColor: 'var(--color-terracotta)',
    iconBg: 'linear-gradient(135deg, #C77D62 0%, #F0B69A 100%)',
    icon: <BarChartIcon size={22} color="#FFFFFF" />,
    badgeColor: 'var(--color-terracotta)',
    detail: 'Evidence-verified coverage',
  },
  {
    step: '05',
    title: 'Actionable Career Plan',
    desc: 'Clear evidence coverage metrics, priority preparation roadmaps, and targeted advice.',
    cardClass: 'clay-card-butter',
    headingColor: 'var(--color-deep-indigo)',
    iconBg: 'linear-gradient(135deg, #34345B 0%, #F0D78C 100%)',
    icon: <TrendingUpIcon size={22} color="#FFFFFF" />,
    badgeColor: 'var(--color-deep-indigo)',
    detail: 'Grounded readiness metrics',
  },
];

export default function LandingPage() {
  const { candidateId } = useApp();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-page)', overflowX: 'hidden' }}>
      {/* Onboarding Welcome Experience Modal */}
      <WelcomeModal forceOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />

      {/* Top Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(244, 239, 231, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(157, 138, 239, 0.25)',
          padding: '0 var(--space-8)',
          height: 'var(--topnav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <BrandLogo size={36} />
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--color-deep-indigo)',
              }}
            >
              CareerLens
            </span>
            <span
              className="font-mono"
              style={{
                marginLeft: 8,
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(66, 111, 206, 0.1)',
                color: 'var(--color-rich-blue)',
              }}
            >
              Clay RAG
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button
            onClick={() => setShowWelcomeModal(true)}
            className="btn btn-ghost btn-sm"
          >
            Platform Guide
          </button>
          <Link to="/how-it-works" className="btn btn-ghost btn-sm">
            Architecture
          </Link>
          <Link
            to={candidateId ? '/dashboard' : '/analyze'}
            className="btn btn-primary btn-sm"
          >
            {candidateId ? 'My Dashboard' : 'Get Started'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--space-12) var(--space-6) var(--space-10)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft multicolor animated radial glows */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(157, 138, 239, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 216, 196, 0.20) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: 'var(--content-max)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-10)',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left Column: Brand & Copy */}
          <div className="animate-fade-in" style={{ textAlign: 'left' }}>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.85)',
                boxShadow: 'var(--shadow-clay-sm)',
                border: '1px solid rgba(157, 138, 239, 0.35)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <SparklesIcon size={16} color="var(--color-rich-blue)" />
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-rich-blue)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                AI Career Intelligence &amp; Hybrid Job Discovery
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-5)',
                color: 'var(--color-deep-indigo)',
              }}
            >
              See Beyond <br />
              <span className="text-gradient">Your CV.</span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: 'var(--space-8)',
                maxWidth: 520,
              }}
            >
              Discover matching jobs from verified datasets using hybrid dense-lexical search, ms-marco cross-encoder reranking, and grounded skill-gap validation.
            </p>

            {/* Primary & Secondary CTAs */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/analyze" className="btn btn-primary btn-lg">
                <DocumentIcon size={20} color="white" />
                Analyze My CV
              </Link>
              <button onClick={() => setShowWelcomeModal(true)} className="btn btn-secondary btn-lg">
                Platform Guide
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheckIcon size={18} color="var(--color-teal)" />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Real Production RAG
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircleIcon size={18} color="var(--color-rich-blue)" />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Zero Hallucinated Metrics
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom 3D Clay Illustration */}
          <div className="animate-scale-in">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Core Features Section (Tinted Clay Cards) */}
      <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'rgba(255, 255, 255, 0.45)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'var(--space-2)', color: 'var(--color-deep-indigo)' }}>
              Intelligence Platform
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 600, margin: '0 auto' }}>
              Built with an end-to-end Retrieval-Augmented Generation pipeline — no simulated scores or black-box predictions
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
            {features.map((f, i) => (
              <div key={i} className={`clay-card ${f.paletteClass}`} style={{ padding: 'var(--space-6)' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: '#FFFFFF',
                    boxShadow: 'var(--shadow-clay-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--color-deep-indigo)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          Redesigned "Transparent Workflow" Section
          Featuring 5 distinct tinted Claymorphic cards & connecting visual
          ======================================================== */}
      <section
        style={{
          padding: 'var(--space-16) var(--space-8)',
          background: 'linear-gradient(160deg, #EAE5F4 0%, #E0EAF9 50%, #DADCF5 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial accents */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '20%',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 216, 196, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '15%',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240, 182, 154, 0.20) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(157, 138, 239, 0.35)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-plum)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Architectural Pipeline
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'var(--space-2)', color: 'var(--color-deep-indigo)' }}>
              Transparent Workflow
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 620, margin: '0 auto' }}>
              From initial CV ingestion to evidence-verified career readiness
            </p>
          </div>

          {/* 5 Distinct Claymorphic Workflow Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className={`clay-card ${step.cardClass} animate-fade-in`}
                style={{
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(60px, 80px) minmax(50px, 60px) 1fr auto',
                  alignItems: 'center',
                  gap: 'var(--space-5)',
                  boxShadow: 'var(--shadow-clay-md)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                {/* Number Badge */}
                <div
                  className="font-mono"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: step.headingColor,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {step.step}
                </div>

                {/* Custom Clay Icon Capsule */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: step.iconBg,
                    boxShadow: 'var(--shadow-clay-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1.125rem',
                      color: step.headingColor,
                      marginBottom: '0.2rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>

                {/* Detail Tag (Right) */}
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    color: step.headingColor,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action CTA */}
      <section
        style={{
          padding: 'var(--space-16) var(--space-8)',
          background: 'linear-gradient(135deg, #34345B 0%, #5C477D 100%)',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <BrandLogo size={56} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 'var(--space-3)' }}>
            Ready to See Beyond Your CV?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.0625rem', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
            Upload your CV and let CareerLens uncover the verified evidence, missing requirements, and real opportunities behind your next career move.
          </p>
          <Link
            to="/analyze"
            className="btn btn-primary btn-lg"
            style={{
              background: 'linear-gradient(135deg, #8BD8C4 0%, #426FCE 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
            }}
          >
            <BriefcaseIcon size={20} color="#FFFFFF" />
            Start Free Analysis
          </Link>
        </div>
      </section>

      {/* Cohesive Claymorphic Footer */}
      <Footer />
    </div>
  );
}
