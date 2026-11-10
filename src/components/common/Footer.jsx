import React from 'react';
import { Sprout, PhoneCall, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-leaf flex items-center justify-center text-forest-950 font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AgroCare<span className="text-leaf">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian smallholders and agronomists with explainable computer vision diagnostics, precision treatment plans, and continuous recovery tracking.
            </p>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs">
              <span className="text-[11px] text-amber-400 font-semibold block flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" /> Kisan Call Center Support
              </span>
              <p className="text-slate-300 font-bold mt-0.5">Toll-Free: 1800-180-1551</p>
              <p className="text-[10px] text-slate-400">Available 6:00 AM to 10:00 PM in 22 languages</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/diagnose" className="hover:text-leaf transition-colors">Instant Leaf Vision AI</Link></li>
              <li><Link to="/recovery" className="hover:text-leaf transition-colors">Before & After Recovery Tracking</Link></li>
              <li><Link to="/chatbot" className="hover:text-leaf transition-colors">AI Plant Doctor (RAG Advisory)</Link></li>
              <li><Link to="/treatment" className="hover:text-leaf transition-colors">Verified CIB&RC Products</Link></li>
              <li><Link to="/expert" className="hover:text-leaf transition-colors">Agronomist Verification Desk</Link></li>
            </ul>
          </div>

          {/* Crop Health Libraries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Supported Crops</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Tomato (Early/Late Blight, Leaf Curl)</li>
              <li>Potato (Late Blight, Black Scurf)</li>
              <li>Maize / Corn (Blight, Rust)</li>
              <li>Rice / Paddy (Blast, Brown Spot)</li>
              <li>Cotton (Bacterial Blight)</li>
              <li>Chilli (Anthracnose, Die-Back)</li>
            </ul>
          </div>

          {/* Scientific Disclaimer & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Prototype Advisory Note
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              AgroCare AI uses demonstration deep learning models and mock data for UI testing. Before applying restricted agro-chemicals in real fields, always consult your local Krishi Vigyan Kendra (KVK) officer or registered agricultural officer.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Built with React, Vite, and Tailwind CSS.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 AgroCare AI Platform. Dedicated to Indian Farmers.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">CIB&RC Regulatory Standards</span>
            <span className="hover:text-slate-400 cursor-pointer">Karnataka State Agri Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
