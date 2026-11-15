import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanLine, 
  FolderGit2, 
  Bot, 
  Stethoscope, 
  Activity, 
  Bell, 
  ShieldCheck, 
  Settings,
  ChevronRight,
  ExternalLink,
  Sprout
} from 'lucide-react';

export default function Sidebar({ user, activeCase, cases = [] }) {
  const openCases = cases.filter((item) => item.status !== 'Resolved').length;
  const initials = (user?.name || 'Farmer')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Diagnose Leaf', path: '/diagnose', icon: ScanLine, highlight: true },
    { label: 'My Cases', path: '/cases', icon: FolderGit2, badge: String(openCases) },
    { label: 'AI Plant Doctor', path: '/chatbot', icon: Bot },
    { label: 'Treatment & Shops', path: '/treatment', icon: Stethoscope },
    { label: 'Recovery Tracker', path: '/recovery', icon: Activity },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Expert Desk', path: '/expert', icon: ShieldCheck, expertOnly: true },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-6">
        {/* Active Case Context Pill */}
        <div className="bg-gradient-to-br from-mint to-green-50 p-3.5 rounded-xl border border-forest-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-forest-800 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-leaf animate-pulse"></span>
              Active Case
            </span>
            <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-forest-200">
              {activeCase?.id || 'None'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium truncate">
            {activeCase ? `${activeCase.crop} — ${activeCase.disease || 'Unconfirmed'}` : 'No case yet'}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-forest-700">
            <span>Recovery: 84%</span>
            <NavLink to="/recovery" className="hover:underline flex items-center gap-0.5 font-bold">
              Track <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Features
          </div>
          {navItems.map((item) => {
            if (item.expertOnly && user?.role !== 'expert' && user?.role !== 'admin') return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-forest-800 text-white shadow-sm shadow-forest-900/10' 
                    : item.highlight
                    ? 'text-forest-800 bg-mint hover:bg-forest-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 group-hover:bg-white group-hover:text-forest-900">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Farmer Profile Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest-700 text-white font-bold flex items-center justify-center text-sm shadow">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.name || 'Signed-in farmer'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.role === 'expert' ? 'Plant pathologist' : [user?.location, user?.acreage ? `${user.acreage} acres` : ''].filter(Boolean).join(' · ') || user?.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
