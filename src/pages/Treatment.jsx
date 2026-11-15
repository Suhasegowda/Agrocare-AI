import React, { useEffect, useState } from 'react';
import { 
  Stethoscope, 
  Calculator, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Plus, 
  Store, 
  ExternalLink,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { api } from '../api';

export default function Treatment({ activeCase }) {
  const [activeTier, setActiveTier] = useState('cultural');
  const [plan, setPlan] = useState(null);
  const [treatmentLogs, setTreatmentLogs] = useState([]);
  const [newActionText, setNewActionText] = useState('');
  const [newActionType, setNewActionType] = useState('Cultural');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeCase) return;
    setTreatmentLogs(activeCase.treatmentLogs || []);
    api(`/cases/${activeCase.id}/treatment-plan`)
      .then(setPlan)
      .catch((err) => setError(err.message));
  }, [activeCase]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newActionText.trim() || !activeCase) return;
    try {
      const saved = await api(`/cases/${activeCase.id}/treatment-logs`, {
        method: 'POST',
        body: { action: newActionText, type: newActionType },
      });
      setTreatmentLogs((current) => [saved, ...current]);
      setNewActionText('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!activeCase) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900">No case is open</h1>
        <p className="text-sm text-slate-500">Save a diagnosis before opening a treatment plan.</p>
      </div>
    );
  }

  const lines = activeTier === 'cultural'
    ? plan?.culturalControl || []
    : activeTier === 'bio'
      ? plan?.biologicalControl || []
      : plan?.chemicalControl || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Therapeutic Advisory</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Treatment Plan & Product Locator
          </h1>
          <p className="text-xs text-slate-500">
            Written cultural steps for this case. Chemical lines, when present, are label references to verify. AgroCare does not calculate a spray rate.
          </p>
        </div>

        <div className="bg-forest-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
          <span>Active Case:</span>
          <span className="text-leaf">{activeCase.id}</span>
        </div>
      </div>

      {/* 3-Tier Management Strategy Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTier('cultural')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTier === 'cultural' ? 'bg-white text-forest-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            1. Cultural & Field Sanitation
          </button>
          <button
            onClick={() => setActiveTier('bio')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTier === 'bio' ? 'bg-white text-forest-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            2. Biological & Organic Agents
          </button>
          <button
            onClick={() => setActiveTier('chemical')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTier === 'chemical' ? 'bg-forest-800 text-white shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            3. Approved Chemical Fungicides
          </button>
        </div>

        {/* Content based on Active Tier */}
        <div className="space-y-3">
          {lines.length === 0 ? (
            <p className="text-xs text-slate-500">No written steps are stored for this case yet. An unconfirmed photo does not receive a spray plan.</p>
          ) : lines.map((line) => (
            <p key={line} className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-4">{line}</p>
          ))}
          {activeTier === 'chemical' && (
            <p className="text-xs text-amber-800">{plan?.disclaimer}</p>
          )}
        </div>
      </div>

      {/* 2-Column: Dosage Calculator & Safety Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dosage Calculator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <Calculator className="w-4 h-4 text-forest-700" />
            No tank-mix calculator
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            AgroCare does not turn a photo into grams per litre. If a chemical line appears above, it is a stored label reference. Check the current product label, or ask an agriculture officer, before mixing anything.
          </p>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          {(plan?.safetyNotes || []).map((note) => (
            <p key={note} className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">{note}</p>
          ))}
        </div>

        {/* Safety & PPE Requirements */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Farmer Safety & Harvest Intervals
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block">Check the label interval</span>
              <p className="text-amber-800 text-[11px]">
                Harvest and re-entry times come from the product label, not from this screen.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Field Re-Entry Interval (REI): 24 Hours</span>
              <p className="text-slate-600 text-[11px]">
                Keep livestock and field workers out of Plot A for 24 hours post-spraying until foliage has fully dried.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-slate-700 block">Required PPE:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium">Nitrile Gloves</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium">Face Mask (N95)</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium">Full Sleeves & Boots</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Local Agricultural Shops */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-forest-700" />
              Listed shops. Stock is not live.
            </h3>
            <p className="text-xs text-slate-500">Stock authorized genuine pesticides and subsidized bio-fertilizers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(plan?.shops || []).map((shop) => (
            <div key={shop.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-forest-300 transition-all space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{shop.name}</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {shop.distance}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {shop.address}
              </p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {shop.phone}
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{shop.openStatus}</span>
                <a
                  href={`tel:${shop.phone.replace(/\s+/g, '')}`}
                  className="font-bold text-forest-800 hover:underline flex items-center gap-0.5"
                >
                  Call Shop
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Activity Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-forest-700" />
          Treatment Event History for Case {activeCase.id}
        </h3>

        {/* Add new event */}
        <form onSubmit={handleAddLog} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newActionText}
            onChange={(e) => setNewActionText(e.target.value)}
            placeholder="Log action (e.g., Applied 45L Mancozeb spray on row 1-4)..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
          <select
            value={newActionType}
            onChange={(e) => setNewActionType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
          >
            <option value="Chemical">Chemical</option>
            <option value="Biological">Biological</option>
            <option value="Cultural">Cultural</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Log Event
          </button>
        </form>

        {/* History stream */}
        <div className="space-y-2 pt-2">
          {treatmentLogs.map((log, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">{log.action}</span>
                <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                log.type === 'Chemical' ? 'bg-amber-100 text-amber-800' : log.type === 'Biological' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
