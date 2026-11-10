import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function Login({ setUserRole }) {
  const [role, setRole] = useState('farmer'); // farmer | expert | admin
  const [identifier, setIdentifier] = useState('98451 22390');
  const [password, setPassword] = useState('agrocare2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setUserRole(role);
      setLoading(false);
      if (role === 'expert') {
        navigate('/expert');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  const handleQuickDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'expert') {
      setIdentifier('dr.ramesh@uasb.edu.in');
      setPassword('expertPass123');
    } else {
      setIdentifier('+91 98451 22390');
      setPassword('farmerPass123');
    }
    setUserRole(demoRole);
    if (demoRole === 'expert') {
      navigate('/expert');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-mint/30 to-slate-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center shadow-md shadow-forest-900/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to AgroCare AI
          </h2>
          <p className="text-xs text-slate-500">
            Access your crop diagnoses, treatment plans, and recovery tracking
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2 rounded-lg transition-all ${role === 'farmer' ? 'bg-white text-forest-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            🌾 Farmer Login
          </button>
          <button
            type="button"
            onClick={() => setRole('expert')}
            className={`flex-1 py-2 rounded-lg transition-all ${role === 'expert' ? 'bg-white text-forest-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            🔬 Agri Expert
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-lg transition-all ${role === 'admin' ? 'bg-white text-forest-900 shadow-sm' : 'hover:text-slate-900'}`}
          >
            ⚙️ Admin
          </button>
        </div>

        {/* Demo Fast-Click helper for reviewers */}
        <div className="p-3 bg-mint rounded-xl border border-forest-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-forest-900">
            <UserCheck className="w-4 h-4 text-forest-700" />
            Evaluation Demo Shortcuts
          </div>
          <p className="text-forest-800 text-[11px]">
            Instantly bypass manual typing for demonstration:
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleQuickDemo('farmer')}
              type="button"
              className="flex-1 bg-white hover:bg-forest-50 border border-forest-300 py-1.5 rounded-lg font-bold text-[11px] text-forest-800 transition-colors"
            >
              1-Click as Farmer
            </button>
            <button
              onClick={() => handleQuickDemo('expert')}
              type="button"
              className="flex-1 bg-forest-800 hover:bg-forest-900 text-white py-1.5 rounded-lg font-bold text-[11px] transition-colors"
            >
              1-Click as Expert
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {role === 'farmer' ? 'Mobile Number / ರೈತರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Work Email / ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'farmer' ? '+91 98451 22390' : 'expert@uasb.edu.in'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password / ಪಾಸ್‌ವರ್ಡ್
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-forest-700 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-forest-700 focus:ring-forest-500" />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-forest-900/20 transition-all hover:scale-[1.01]"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to AgroCare AI?{' '}
          <Link to="/register" className="font-bold text-forest-800 hover:underline">
            Register your farm here
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reset Password via SMS</h3>
            <p className="text-xs text-slate-600">
              We will send a 4-digit OTP to your registered farmer mobile number to verify your account.
            </p>
            <input
              type="text"
              defaultValue="+91 98451 22390"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Demo OTP sent to +91 98451 22390: [4482]');
                  setShowForgotModal(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-forest-800 text-white"
              >
                Send OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
