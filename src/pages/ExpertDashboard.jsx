import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Sparkles, 
  Send, 
  Sliders, 
  MapPin, 
  Layers,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Edit3
} from 'lucide-react';
import { api, mediaUrl } from '../api';

export default function ExpertDashboard({ user }) {
  const [queue, setQueue] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [verifiedDisease, setVerifiedDisease] = useState('');
  const [severityAdjustment, setSeverityAdjustment] = useState(0);
  const [expertNote, setExpertNote] = useState('');
  const [approvedStatus, setApprovedStatus] = useState(false);

  useEffect(() => {
    api('/expert/queue')
      .then((rows) => {
        setQueue(rows);
        setSelectedCase(rows[0] || null);
        setVerifiedDisease(rows[0]?.predictedDisease || '');
      })
      .catch(() => setQueue([]));
  }, []);

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setVerifiedDisease(c.predictedDisease);
    setApprovedStatus(false);
  };

  const handleApprove = async () => {
    if (!selectedCase || !verifiedDisease.trim()) return;
    await api('/expert/reviews', {
      method: 'POST',
      body: {
        caseId: selectedCase.caseId,
        verifiedDisease,
        severityPercent: Number(severityAdjustment) || 0,
        decision: 'approve',
        note: expertNote,
      },
    });
    const remaining = queue.filter((item) => item.caseId !== selectedCase.caseId);
    setQueue(remaining);
    setSelectedCase(remaining[0] || null);
    setVerifiedDisease(remaining[0]?.predictedDisease || '');
    setApprovedStatus(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-forest-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-forest-800 text-leaf text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Agronomist & Pathologist Verification Desk
            </span>
            <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
              Role: Senior Agronomist
            </span>
          </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'Expert'}
          </h1>
          <p className="text-xs text-slate-400">
            University of Agricultural Sciences (UAS), Bangalore &bull; Karnataka State Crop Surveillance Center
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-xs space-y-1">
          <span className="text-[11px] text-amber-400 font-bold block">Triage Queue Status</span>
          <div className="text-xl font-black text-white">{queue.length} Cases Requiring Verification</div>
          <p className="text-[10px] text-slate-400">AI confidence below 75% or farmer requested second opinion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Cases for Agronomist Review
          </h3>

          <div className="space-y-2">
            {queue.map((item) => (
              <div
                key={item.caseId}
                onClick={() => handleSelectCase(item)}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  selectedCase?.caseId === item.caseId
                    ? 'border-forest-600 bg-mint text-forest-900 shadow-sm ring-1 ring-forest-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                }`}
              >
                <div className="flex justify-between font-bold mb-1">
                  <span className="font-mono text-xs">{item.caseId}</span>
                  <span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-2 py-0.5 rounded">
                    {item.confidence}% Conf
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900">{item.crop} — {item.predictedDisease}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Farmer: {item.farmerName}</p>
                <p className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg mt-2 font-medium">
                  {item.reasonForReview}
                </p>
              </div>
            ))}

            {queue.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-leaf mx-auto" />
                <p className="font-bold text-slate-800">All cases verified!</p>
                <p className="text-[11px]">No pending diagnoses in triage queue.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Verification Workspace (8 cols) */}
        {selectedCase && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-bold text-forest-800 bg-mint px-2 py-0.5 rounded">
                  CASE: {selectedCase.caseId}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  Pathology Verification Workspace
                </h2>
                <p className="text-xs text-slate-500">
                  Submitted by {selectedCase.farmerName} &bull; Crop: <strong>{selectedCase.crop}</strong>
                </p>
              </div>

              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Received: {selectedCase.submittedAt}
              </span>
            </div>

            {/* Specimen and AI preliminary diagnosis comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">Farmer Specimen Photo</span>
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200">
                  {selectedCase.imageUrl ? (
                    <img src={mediaUrl(selectedCase.imageUrl)} alt="Specimen" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-xs text-slate-300">No photo stored</div>
                  )}
                  <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded">
                    Plot B Specimen
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  AI Model Preliminary Detection
                </span>
                <div>
                  <span className="text-slate-500 block">Predicted Condition:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedCase.predictedDisease}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">AI Confidence Score:</span>
                  <span className="font-bold text-amber-600">{selectedCase.confidence == null ? 'Not measured' : `${selectedCase.confidence}%`}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Farmer's Field Note:</span>
                  <p className="text-slate-700 italic bg-white p-2 rounded-xl border border-slate-200 mt-1">
                    "{selectedCase.farmerNotes}"
                  </p>
                </div>
              </div>
            </div>

            {/* Agronomist Override & Prescription Form */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-forest-700" />
                Agronomist Review & Formal Prescription
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Confirmed Diagnosis (Override if necessary)
                  </label>
                  <select
                    value={verifiedDisease}
                    onChange={(e) => setVerifiedDisease(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="Potato Late Blight">Potato Late Blight (Phytophthora infestans)</option>
                    <option value="Potato Early Blight">Potato Early Blight (Alternaria solani)</option>
                    <option value="Black Scurf">Black Scurf (Rhizoctonia solani)</option>
                    <option value="Bacterial Wilt">Bacterial Wilt (Ralstonia solanacearum)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Verified Severity Index</label>
                    <span className="font-black text-rose-600">{severityAdjustment}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={severityAdjustment}
                    onChange={(e) => setSeverityAdjustment(e.target.value)}
                    className="w-full accent-forest-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Advisory & Prescription to Farmer:
                </label>
                <textarea
                  rows={3}
                  value={expertNote}
                  onChange={(e) => setExpertNote(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-forest-600 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  {approvedStatus ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 animate-spin" />
                      Dispatching to Farmer...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-4 h-4" />
                      Approve & Dispatch Prescription to {selectedCase.farmerName}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
