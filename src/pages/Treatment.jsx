import React, { useState } from 'react';
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
import { VERIFIED_PRODUCTS, NEARBY_AGRI_SHOPS, INITIAL_CASES } from '../data/mockData';

export default function Treatment({ activeCase = INITIAL_CASES[0] }) {
  const [activeTier, setActiveTier] = useState('chemical'); // 'cultural' | 'bio' | 'chemical'
  const [tankSize, setTankSize] = useState(15); // Liters
  const [dosageRate, setDosageRate] = useState(2.0); // grams or ml per liter
  const [treatmentLogs, setTreatmentLogs] = useState(activeCase.treatmentLogs || []);
  const [newActionText, setNewActionText] = useState('');
  const [newActionType, setNewActionType] = useState('Chemical');

  const computedDose = (tankSize * dosageRate).toFixed(1);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newActionText.trim()) return;

    const newLog = {
      date: new Date().toISOString().split('T')[0],
      action: newActionText,
      type: newActionType
    };

    setTreatmentLogs([newLog, ...treatmentLogs]);
    setNewActionText('');
  };

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
            CIB&RC approved pesticide schedules, bio-formulations, tank dosage calculator & verified shops
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
        {activeTier === 'cultural' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-forest-700" />
              Non-Chemical Mechanical Practices (Immediate Actions)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 block">Foliage Pruning</span>
                <p className="text-xs text-slate-600">
                  Carefully prune all lower leaves within 15 cm of soil surface. Do NOT compost infected leaf trimmings; bury or burn them.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 block">Drip Irrigation Only</span>
                <p className="text-xs text-slate-600">
                  Cease all overhead sprinklers. Free water on leaf cuticles promotes spore germination in less than 4 hours.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 block">Disinfect Pruning Shears</span>
                <p className="text-xs text-slate-600">
                  Dip shears in 5% sodium hypochlorite or spirit after trimming each row to avoid mechanical pathogen transfer.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTier === 'bio' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-leaf" />
              Bio-Fungicides & Eco-Friendly Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VERIFIED_PRODUCTS.filter(p => p.type.includes('Organic') || p.type.includes('Bio')).map((prod) => (
                <div key={prod.id} className="p-4 rounded-2xl bg-mint/50 border border-forest-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500">{prod.activeIngredient}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-forest-800 border border-forest-200">
                      {prod.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Recommended Application: {prod.dosage}</p>
                  <div className="text-[11px] text-forest-700 font-semibold">{prod.seller}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTier === 'chemical' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-forest-700" />
              Standard Chemical Control (CIB&RC Registered)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VERIFIED_PRODUCTS.filter(p => p.type === 'Chemical').map((prod) => (
                <div key={prod.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Reg: {prod.cibNumber}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-forest-800 text-white">
                      {prod.price}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div><strong>Active Component:</strong> {prod.activeIngredient}</div>
                    <div><strong>Dosage:</strong> {prod.dosage}</div>
                    <div><strong>Toxicity Label:</strong> <span className="text-amber-700 font-semibold">{prod.safetyTag}</span></div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-forest-700 font-bold">{prod.seller}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2-Column: Dosage Calculator & Safety Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dosage Calculator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <Calculator className="w-4 h-4 text-forest-700" />
            Sprayer Tank Dosage Calculator
          </div>
          <p className="text-xs text-slate-500">
            Calculate the exact grams or milliliters required for your knapsack tank to avoid pesticide burning or under-dosing.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sprayer Water Capacity (Liters)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 16, 20].map((liters) => (
                  <button
                    key={liters}
                    type="button"
                    onClick={() => setTankSize(liters)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      tankSize === liters
                        ? 'border-forest-600 bg-mint text-forest-900 ring-1 ring-forest-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {liters} Liters
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prescribed Rate (g or ml per 1 Liter water)
              </label>
              <input
                type="number"
                step="0.5"
                value={dosageRate}
                onChange={(e) => setDosageRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div className="p-4 bg-forest-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-forest-200 uppercase tracking-wider block font-semibold">
                  Required Tank Mix Amount:
                </span>
                <span className="text-3xl font-black text-leaf">{computedDose} grams / ml</span>
              </div>
              <span className="text-xs bg-forest-800 text-forest-100 px-3 py-1.5 rounded-xl border border-forest-700">
                For {tankSize}L Sprayer
              </span>
            </div>
          </div>
        </div>

        {/* Safety & PPE Requirements */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Farmer Safety & Harvest Intervals
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block">Pre-Harvest Interval (PHI): 7 Days</span>
              <p className="text-amber-800 text-[11px]">
                Do not harvest or sell tomatoes within 7 days of Mancozeb application to ensure zero chemical residue for consumers.
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
              Verified Agri-Input Dealers in Mandya
            </h3>
            <p className="text-xs text-slate-500">Stock authorized genuine pesticides and subsidized bio-fertilizers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NEARBY_AGRI_SHOPS.map((shop) => (
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
