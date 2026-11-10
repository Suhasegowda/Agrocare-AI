import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { INITIAL_CASES, SAMPLE_DISEASE_PRESETS } from './data/mockData';

function AppContent() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState('AGC-2026-8841');
  const [currentLang, setCurrentLang] = useState('en'); // 'en' | 'kn'
  const [userRole, setUserRole] = useState('farmer'); // 'farmer' | 'expert'

  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  const handleCreateCase = (newCaseInfo) => {
    const newCase = {
      ...INITIAL_CASES[0],
      id: newCaseInfo.id || `AGC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      crop: newCaseInfo.crop,
      disease: newCaseInfo.disease,
      severity: newCaseInfo.severity || 'Moderate',
      severityPercent: 40,
      status: 'Active',
      confidence: newCaseInfo.confidence || 96.0,
      imageUrl: newCaseInfo.imageUrl,
      dateCreated: new Date().toISOString().split('T')[0],
      followUpDueDays: 3,
      timeline: [
        { day: 'Day 0', label: 'AI Diagnostic Scan', severity: 40, status: 'Active', note: 'AI confirmed infection. Treatment initialized.' }
      ]
    };

    setCases([newCase, ...cases]);
    setActiveCaseId(newCase.id);
  };

  const handleSelectCase = (id) => {
    setActiveCaseId(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {isPublicPage ? (
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home currentLang={currentLang} />} />
            <Route path="/login" element={<Login setUserRole={setUserRole} />} />
            <Route path="/register" element={<Register setUserRole={setUserRole} />} />
          </Routes>
          {location.pathname === '/' && <Footer />}
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Left Sidebar */}
          <Sidebar userRole={userRole} activeCaseId={activeCaseId} />

          {/* Main Dashboard Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50/70">
            <Routes>
              <Route
                path="/dashboard"
                element={<Dashboard cases={cases} onSelectCase={handleSelectCase} />}
              />
              <Route
                path="/diagnose"
                element={<Diagnose onAnalyzeComplete={handleCreateCase} />}
              />
              <Route
                path="/diagnosis-result"
                element={<DiagnosisResult activeCase={activeCase} onCreateCase={handleCreateCase} />}
              />
              <Route
                path="/chatbot"
                element={<Chatbot activeCase={activeCase} />}
              />
              <Route
                path="/treatment"
                element={<Treatment activeCase={activeCase} />}
              />
              <Route
                path="/recovery"
                element={<Recovery activeCase={activeCase} />}
              />
              <Route
                path="/cases"
                element={<Cases cases={cases} onSelectCase={handleSelectCase} />}
              />
              <Route
                path="/notifications"
                element={<Notifications />}
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    currentLang={currentLang}
                    setCurrentLang={setCurrentLang}
                    userRole={userRole}
                    setUserRole={setUserRole}
                  />
                }
              />
              <Route
                path="/expert"
                element={<ExpertDashboard />}
              />
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
