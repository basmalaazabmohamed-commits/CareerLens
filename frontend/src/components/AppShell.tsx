import { Outlet, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import { UserIcon, ShieldCheckIcon } from './icons/AppIcons';

export default function AppShell() {
  const { toggleSidebar, sidebarOpen, candidateId } = useApp();

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar />

      <div className="main-content">
        {/* Top navigation bar */}
        <header className="top-nav" role="banner">
          {/* Hamburger / Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggleSidebar}
              aria-label="Toggle navigation sidebar"
              style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>CareerLens</span>
              <span style={{ color: 'var(--clay-neutral-cool)' }}>/</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-midnight-plum)' }}>Intelligence Platform</span>
            </div>
          </div>

          {/* Right side status & actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Link
              to="/how-it-works"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8125rem' }}
            >
              Architecture & Transparency
            </Link>

            {candidateId ? (
              <Link
                to="/profile"
                className="clay-card-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '0.35rem 0.85rem',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(131,220,203,0.18) 100%)',
                  border: '1px solid rgba(131,220,203,0.5)',
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--clay-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <ShieldCheckIcon size={14} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', lineHeight: 1 }}>Active CV</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--clay-emerald)', lineHeight: 1.2 }}>{candidateId}</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/analyze"
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.8125rem' }}
              >
                <UserIcon size={16} />
                Upload CV
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
