import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Calendar,
  Activity,
  Bot,
  Stethoscope,
  RefreshCw,
  Archive
} from 'lucide-react';
import { INITIAL_CASES } from '../data/mockData';

export default function Cases({ cases = INITIAL_CASES, onSelectCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All | Active | In Recovery | Resolved
  const [cropFilter, setCropFilter] = useState('All');

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCrop = cropFilter === 'All' || c.crop === cropFilter;
    return matchesSearch && matchesStatus && matchesCrop;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Digital Pathology Records</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Crop Health Cases
          </h1>
          <p className="text-xs text-slate-500">
            Search by Case ID, track active recovery schedules & review healed diagnoses
          </p>
        </div>

        <Link
          to="/diagnose"
          className="flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Create New Diagnosis
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID (e.g. AGC-2026-8841), crop, or disease..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 w-full sm:w-auto overflow-x-auto">
          {['All', 'Active', 'In Recovery', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === status ? 'bg-white text-forest-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Crop dropdown filter */}
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-700 w-full sm:w-auto"
        >
          <option value="All">All Crops</option>
          <option value="Tomato">Tomato</option>
          <option value="Potato">Potato</option>
          <option value="Maize / Corn">Maize</option>
        </select>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No cases matched your filter</h3>
            <p className="text-xs text-slate-400">Try modifying your search or click "All" to view all records.</p>
          </div>
        ) : (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-forest-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left Info & Thumbnail */}
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                  <img
                    src={c.imageUrl}
                    alt={c.crop}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    {c.crop}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-slate-900">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'In Recovery'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'Active'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{c.disease}</h3>
                  <p className="text-xs text-slate-500">
                    Field: {c.field} &bull; Pathogen: <span className="italic">{c.pathogen}</span>
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Initiated: {c.dateCreated}</span>
                    <span>&bull;</span>
                    <span className="text-forest-700 font-semibold">AI Confidence: {c.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Progress and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-left md:text-right space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">Healing Trajectory</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-leaf h-full rounded-full"
                        style={{ width: `${100 - c.severityPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {100 - c.severityPercent}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {c.status === 'Resolved' ? 'Case Closed & Protected' : `Next follow-up in ${c.followUpDueDays}d`}
                  </span>
                </div>

                {/* Quick Link buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    to="/recovery"
                    onClick={() => onSelectCase && onSelectCase(c.id)}
                    className="p-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 transition-colors"
                    title="Open Recovery Tracker"
                  >
                    <Activity className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/chatbot"
                    onClick={() => onSelectCase && onSelectCase(c.id)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Consult Plant Doctor"
                  >
                    <Bot className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/treatment"
                    onClick={() => onSelectCase && onSelectCase(c.id)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="View Treatment Plan"
                  >
                    <Stethoscope className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/recovery"
                    onClick={() => onSelectCase && onSelectCase(c.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
