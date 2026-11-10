import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Bot, 
  Stethoscope, 
  Activity, 
  Download, 
  Eye, 
  Layers, 
  HelpCircle,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_DISEASE_PRESETS } from '../data/mockData';

export default function DiagnosisResult({ activeCase, onCreateCase }) {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result || activeCase || SAMPLE_DISEASE_PRESETS[0];

  const [viewMode, setViewMode] = useState('heatmap'); // 'original' | 'heatmap' | 'bounding'
  const [caseCreated, setCaseCreated] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState('AGC-2026-9481');
  const [expertRequested, setExpertRequested] = useState(false);

  const handleCreateCase = () => {
    setCaseCreated(true);
    if (onCreateCase) {
      onCreateCase({
        id: createdCaseId,
        disease: result.disease,
        crop: result.crop,
        severity: result.severity,
        confidence: result.confidence,
        imageUrl: result.imageUrl,
        dateCreated: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner with Case ID */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-forest-900 text-leaf">
              CASE: {createdCaseId}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              AI Vision Confirmed
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            {result.disease}
          </h1>
          <p className="text-xs text-slate-500 italic">
            Pathogen: {result.pathogen} &bull; Specimen: {result.crop}
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {!caseCreated ? (
            <button
              onClick={handleCreateCase}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <FileCheck className="w-4 h-4" /> Save as Active Case
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Case Registered in Database
            </span>
          )}

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> PDF Report
          </button>
        </div>
      </div>

      {/* Main Diagnosis Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Explainability (Grad-CAM & Bounding) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Explainable Vision AI Inspection</h3>
              <p className="text-[11px] text-slate-500">Grad-CAM gradient localization shows where the model focused</p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode('original')}
                className={`px-2.5 py-1 rounded-lg transition-all ${viewMode === 'original' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Original
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-2.5 py-1 rounded-lg transition-all ${viewMode === 'heatmap' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-600'}`}
              >
                Grad-CAM Heatmap
              </button>
              <button
                onClick={() => setViewMode('bounding')}
                className={`px-2.5 py-1 rounded-lg transition-all ${viewMode === 'bounding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Lesion Bounds
              </button>
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200 flex items-center justify-center">
            <img
              src={result.imageUrl}
              alt={result.disease}
              className="w-full h-full object-cover"
            />

            {/* Grad-CAM Simulation Overlay */}
            {viewMode === 'heatmap' && (
              <div className="absolute inset-0 bg-gradient-radial from-rose-500/50 via-amber-400/30 to-transparent mix-blend-color-burn pointer-events-none flex items-center justify-center">
                <div className="absolute w-48 h-48 rounded-full bg-rose-600/40 blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-amber-500/40 blur-lg"></div>
                <span className="absolute bottom-3 right-3 bg-black/80 text-leaf font-mono text-[11px] px-2.5 py-1 rounded-lg border border-leaf/40">
                  Heatmap: Concentric target necrosis detected
                </span>
              </div>
            )}

            {/* Bounding box simulation */}
            {viewMode === 'bounding' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[28%] left-[24%] w-[38%] h-[42%] border-2 border-leaf bg-leaf/10 rounded-lg">
                  <span className="absolute -top-5 left-0 bg-leaf text-forest-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow">
                    Alternaria lesion ({result.confidence}%)
                  </span>
                </div>
                <div className="absolute top-[55%] left-[58%] w-[25%] h-[28%] border-2 border-amber-400 bg-amber-400/10 rounded-lg">
                  <span className="absolute -top-5 left-0 bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow">
                    Secondary spore halo
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-forest-700" /> Transparent AI Explanation
            </div>
            <p className="text-[11px] leading-relaxed">
              The neural network activated heavily in the lower leaf quadrant where concentric annular rings and chlorotic halos matched reference PlantVillage & ICAR pathogen signatures.
            </p>
          </div>
        </div>

        {/* Right Column: AI Confidence, Severity & Treatment Next Steps */}
        <div className="lg:col-span-5 space-y-5">
          {/* Diagnostic Metrics Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Confidence & Severity Score
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Model Confidence</span>
                  <span className="font-black text-forest-800 text-sm">{result.confidence}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-leaf h-full rounded-full transition-all duration-700" style={{ width: `${result.confidence}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Estimated Canopy Severity</span>
                  <span className="font-black text-amber-600 text-sm">{result.severity} ({result.severityPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.severityPercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Identified Pathogen Symptoms:</span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {result.symptoms?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-700 mt-1 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="bg-gradient-to-br from-mint to-green-50 rounded-3xl p-6 border border-forest-100 space-y-3">
            <h3 className="font-extrabold text-forest-900 text-sm">Next Step Recommended Actions</h3>
            
            <Link
              to="/treatment"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-forest-200 text-slate-900 font-bold text-xs hover:border-forest-600 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-bold">View Treatment Plan</span>
                  <span className="text-[10px] text-slate-500 font-normal">Mancozeb dosage + non-chemical protocol</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-forest-700" />
            </Link>

            <Link
              to="/chatbot"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-forest-200 text-slate-900 font-bold text-xs hover:border-forest-600 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-bold">Ask AI Plant Doctor</span>
                  <span className="text-[10px] text-slate-500 font-normal">Ask weather spray timing or alternatives</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-forest-700" />
            </Link>

            <Link
              to="/recovery"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-forest-200 text-slate-900 font-bold text-xs hover:border-forest-600 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-bold">Start 14-Day Recovery Tracker</span>
                  <span className="text-[10px] text-slate-500 font-normal">Upload Day 4 & Day 7 progress photos</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-forest-700" />
            </Link>

            {/* Expert Escalation */}
            <div className="pt-2">
              {!expertRequested ? (
                <button
                  onClick={() => setExpertRequested(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-forest-400 hover:bg-forest-100/50 text-forest-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  Request Agronomist Second Opinion
                </button>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Case submitted to Dr. Ramesh Kumar (UAS Bangalore) for verification.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
