import { useState, useRef, useCallback } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import type { ApiError as ApiErrorType } from '../api/client';
import {
  UploadIcon,
  DocumentIcon,
  CheckCircleIcon,
  InfoIcon,
} from './icons/AppIcons';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploadProps {
  onSuccess?: (candidateId: string) => void;
  compact?: boolean;
}

export default function FileUpload({ onSuccess, compact = false }: FileUploadProps) {
  const { setCandidateId, setProfile } = useApp();
  const [state, setState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ candidate_id: string; skill_count: number; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(ext || '')) {
      return 'Only PDF (.pdf) and DOCX (.docx) files are supported.';
    }
    if (f.size > 10 * 1024 * 1024) {
      return 'File must be smaller than 10 MB.';
    }
    if (f.size === 0) {
      return 'The file appears to be empty.';
    }
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setFile(f);
    setError(null);
    setState('idle');
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;
    setState('uploading');
    setError(null);

    try {
      const res = await api.uploadCV(file);
      setResult(res);
      setState('success');
      setCandidateId(res.candidate_id);

      // Eagerly load profile into context
      try {
        const profile = await api.getCandidateProfile(res.candidate_id);
        setProfile(profile);
      } catch { /* profile will load on demand */ }

      onSuccess?.(res.candidate_id);
    } catch (err) {
      const apiErr = err as ApiErrorType;
      setError(apiErr.detail || 'Upload failed. Please try again.');
      setState('error');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setState('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Drop zone */}
      {state !== 'success' && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload CV — click or drag and drop"
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--color-rich-blue)' : file ? 'var(--color-teal)' : 'rgba(157, 138, 239, 0.45)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: compact ? 'var(--space-6)' : 'var(--space-8)',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver
              ? 'rgba(66, 111, 206, 0.08)'
              : file
              ? 'linear-gradient(135deg, rgba(139, 216, 196, 0.12) 0%, rgba(224, 234, 249, 0.25) 100%)'
              : 'linear-gradient(145deg, rgba(240, 244, 253, 0.7) 0%, rgba(234, 229, 244, 0.5) 100%)',
            transition: 'all var(--transition-base)',
            boxShadow: dragOver
              ? '0 0 0 4px rgba(66, 111, 206, 0.16)'
              : 'var(--shadow-clay-inset)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            aria-hidden="true"
          />

          {file ? (
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #8BD8C4 0%, #4FAEAA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-3)',
                  boxShadow: 'var(--shadow-clay-sm)',
                  color: '#FFFFFF',
                }}
              >
                <DocumentIcon size={24} color="#FFFFFF" />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-deep-indigo)', marginBottom: 4 }}>
                {file.name}
              </p>
              <p className="font-mono" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {(file.size / 1024).toFixed(1)} KB · Validated {file.name.split('.').pop()?.toUpperCase()} format
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, #FAF7FD 0%, #EAE5F4 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-3)',
                  boxShadow: 'var(--shadow-clay-sm)',
                }}
              >
                <UploadIcon size={26} color="var(--color-rich-blue)" />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-deep-indigo)', marginBottom: 'var(--space-1)' }}>
                {dragOver ? 'Drop your CV document here' : 'Drop your resume file or browse'}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Drag &amp; drop or click to select from your device
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(157, 138, 239, 0.25)',
                }}
              >
                <span className="font-mono">PDF</span> &amp; <span className="font-mono">DOCX</span> · Text-based up to 10 MB
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-error-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-error)',
            fontSize: '0.8125rem',
          }}
        >
          <InfoIcon size={18} color="var(--color-error)" />
          <span>{error}</span>
        </div>
      )}

      {/* Success state */}
      {state === 'success' && result && (
        <div
          className="clay-card-mint animate-scale-in"
          style={{
            padding: 'var(--space-5)',
            marginTop: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-clay-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #8BD8C4 0%, #4FAEAA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <CheckCircleIcon size={20} color="#FFFFFF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-on-mint)', fontSize: '0.9375rem' }}>
                CV Parsed &amp; Validated
              </p>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-on-mint)', opacity: 0.85 }}>
                Candidate ID: {result.candidate_id}
              </p>
            </div>
            <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              Upload New
            </button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span
              className="skill-chip skill-chip-matched"
              style={{ fontSize: '0.75rem' }}
            >
              {result.skill_count} Structured Skills Mapped
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {file && state !== 'success' && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', justifyContent: 'flex-end' }}>
          <button onClick={handleReset} className="btn btn-secondary btn-sm" disabled={state === 'uploading'}>
            Clear
          </button>
          <button
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={state === 'uploading'}
            aria-busy={state === 'uploading'}
          >
            {state === 'uploading' ? (
              <>
                <svg
                  style={{ animation: 'spin 1s linear infinite' }}
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" d="M12 2a10 10 0 1 0 10 10" />
                </svg>
                Extracting Profile &amp; Evidence…
              </>
            ) : (
              <>
                <UploadIcon size={16} color="#FFFFFF" />
                Process &amp; Ingest CV
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
