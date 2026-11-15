import React, { useState } from 'react';
import { 
  Activity, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  TrendingDown, 
  ChevronRight, 
  Sliders, 
  ArrowRight,
  Clock,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mediaUrl } from '../api';

export default function Recovery({ activeCase }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Day 7
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [followUpUploaded, setFollowUpUploaded] = useState(false);

  if (!activeCase) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900">No case is open</h1>
        <p className="text-sm text-slate-500">A follow-up photo compares this case. It cannot close the case or report a cure percentage.</p>
      </div>
    );
  }

  const images = activeCase.followUpImages || [];
  const chartData = activeCase.recoveryHistory || [];

  const handleFollowUpNote = () => {
    setFollowUpUploaded(true);
    setShowUploadModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Rehabilitation Tracker</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recovery Monitoring & Timeline
          </h1>
          <p className="text-xs text-slate-500">
            Compare before-and-after leaf scans, track healing charts & schedule follow-ups
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-leaf hover:bg-green-600 text-forest-950 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <Camera className="w-4 h-4" />
          Upload Day Follow-up Photo
        </button>
      </div>

      {/* Case Recovery KPI Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Case</span>
          <span className="font-mono text-lg font-bold text-slate-900 block mt-0.5">{activeCase.id}</span>
          <span className="text-xs text-slate-500">{activeCase.crop} &bull; {activeCase.disease}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Current Healing Status</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-black text-forest-800">84% Healed</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Steady Recovery
            </span>
          </div>
          <span className="text-xs text-slate-500">Lesions contracted by 58%</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Protocol Timeline</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">Day 7 of 14</span>
          <span className="text-xs text-slate-500">Next milestone: Full Foliage Check</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Next Follow-up Due</span>
          <div className="flex items-center gap-1.5 mt-0.5 text-amber-600 font-bold text-sm">
            <Clock className="w-4 h-4" /> Due in {activeCase.followUpDueDays} Days
          </div>
          <span className="text-xs text-slate-500">Scheduled: {activeCase.nextFollowUp}</span>
        </div>
      </div>

      {/* Before and After Interactive Visual Gallery */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-700" />
              Before-and-After Leaf Photo Progression
            </h3>
            <p className="text-xs text-slate-500">Select any inspection stage to view healing visual evidence</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDayIndex === idx ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {img.date.split(' ')[0]} ({img.date.match(/\((.*?)\)/)?.[1] || `Day ${idx*4}`})
              </button>
            ))}
          </div>
        </div>

        {/* 2-Panel Side-by-Side: Day 0 vs Selected Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Day 0 Baseline */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Day 0 (Initial Scan - Oct 24)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                Severity: 38% (Active)
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 bg-slate-900">
              <img
                src={mediaUrl(images[0]?.url || activeCase.imageUrl)}
                alt="Baseline leaf"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[11px] px-2.5 py-1 rounded-lg">
                Baseline Inoculum
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Active concentric necrotic lesions across lower leaf veins with chlorotic yellow spreading rings.
            </p>
          </div>

          {/* Selected Stage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">{images[selectedDayIndex]?.date || 'Current Status'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Severity: {images[selectedDayIndex]?.severity ?? 'not scored'}
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 border-2 border-forest-600 bg-slate-900">
              <img
                src={mediaUrl(images[selectedDayIndex]?.url || activeCase.imageUrl)}
                alt="Follow-up leaf"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-forest-900/90 text-leaf text-[11px] px-2.5 py-1 rounded-lg font-bold border border-forest-700">
                Verified: {images[selectedDayIndex]?.note}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {images[selectedDayIndex]?.note}. Fungal expansion arrested; vigorous apical shoot development.
            </p>
          </div>
        </div>
      </div>

      {/* Trajectory Graph & Milestone Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Decline Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Lesion Severity Trajectory (% Area)
            </h3>
            <span className="text-[11px] font-bold text-forest-700 bg-mint px-2 py-0.5 rounded-full">
              Downward Trend
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="severity" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} name="Lesion Area (%)" />
                <Line type="monotone" dataKey="healthyPercent" stroke="#16a34a" strokeWidth={3} dot={{ r: 5, fill: '#16a34a' }} name="Healthy Foliage (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone Recovery Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-forest-700" />
            14-Day Clinical Milestones
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Day 0: Pathogen Identification & Quarantine</span>
                <span className="text-[11px] text-slate-500">Alternaria solani confirmed; 18 heavily infected lower leaves pruned.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Day 2: First Therapeutic Fungicide Application</span>
                <span className="text-[11px] text-slate-500">{activeCase.timeline?.[1]?.note || 'Recorded field activity stays on this case.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Day 4: Necrosis Halo Stabilization</span>
                <span className="text-[11px] text-slate-500">Chlorotic spread stopped; upper canopy free of new spores.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-mint border border-forest-200">
              <Clock className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-forest-900 block">Day 14: Final Clearance & Case Closure (Pending)</span>
                <span className="text-[11px] text-forest-800">Final photo upload due on Nov 03 for case resolution.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Follow-up Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Upload Day 8 Follow-up Specimen</h3>
            <p className="text-xs text-slate-500">
              Take a photo of the same marked branch on Plot A to compare healing progress against Day 0.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50">
              <Camera className="w-8 h-8 text-forest-700 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Snap or select photo</p>
              <p className="text-[10px] text-slate-400">Ensure good lighting without shadows</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleFollowUpNote}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-800 text-white flex items-center gap-1.5"
              >
                {followUpUploaded ? 'Analyzing Healing...' : 'Submit & Analyze Recovery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
