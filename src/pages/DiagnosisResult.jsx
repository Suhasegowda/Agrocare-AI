import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Bot,
  Stethoscope,
  Activity,
  FileCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { mediaUrl } from '../api';

export default function DiagnosisResult({ onCreateCase }) {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [caseCreated, setCaseCreated] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
        <h1 className="text-xl font-extrabold text-slate-900">No diagnosis yet</h1>
        <p className="text-sm text-slate-500">Upload a leaf photo first. This page does not invent a disease name.</p>
        <Link to="/diagnose" className="inline-flex text-sm font-bold text-forest-800">Open the diagnosis studio</Link>
      </div>
    );
  }

  const confirmed = Boolean(result.confirmed) && !result.uncertain;
  const title = confirmed ? result.disease : 'Not confirmed';

  const handleCreateCase = async () => {
    if (!result.id) {
      setError('This result has no saved diagnosis id.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await onCreateCase(result);
      setCaseCreated(created);
      navigate('/cases');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-md font-bold border ${confirmed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              {confirmed ? 'Model confirmed' : 'Not confirmed'}
            </span>
            {!result.imageModel && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                Advisory crop
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{title}</h1>
          <p className="text-xs text-slate-500">
            {result.crop}{result.pathogen ? ` · ${result.pathogen}` : ''}
          </p>
          {result.message && <p className="text-xs text-slate-600 max-w-xl">{result.message}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!caseCreated ? (
            <button
              onClick={handleCreateCase}
              disabled={saving}
              className="flex items-center justify-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm"
            >
              <FileCheck className="w-4 h-4" /> {saving ? 'Saving...' : 'Save as case'}
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> {caseCreated.id}
            </span>
          )}
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Uploaded leaf</h3>
          {result.imageUrl && (
            <img src={mediaUrl(result.imageUrl)} alt={title} className="w-full max-h-96 object-contain rounded-2xl bg-slate-100" />
          )}
          <p className="text-xs text-slate-500">
            {result.gradCamUrl
              ? 'A localization map was produced with the trained weights.'
              : 'No localization map is shown. A heatmap is created only when trained weights confirm a class.'}
          </p>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Model reading</h3>
            <p className="text-sm font-bold text-slate-900">
              Confidence: {result.confidence == null ? 'Not measured' : `${result.confidence}%`}
            </p>
            <p className="text-xs text-slate-500">{result.confidenceMeaning || 'A missing score means the photo was not confirmed.'}</p>
            {result.symptoms?.length > 0 && (
              <ul className="space-y-1 text-xs text-slate-600">
                {result.symptoms.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            {!confirmed && (
              <div className="flex gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Arecanut, coconut, coffee, and tea stay in the written advisory. The photo model does not name a disease for them.</span>
              </div>
            )}
          </div>

          <div className="bg-mint rounded-3xl p-6 border border-forest-100 space-y-3">
            <h3 className="font-extrabold text-forest-900 text-sm">After you save the case</h3>
            <Link to="/treatment" className="flex items-center justify-between p-3 rounded-2xl bg-white border border-forest-200 text-xs font-bold">
              <span className="flex items-center gap-2"><Stethoscope className="w-4 h-4" /> Treatment notes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/chatbot" className="flex items-center justify-between p-3 rounded-2xl bg-white border border-forest-200 text-xs font-bold">
              <span className="flex items-center gap-2"><Bot className="w-4 h-4" /> Ask the plant doctor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/recovery" className="flex items-center justify-between p-3 rounded-2xl bg-white border border-forest-200 text-xs font-bold">
              <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Follow-up photos</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-forest-800 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              The chat refuses invented spray rates. Read the product label before any chemical use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
