import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Diagnose from './pages/Diagnose';
import DiagnosisResult from './pages/DiagnosisResult';
import Chatbot from './pages/Chatbot';
import Treatment from './pages/Treatment';
import Recovery from './pages/Recovery';
import Cases from './pages/Cases';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import ExpertDashboard from './pages/ExpertDashboard';
import { api, clearSession, getToken, saveSession } from './api';

function AppContent() {
  const [cases, setCases] = useState([]);
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [currentLang, setCurrentLang] = useState('en');
  const [user, setUser] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const activeCase = cases.find((item) => item.id === activeCaseId) || null;

  useEffect(() => {
    if (!getToken()) {
      setSessionReady(true);
      return;
    }
    api('/auth/me')
      .then((profile) => setUser(profile))
      .catch(() => clearSession())
      .finally(() => setSessionReady(true));
  }, []);

  useEffect(() => {
    if (!user) {
      setCases([]);
      setActiveCaseId(null);
      return;
    }
    api('/cases')
      .then((rows) => {
        setCases(rows);
        setActiveCaseId((current) => current || rows[0]?.id || null);
      })
      .catch(() => setCases([]));
  }, [user]);

  const handleSession = (profile, token) => {
    saveSession(token);
    setUser(profile);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setCases([]);
    setActiveCaseId(null);
  };

  const handleCreateCase = async (diagnosis) => {
    const created = await api('/cases', {
      method: 'POST',
      body: { diagnosisId: diagnosis.id, variety: '', field: '' },
    });
    setCases((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    setActiveCaseId(created.id);
    return created;
  };

  const handleSelectCase = (id) => {
    setActiveCaseId(id);
  };

  if (!sessionReady) {
    return <div className="min-h-screen grid place-items-center text-sm text-slate-500">Loading your account...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        user={user}
        onLogout={handleLogout}
      />

      {isPublicPage ? (
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home currentLang={currentLang} />} />
            <Route path="/login" element={<Login onSession={handleSession} />} />
            <Route path="/register" element={<Register onSession={handleSession} />} />
          </Routes>
          {location.pathname === '/' && <Footer />}
        </div>
      ) : !user ? (
        <Navigate to="/login" replace />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar user={user} activeCase={activeCase} cases={cases} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50/70">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} cases={cases} onSelectCase={handleSelectCase} />} />
              <Route path="/diagnose" element={<Diagnose />} />
              <Route path="/diagnosis-result" element={<DiagnosisResult onCreateCase={handleCreateCase} />} />
              <Route path="/chatbot" element={<Chatbot activeCase={activeCase} cases={cases} />} />
              <Route path="/treatment" element={<Treatment activeCase={activeCase} />} />
              <Route path="/recovery" element={<Recovery activeCase={activeCase} />} />
              <Route path="/cases" element={<Cases cases={cases} onSelectCase={handleSelectCase} />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route
                path="/settings"
                element={<Settings user={user} onUserChange={setUser} currentLang={currentLang} setCurrentLang={setCurrentLang} />}
              />
              <Route path="/expert" element={user?.role === 'expert' || user?.role === 'admin' ? <ExpertDashboard user={user} /> : <Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
