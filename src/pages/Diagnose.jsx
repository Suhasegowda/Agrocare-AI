import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Leaf, 
  ChevronRight, 
  HelpCircle,
  Scan,
  RefreshCw,
  Info
} from 'lucide-react';
import { CROPS_SUPPORTED, SAMPLE_DISEASE_PRESETS } from '../data/mockData';

export default function Diagnose({ onAnalyzeComplete }) {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [plantStage, setPlantStage] = useState('Fruiting');
  const [imagePreview, setImagePreview] = useState(SAMPLE_DISEASE_PRESETS[0].imageUrl);
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_DISEASE_PRESETS[0]);
  const [symptoms, setSymptoms] = useState({
    concentricRings: true,
    waterSoaked: false,
    yellowHalo: true,
    leafCurl: false
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');

  const navigate = useNavigate();

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setSelectedCrop(preset.cropId);
    setImagePreview(preset.imageUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleStartAnalysis = () => {
    setIsScanning(true);
    setScanStep('Preprocessing leaf image tensor (224x224 RGB)...');

    setTimeout(() => {
      setScanStep('Deep neural feature extraction across ResNet-50 layers...');
    }, 800);

    setTimeout(() => {
      setScanStep('Generating Grad-CAM localization gradient heatmaps...');
    }, 1600);

    setTimeout(() => {
      setScanStep('Synthesizing pathogen classification & treatment protocol...');
    }, 2400);

    setTimeout(() => {
      setIsScanning(false);
      if (onAnalyzeComplete) {
        onAnalyzeComplete(selectedPreset);
      }
      navigate('/diagnosis-result', { state: { result: selectedPreset } });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Vision Diagnostic Studio</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            New Leaf Disease Diagnosis
          </h1>
          <p className="text-xs text-slate-500">
            Upload or capture a sharp photo of the affected leaf for instant computer vision analysis
          </p>
        </div>

        {/* Evaluation 1-Click Presets */}
        <div className="bg-mint p-2 rounded-2xl border border-forest-200">
          <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider px-2 block mb-1">
            Demo Leaf Samples:
          </span>
          <div className="flex gap-1.5">
            {SAMPLE_DISEASE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                type="button"
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPreset.id === p.id 
                    ? 'bg-forest-800 text-white shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-forest-50'
                }`}
              >
                {p.crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Leaf Photo Upload
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Quality Ready
              </span>
            </div>

            {/* Upload Zone / Preview */}
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 hover:border-forest-500 transition-colors bg-slate-50 overflow-hidden group min-h-[280px] flex items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full h-[280px]">
                  <img
                    src={imagePreview}
                    alt="Leaf specimen"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer bg-white text-slate-800 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md hover:bg-slate-100">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-leaf" /> Specimen: {selectedPreset.crop} Leaf
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-mint text-forest-700 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Drag leaf image here, or browse</p>
                    <p className="text-[11px] text-slate-400">JPG, PNG, WebP up to 15MB</p>
                  </div>
                  <label className="inline-flex cursor-pointer bg-forest-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-forest-900">
                    Select From Device
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Quality Checklist indicator */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-leaf mx-auto mb-0.5" />
                <span>Sharp Focus</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-leaf mx-auto mb-0.5" />
                <span>Good Sunlight</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-leaf mx-auto mb-0.5" />
                <span>Single Leaf</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Crop metadata & Symptom Checklist */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Crop Details & Field Observations
            </h3>

            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Crop / ಬೆಳೆ ಆಯ್ಕೆ</label>
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  const match = SAMPLE_DISEASE_PRESETS.find(p => p.cropId === e.target.value);
                  if (match) setSelectedPreset(match);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
              >
                {CROPS_SUPPORTED.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.icon} {crop.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Growth Stage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Growth Stage</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['Seedling', 'Vegetative', 'Flowering', 'Fruiting'].map((stage) => (
                  <button
                    type="button"
                    key={stage}
                    onClick={() => setPlantStage(stage)}
                    className={`py-2 rounded-xl border text-[11px] font-bold transition-all ${
                      plantStage === stage
                        ? 'border-forest-600 bg-mint text-forest-900 ring-1 ring-forest-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Observation checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Visible Symptoms Observed on Field
              </label>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={symptoms.concentricRings}
                    onChange={(e) => setSymptoms({ ...symptoms, concentricRings: e.target.checked })}
                    className="rounded text-forest-700 focus:ring-forest-500"
                  />
                  <span>Target-like concentric brown spots on older foliage</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={symptoms.yellowHalo}
                    onChange={(e) => setSymptoms({ ...symptoms, yellowHalo: e.target.checked })}
                    className="rounded text-forest-700 focus:ring-forest-500"
                  />
                  <span>Chlorotic yellow halo surrounding necrotic margins</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={symptoms.waterSoaked}
                    onChange={(e) => setSymptoms({ ...symptoms, waterSoaked: e.target.checked })}
                    className="rounded text-forest-700 focus:ring-forest-500"
                  />
                  <span>Water-soaked spots with white fungal down on underside</span>
                </label>
              </div>
            </div>

            {/* Analyze CTA */}
            <button
              type="button"
              onClick={handleStartAnalysis}
              className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-forest-900/20 hover:scale-[1.01] transition-all"
            >
              <Sparkles className="w-4 h-4 text-leaf" />
              Analyze Leaf With AgroCare AI
            </button>
          </div>
        </div>
      </div>

      {/* Laser Scanning Modal / HUD */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white max-w-md w-full p-8 rounded-3xl border border-slate-700 shadow-2xl text-center space-y-6">
            <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-leaf shadow-lg shadow-leaf/20">
              <img
                src={imagePreview}
                alt="Scanning"
                className="w-full h-full object-cover"
              />
              {/* Laser animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-leaf to-transparent animate-bounce shadow-md shadow-leaf"></div>
              <div className="absolute inset-0 bg-forest-950/20 pointer-events-none"></div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 text-leaf animate-spin" />
                AI Inference Running
              </h3>
              <p className="text-xs font-mono text-emerald-400 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                {scanStep}
              </p>
            </div>

            <p className="text-[11px] text-slate-400">
              Evaluating lesion boundaries, RGB spectral indices & pathogen likelihood...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
