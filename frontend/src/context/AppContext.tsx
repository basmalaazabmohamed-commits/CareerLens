import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { CandidateProfile } from '../api/client';

interface AppState {
  candidateId: string | null;
  profile: CandidateProfile | null;
  sidebarOpen: boolean;
  setCandidateId: (id: string | null) => void;
  setProfile: (profile: CandidateProfile | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [candidateId, setCandidateId] = useState<string | null>(() =>
    localStorage.getItem('careerlens_candidate_id')
  );
  const [profile, setProfile] = useState<CandidateProfile | null>(() => {
    try {
      const stored = localStorage.getItem('careerlens_profile');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const handleSetCandidateId = useCallback((id: string | null) => {
    setCandidateId(id);
    if (id) {
      localStorage.setItem('careerlens_candidate_id', id);
    } else {
      localStorage.removeItem('careerlens_candidate_id');
      localStorage.removeItem('careerlens_profile');
      setProfile(null);
    }
  }, []);

  const handleSetProfile = useCallback((p: CandidateProfile | null) => {
    setProfile(p);
    if (p) {
      localStorage.setItem('careerlens_profile', JSON.stringify(p));
    } else {
      localStorage.removeItem('careerlens_profile');
    }
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);

  return (
    <AppContext.Provider value={{
      candidateId,
      profile,
      sidebarOpen,
      setCandidateId: handleSetCandidateId,
      setProfile: handleSetProfile,
      toggleSidebar,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
