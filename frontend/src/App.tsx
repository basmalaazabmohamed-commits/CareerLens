import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import ChatPage from './pages/ChatPage';
import JobDescriptionAnalyzerPage from './pages/JobDescriptionAnalyzerPage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import HowItWorksPage from './pages/HowItWorksPage';

export default function App() {
  return (
    <Routes>
      {/* Standalone Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Application routes inside the Claymorphic AppShell */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/jd-analyzer" element={<JobDescriptionAnalyzerPage />} />
        <Route path="/job/:jobId" element={<JobDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
