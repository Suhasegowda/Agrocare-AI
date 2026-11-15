import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  ChevronRight
} from 'lucide-react';
import WeatherWidget from '../components/common/WeatherWidget';
import { mediaUrl } from '../api';

export default function Dashboard({ user, cases = [], onSelectCase }) {
  const activeCount = cases.filter(c => c.status === 'Active').length;
  const recoveryCount = cases.filter(c => c.status === 'In Recovery').length;
  const resolvedCount = cases.filter(c => c.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-forest-950/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-700/60 border border-forest-600 text-leaf text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-leaf animate-ping"></span>
              Farmer Dashboard Active{user?.location ? ` · ${user.location}` : ''}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaskara, {user?.name || 'farmer'}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-forest-100 leading-relaxed">
              {user?.location || 'Your farm'} · {cases.length} case{cases.length === 1 ? '' : 's'} on this account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              to="/diagnose"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-leaf hover:bg-green-500 text-forest-950 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              <ScanLine className="w-4 h-4" />
              Diagnose New Leaf
            </Link>
            <Link
              to="/cases"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl font-semibold text-sm border border-white/20 transition-colors"
            >
              View All Cases ({cases.length})
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Plants Monitored */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-forest-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Plots Monitored</span>
            <Sprout className="w-4 h-4 text-forest-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{cases.length}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> {user?.acreage ? `${user.acreage} acres on this account` : 'Cases saved on this account'}
          </div>
        </div>

        {/* Active Cases */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Infections</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{activeCount}</div>
          <div className="mt-2 text-[11px] text-slate-500">
            Immediate treatment in progress
          </div>
        </div>

        {/* Recovering */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-forest-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>In Recovery</span>
            <Activity className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-3xl font-black text-forest-800">{recoveryCount}</div>
          <div className="mt-2 text-[11px] text-slate-500">
            Follow-up stays qualitative until you add a photo
          </div>
        </div>

        {/* Resolved / Healed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-leaf transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Cases Healed</span>
            <CheckCircle2 className="w-4 h-4 text-leaf" />
          </div>
          <div className="text-3xl font-black text-slate-900">{resolvedCount}</div>
          <div className="mt-2 text-[11px] text-slate-500">
            Closed only after you confirm no new symptoms
          </div>
        </div>
      </div>

      {/* Grid: Charts + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Curve (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Crop Health & Recovery Rate</h3>
              <p className="text-xs text-slate-500">Weekly trajectory of healed plants across your fields</p>
            </div>
            <span className="text-xs font-bold text-forest-700 bg-mint px-2.5 py-1 rounded-full border border-forest-100">
              Last 30 Days
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed">
            {cases.length === 0
              ? 'This account has no cases yet. A new diagnosis is saved only after you upload a leaf photo.'
              : 'Recovery is recorded case by case. A follow-up photo can be marked improving, stable, worsening, inconclusive, or retake. It does not produce a cure percentage.'}
            <ul className="mt-3 space-y-2">
              {cases.slice(0, 4).map((item) => (
                <li key={item.id} className="flex justify-between gap-3 font-semibold text-slate-800">
                  <span>{item.crop} · {item.disease || 'Not confirmed'}</span>
                  <span className="text-slate-500">{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Micro-climate & Spray window */}
        <div className="space-y-4">
          <WeatherWidget location={user?.location || ''} />
        </div>
      </div>

      {/* Recent Diagnoses Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Recent Field Diagnoses</h3>
            <p className="text-xs text-slate-500">Real-time status of your crop pathology cases</p>
          </div>
          <Link
            to="/cases"
            className="text-xs font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1"
          >
            Manage All Cases <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Case ID & Crop</th>
                <th className="pb-3">Detected Disease</th>
                <th className="pb-3">Severity & AI Confidence</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Next Action</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      {c.imageUrl ? (
                        <img
                          src={mediaUrl(c.imageUrl)}
                          alt={c.crop}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-mint border border-slate-200" />
                      )}
                      <div>
                        <span className="font-mono font-bold text-slate-900 block">{c.id}</span>
                        <span className="text-slate-500">{c.crop} &bull; {c.field}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-slate-800 block">{c.disease || (c.uncertain ? 'Not confirmed' : '—')}</span>
                    <span className="text-[11px] text-slate-400 italic">{c.pathogen}</span>
                  </td>
                  <td className="py-3.5">
                    <div className="space-y-1 max-w-[140px]">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">{c.severity}</span>
                        <span className="text-forest-700 font-bold">{c.confidence == null ? 'Not measured' : `${c.confidence}%`}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.severity === 'Severe' ? 'bg-rose-500' : c.severity === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${c.severityPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      c.status === 'In Recovery'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : c.status === 'Active'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'In Recovery' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Follow-up in {c.followUpDueDays}d
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <Link
                      to="/recovery"
                      onClick={() => onSelectCase && onSelectCase(c.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs transition-colors"
                    >
                      Track <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
