interface SkeletonLoaderProps {
  type?: 'card' | 'job' | 'message' | 'profile';
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="clay-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div className="skeleton" style={{ height: 16, borderRadius: 6, width: '70%' }} />
          <div className="skeleton" style={{ height: 12, borderRadius: 6, width: '50%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 10, borderRadius: 6 }} />
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <div className="skeleton" style={{ height: 22, borderRadius: 'var(--radius-full)', width: 70 }} />
        <div className="skeleton" style={{ height: 22, borderRadius: 'var(--radius-full)', width: 60 }} />
        <div className="skeleton" style={{ height: 22, borderRadius: 'var(--radius-full)', width: 80 }} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
        <div className="skeleton" style={{ height: 32, borderRadius: 'var(--radius-full)', flex: 1 }} />
        <div className="skeleton" style={{ height: 32, borderRadius: 'var(--radius-full)', width: 36 }} />
      </div>
    </div>
  );
}

function SkeletonMessage() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0' }}>
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '75%' }} />
        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '60%' }} />
      </div>
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div className="clay-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 72, height: 72, borderRadius: 'var(--radius-xl)', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div className="skeleton" style={{ height: 20, width: '50%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 14, width: '35%', borderRadius: 6 }} />
        </div>
      </div>
      {[80, 65, 90, 55].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 12, borderRadius: 6, width: `${w}%` }} />
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = 'card', count = 3 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 0.08}s` }}>
          {type === 'job' && <SkeletonCard />}
          {type === 'message' && <SkeletonMessage />}
          {type === 'profile' && <SkeletonProfile />}
          {type === 'card' && <SkeletonCard />}
        </div>
      ))}
    </>
  );
}
