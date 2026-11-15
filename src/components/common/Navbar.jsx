import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, CloudSun, ShieldCheck, UserCheck, ArrowRight, Menu, X, Globe } from 'lucide-react';

export default function Navbar({ currentLang, setCurrentLang, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-700 to-leaf flex items-center justify-center text-white shadow-md shadow-forest-800/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-forest-800 transition-colors">
                AgroCare<span className="text-leaf">.AI</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-forest-700">
                {currentLang === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ವೈದ್ಯ' : 'Smart Crop Doctor'}
              </span>
            </div>
          </Link>

          {/* Navigation Links (Public page only) */}
          {isPublicPage ? (
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-forest-700 transition-colors">How It Works</a>
              <a href="#features" className="hover:text-forest-700 transition-colors">AI Features</a>
              <a href="#diseases" className="hover:text-forest-700 transition-colors">Disease Library</a>
              <a href="#faq" className="hover:text-forest-700 transition-colors">FAQ</a>
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-3 bg-mint px-3.5 py-1.5 rounded-full border border-forest-100 text-xs text-forest-800">
              <CloudSun className="w-4 h-4 text-forest-600" />
              <span className="font-semibold">{user?.location || 'Your farm'}</span>
              <span className="text-slate-400">|</span>
              <span className="text-forest-700 font-medium">Optimal Spray Window Active</span>
            </div>
          )}

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100 rounded-lg p-1 text-xs font-semibold">
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${currentLang === 'en' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLang('kn')}
                className={`px-2.5 py-1 rounded-md transition-all ${currentLang === 'kn' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {user && (
              <span className="text-xs font-semibold text-slate-700 max-w-[140px] truncate">{user.name}</span>
            )}

            {isPublicPage ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-forest-700 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-semibold bg-forest-800 hover:bg-forest-900 text-white px-4 py-2 rounded-xl shadow-sm shadow-forest-900/20 transition-all hover:scale-[1.02]"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="text-sm font-semibold text-slate-700 hover:text-forest-800 px-3 py-2"
              >
                Log out
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Language / ಭಾಷೆ:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentLang('en')}
                className={`text-xs px-2.5 py-1 rounded font-semibold ${currentLang === 'en' ? 'bg-forest-800 text-white' : 'bg-slate-100'}`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLang('kn')}
                className={`text-xs px-2.5 py-1 rounded font-semibold ${currentLang === 'kn' ? 'bg-forest-800 text-white' : 'bg-slate-100'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-mint text-forest-900 font-semibold text-sm">
              Dashboard Overview
            </Link>
            <Link to="/diagnose" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-forest-800 text-white font-semibold text-sm">
              Diagnose Crop
            </Link>
            <Link to="/cases" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
              My Cases
            </Link>
            <Link to="/chatbot" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
              AI Plant Doctor
            </Link>
            <Link to="/treatment" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
              Treatment & Products
            </Link>
            <Link to="/recovery" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
              Recovery Tracker
            </Link>
            <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
              Notifications & Calendar
            </Link>
            <Link to="/expert" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium text-amber-700">
              Expert / Admin Desk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
