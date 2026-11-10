import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  MapPin, 
  Globe, 
  Volume2, 
  ShieldCheck, 
  Save, 
  Download,
  CheckCircle2,
  Bell
} from 'lucide-react';

export default function Settings({ currentLang, setCurrentLang, userRole, setUserRole }) {
  const [name, setName] = useState('Ramesh Gowda');
  const [mobile, setMobile] = useState('+91 98451 22390');
  const [village, setVillage] = useState('Shivalli, Mandya Taluk');
  const [state, setState] = useState('Karnataka');
  const [acreage, setAcreage] = useState('3.5');
  const [soilType, setSoilType] = useState('Red Sandy Loam');
  const [irrigation, setIrrigation] = useState('Drip Irrigation');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      farmer: name,
      mobile: mobile,
      farm: { village, state, acreage, soilType, irrigation },
      exportDate: new Date().toISOString()
    }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `AgroCare_Profile_${name.replace(/\s+/g, '_')}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Account & Farm Profile</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-xs text-slate-500">
          Manage your agricultural details, language selection, notifications, and data security
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-mint rounded-2xl border border-forest-200 text-forest-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-forest-700" />
          Settings and farm profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Farm Identity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-forest-700" />
            Farmer Identity & Landholding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Village & Taluk</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Acreage (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={acreage}
                onChange={(e) => setAcreage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
              >
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Black Cotton Clay">Black Cotton Clay</option>
                <option value="Alluvial Silt">Alluvial Silt</option>
                <option value="Laterite">Laterite</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Irrigation Method</label>
              <select
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
              >
                <option value="Drip Irrigation">Drip Irrigation (Micro)</option>
                <option value="Sprinkler">Sprinkler System</option>
                <option value="Canal / Flood">Canal / Surface Flood</option>
                <option value="Rainfed">Purely Rainfed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language & Regional Localization */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-forest-700" />
            Language & Speech Interface
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Interface Language</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentLang('en')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                    currentLang === 'en' ? 'bg-forest-800 text-white border-forest-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLang('kn')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                    currentLang === 'kn' ? 'bg-forest-800 text-white border-forest-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  ಕನ್ನಡ (Kannada)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Active User Role</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUserRole('farmer')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                    userRole === 'farmer' ? 'bg-forest-800 text-white border-forest-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('expert')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                    userRole === 'expert' ? 'bg-forest-800 text-white border-forest-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  🔬 Agronomist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Export & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" /> Export Farm Diagnosis Data (JSON)
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 text-white px-7 py-3 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
