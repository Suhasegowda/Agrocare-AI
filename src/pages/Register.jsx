import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { CROPS_SUPPORTED } from '../data/mockData';

export default function Register({ onSession }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [acreage, setAcreage] = useState('');
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate();

  const handleToggleCrop = (id) => {
    if (selectedCrops.includes(id)) {
      setSelectedCrops(selectedCrops.filter(c => c !== id));
    } else {
      setSelectedCrops([...selectedCrops, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api('/auth/register', {
        method: 'POST',
        body: { name, mobile, location, acreage, selectedCrops, password },
      });
      setRegistered(true);
      onSession(result.user, result.token);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-mint/30 to-slate-100">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Register Your Farm
          </h2>
          <p className="text-xs text-slate-500">
            Join thousands of farmers receiving AI crop advisory and continuous recovery tracking
          </p>
        </div>

        {registered ? (
          <div className="p-6 bg-mint rounded-2xl border border-forest-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-700 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-forest-900">Registration Complete!</h3>
            <p className="text-xs text-forest-800">
              Welcome to AgroCare AI, {name}. Taking you to your farmer dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / ಪೂರ್ಣ ಹೆಸರು</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number / ಮೊಬೈಲ್</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District / ತಾಲೂಕು, ಜಿಲ್ಲೆ</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Land Size (Acres / ಎಕರೆ)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Crops Grown (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CROPS_SUPPORTED.map((crop) => {
                  const isSelected = selectedCrops.includes(crop.id);
                  return (
                    <button
                      type="button"
                      key={crop.id}
                      onClick={() => handleToggleCrop(crop.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-forest-600 bg-mint text-forest-900 shadow-xs ring-1 ring-forest-500'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{crop.icon}</span>
                      <span className="truncate">{crop.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Set Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
            >
              Complete Registration & Enter Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-forest-800 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
