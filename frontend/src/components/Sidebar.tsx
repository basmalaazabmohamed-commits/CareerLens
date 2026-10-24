import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BrandLogo from './BrandLogo';
import {
  TrendingUpIcon,
  DocumentIcon,
  ChatIcon,
  SearchIcon,
  UserIcon,
  GearIcon,
  ShieldCheckIcon,
} from './icons/AppIcons';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <TrendingUpIcon size={20} />,
  },
  {
    label: 'Analyze CV',
    to: '/analyze',
    icon: <DocumentIcon size={20} />,
  },
  {
    label: 'AI Career Chat',
    to: '/chat',
    icon: <ChatIcon size={20} />,
  },
  {
    label: 'JD Analyzer',
    to: '/jd-analyzer',
    icon: <SearchIcon size={20} />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: 'My Profile',
    to: '/profile',
    icon: <UserIcon size={20} />,
  },
  {
    label: 'How It Works',
    to: '/how-it-works',
    icon: <GearIcon size={20} />,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, candidateId } = useApp();

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 'calc(var(--z-sidebar) - 1)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Brand Logo & Wordmark */}
        <Link
          to="/"
          className="sidebar-logo"
          onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
          title="CareerLens Home"
        >
          <BrandLogo size={36} />
          <div className="sidebar-logo-text">
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--color-midnight-plum)', lineHeight: 1.15 }}>
              CareerLens
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--clay-blue-accent)', fontWeight: 600 }}>
              See Beyond Your CV
            </div>
          </div>
        </Link>

        {/* Active Candidate Status Pill */}
        {candidateId && (
          <div
            style={{
              margin: '0.75rem 0.75rem 0.25rem',
              padding: sidebarOpen ? '0.5rem 0.75rem' : '0.5rem 0.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(131,220,203,0.18) 0%, rgba(174,204,239,0.2) 100%)',
              border: '1px solid rgba(131,220,203,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '0.5rem',
            }}
            title={`Active CV: ${candidateId}`}
          >
            <ShieldCheckIcon size={16} color="var(--clay-emerald)" />
            {sidebarOpen && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clay-emerald)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {candidateId}
              </span>
            )}
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Workspace</div>
          {mainNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
              onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label-text">{item.label}</span>
            </Link>
          ))}

          <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>Intelligence & Account</div>
          {secondaryNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
              onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer info (hidden when collapsed) */}
        <div
          className="sidebar-footer-content"
          style={{
            padding: '1rem 1.1rem',
            borderTop: '1px solid rgba(174, 204, 239, 0.35)',
            background: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--clay-emerald)' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-primary)' }}>RAG Pipeline Live</span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Hybrid Search + Cross-Encoder
          </p>
        </div>
      </aside>
    </>
  );
}
