import { Link } from 'react-router-dom';
import LensExplorer from '../components/characters/LensExplorer';
import {
  ShieldCheckIcon,
  GearIcon,
  DocumentIcon,
  SearchIcon,
  TargetIcon,
  SparklesIcon,
  BriefcaseIcon,
  BarChartIcon,
  CheckCircleIcon,
} from '../components/icons/AppIcons';

const ARCHITECTURE_STEPS = [
  {
    step: '01',
    name: 'CV Upload',
    module: 'candidate_profile/parser.py',
    tech: 'pdfplumber + python-docx',
    desc: 'Extracts raw text streams from PDF and DOCX documents with robust encoding and whitespace handling.',
    accent: 'var(--color-rich-blue)',
    paletteClass: 'clay-card-blue',
  },
  {
    step: '02',
    name: 'Candidate Profile',
    module: 'candidate_profile/pipeline.py',
    tech: 'Pydantic v2 + Section Mapping',
    desc: 'Validates candidate profile and maps skills, projects, and work history directly to source document sections.',
    accent: 'var(--color-plum)',
    paletteClass: 'clay-card-lavender',
  },
  {
    step: '03',
    name: 'Job Retrieval',
    module: 'retrieval/hybrid_search.py',
    tech: 'ChromaDB + BM25Okapi',
    desc: 'Combines dense embeddings with sparse lexical indexing using reciprocal rank fusion over indexed jobs.',
    accent: 'var(--color-teal)',
    paletteClass: 'clay-card-mint',
  },
  {
    step: '04',
    name: 'Reranking',
    module: 'retrieval/reranking.py',
    tech: 'ms-marco-MiniLM-L-6-v2',
    desc: 'Cross-encoder joint attention model calculates fine-grained query-job relevance before deep analysis.',
    accent: 'var(--color-terracotta)',
    paletteClass: 'clay-card-peach',
  },
  {
    step: '05',
    name: 'Requirement Analysis',
    module: 'generation/job_requirements.py',
    tech: 'Structured JSON Schema',
    desc: 'Deconstructs jobs into required skills, preferred qualifications, experience thresholds, and responsibilities.',
    accent: 'var(--color-butter)',
    paletteClass: 'clay-card-butter',
  },
  {
    step: '06',
    name: 'Skill-Gap Analysis',
    module: 'generation/skill_gap_analysis.py',
    tech: 'Alias Normalization + Evidence',
    desc: 'Determines requirements with verified CV evidence and flags requirements with missing resume proof.',
    accent: 'var(--color-rich-blue)',
    paletteClass: 'clay-card-blue',
  },
  {
    step: '07',
    name: 'Personalized Results',
    module: 'generation/rag_chain.py',
    tech: 'FastAPI + Grounded RAG Chain',
    desc: 'Delivers grounded career intelligence, dataset citations, and targeted priority improvements.',
    accent: 'var(--color-plum)',
    paletteClass: 'clay-card-lavender',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="page-content" style={{ maxWidth: 1140, margin: '0 auto', width: '100%' }}>
      {/* Header with Mascot */}
      <div className="section-header" style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto var(--space-10)' }}>
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <LensExplorer size={110} animate={true} />
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(66, 111, 206, 0.1)',
            border: '1px solid rgba(66, 111, 206, 0.25)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <ShieldCheckIcon size={14} color="var(--color-rich-blue)" />
          <span
            className="font-mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--color-rich-blue)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            System Architecture
          </span>
        </div>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-deep-indigo)' }}>
          The Engineering Behind CareerLens
        </h1>
        <p className="section-subtitle" style={{ fontSize: '1.0625rem', margin: '0 auto' }}>
          CareerLens is built on an end-to-end Retrieval-Augmented Generation pipeline featuring hybrid search, cross-encoder reranking, and evidence-verified skill-gap analysis.
        </p>
      </div>

      {/* Grounding & Measurement Principle Callout */}
      <div
        className="clay-card-mint"
        style={{
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-10)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-clay-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <ShieldCheckIcon size={22} color="var(--text-on-mint)" />
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-on-mint)', margin: 0 }}>
            Grounding &amp; Measurement Principle
          </h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-on-mint)', lineHeight: 1.7, margin: 0 }}>
          <strong>Extracted Required-Skill Coverage</strong> measures the specific job requirements for which <em>supporting evidence was verified in your CV</em>. It is <strong>not</strong> an automated hiring probability, black-box decision score, or proof that you lack unmentioned capabilities.
        </p>
      </div>

      {/* Visual Workflow Flowchart */}
      <div
        className="clay-card-elevated"
        style={{
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-12)',
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(150deg, #FFFFFF 0%, #F5F9FE 50%, #EAE5F4 100%)',
          boxShadow: 'var(--shadow-clay-lg)',
        }}
      >
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.25rem', color: 'var(--color-deep-indigo)' }}>
          End-to-End Processing Workflow
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          Seven verified pipeline stages from raw resume ingestion to grounded career intelligence
        </p>

        {/* Responsive Connected Stages */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 'var(--space-3)',
            position: 'relative',
          }}
        >
          {ARCHITECTURE_STEPS.map((node, i) => (
            <div
              key={i}
              className="clay-card-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: 'var(--space-4) var(--space-3)',
                textAlign: 'center',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.95)',
              }}
            >
              <div
                className="font-mono"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: node.accent,
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-2)',
                }}
              >
                {node.step}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-deep-indigo)', lineHeight: 1.3 }}>
                {node.name}
              </div>
              <div className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: 4 }}>
                {node.tech.split('+')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Pipeline Components Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-deep-indigo)' }}>
          Core Pipeline Modules
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {ARCHITECTURE_STEPS.map((item) => (
            <div
              key={item.step}
              className={`clay-card-elevated ${item.paletteClass}`}
              style={{
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: item.accent,
                  }}
                >
                  {item.step}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '10px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {item.module}
                </span>
              </div>

              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-deep-indigo)', marginBottom: 'var(--space-2)' }}>
                {item.name}
              </h3>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 'var(--space-4)' }}>
                {item.desc}
              </p>

              <div
                style={{
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid rgba(157, 138, 239, 0.25)',
                  fontSize: '11px',
                  color: item.accent,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <GearIcon size={14} color={item.accent} />
                <span className="font-mono">{item.tech}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div
        className="clay-card-elevated"
        style={{
          padding: 'var(--space-10) var(--space-6)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #34345B 0%, #5C477D 100%)',
          color: 'white',
          borderRadius: 'var(--radius-2xl)',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 'var(--space-3)' }}>
          Experience the Platform
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 auto var(--space-6)' }}>
          Upload your CV to see your skills, evidence gaps, and tailored career intelligence in action.
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
          <BriefcaseIcon size={18} color="#FFFFFF" />
          Analyze My CV Now
        </Link>
      </div>
    </div>
  );
}
