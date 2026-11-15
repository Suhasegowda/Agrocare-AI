import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  Bot, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  PhoneCall, 
  Leaf, 
  HelpCircle,
  Eye,
  Sliders,
  Store
} from 'lucide-react';
import { CROPS_SUPPORTED, SAMPLE_DISEASE_PRESETS } from '../data/mockData';

export default function Home({ currentLang }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How does AgroCare AI diagnose crop leaf diseases?",
      a: "AgroCare AI uses Convolutional Deep Neural Networks trained on over 80,000 multi-spectral crop leaf images. It identifies micro-lesions, chlorotic rings, fungal sporulation, and bacterial water-soaking within seconds, verified with Grad-CAM heatmaps showing exactly where the AI looked."
    },
    {
      q: "What makes AgroCare AI different from standard image identifier apps?",
      a: "Standard apps only give you a one-time disease name and stop there. AgroCare AI creates a trackable Digital Case ID, designs a multi-stage recovery protocol (cultural + bio + chemical), guides spray dosage per sprayer tank, and monitors your leaf healing over 14 days with before-and-after image comparisons."
    },
    {
      q: "Is AgroCare AI free for smallholder farmers?",
      a: "Yes! All leaf diagnosis, spray dosage calculators, recovery monitoring, and AI plant doctor consultations are free for farmers. Our goal is to protect crop yields and prevent pesticide overuse across India."
    },
    {
      q: "Can I use AgroCare AI in Kannada or other regional languages?",
      a: "Yes! AgroCare AI supports both English and Kannada (ಕನ್ನಡ), with voice advisory playback options for easy accessibility in field conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-mint via-white to-slate-50">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-forest-100/60 to-leaf/20 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/90 border border-forest-200 text-forest-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-forest-600 animate-pulse" />
              <span>Next-Gen Agricultural Computer Vision &bull; 98.4% Accuracy</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              AI Crop Doctor & Smart <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-forest-800 via-forest-700 to-leaf bg-clip-text text-transparent">
                Recovery Partner
              </span> for Farmers
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Don't just detect plant disease—cure it. Diagnose leaf infections instantly with explainable Grad-CAM AI, receive CIB&RC approved treatment plans, and track plant recovery step-by-step.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                to="/diagnose"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-forest-800 hover:bg-forest-900 text-white px-7 py-3.5 rounded-xl text-base font-bold shadow-lg shadow-forest-900/20 hover:scale-[1.02] transition-all"
              >
                <ScanLine className="w-5 h-5" />
                Diagnose a Leaf Now (Free)
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl text-base font-semibold shadow-xs hover:border-forest-600 transition-all"
              >
                <Activity className="w-5 h-5 text-forest-700" />
                Explore Demo Dashboard
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-leaf" /> 30+ Field Crops Supported
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-leaf" /> Explainable Grad-CAM Visuals
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-leaf" /> Zero Cost &bull; Instant Results
              </span>
            </div>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-2 font-mono text-slate-400">Live AI Diagnostic Pipeline &bull; Case AGC-2026-8841</span>
              </div>
              <span className="bg-forest-900 text-leaf px-2.5 py-0.5 rounded text-[11px] font-bold">
                96.8% Confidence
              </span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Step 1 Thumbnail */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">1. Leaf Image Input</div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video md:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=400&q=80"
                    alt="Tomato Leaf Early Blight"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                    Tomato Leaf
                  </span>
                </div>
              </div>

              {/* Step 2 AI Analysis */}
              <div className="space-y-3 bg-mint/50 p-4 rounded-2xl border border-forest-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 2. AI Grad-CAM Detection
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Tomato Early Blight</h4>
                  <p className="text-xs text-slate-500 italic">Alternaria solani (Fungus)</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Severity Index:</span>
                    <span className="font-bold text-amber-600">Moderate (38%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[38%] rounded-full"></div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  Target-board concentric rings identified in lower foliage. Immediate spray recommended.
                </p>
              </div>

              {/* Step 3 Active Recovery */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-forest-700" /> 3. 14-Day Recovery Track
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-forest-800 text-white font-black flex items-center justify-center text-lg shadow-sm">
                    84%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Day 7 of 14</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">Lesions Drying &bull; Healed</span>
                  </div>
                </div>
                <Link
                  to="/cases"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-white hover:bg-forest-50 text-forest-800 border border-forest-200 py-2 rounded-xl transition-colors"
                >
                  View Case Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Strip */}
      <section className="bg-forest-900 text-white py-8 border-y border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-leaf">98.4%</div>
            <div className="text-xs sm:text-sm text-forest-100 mt-1">Diagnostic Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">30+</div>
            <div className="text-xs sm:text-sm text-forest-100 mt-1">Field Crops Covered</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-leaf">&lt; 10s</div>
            <div className="text-xs sm:text-sm text-forest-100 mt-1">Instant Turnaround</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">100%</div>
            <div className="text-xs sm:text-sm text-forest-100 mt-1">Free for Farmers</div>
          </div>
        </div>
      </section>

      {/* 3. The Complete 4-Step User Journey */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">The AgroCare Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              From Diagnosis to Complete Field Recovery
            </h2>
            <p className="text-sm text-slate-600">
              Unlike ordinary crop scanners that leave you hanging, AgroCare AI partners with you through every stage of plant rehabilitation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group hover:border-forest-400 transition-all">
              <span className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">1</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Snap & Upload</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a close-up photo of the affected leaf using your mobile camera or upload from gallery with real-time quality validation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group hover:border-forest-400 transition-all">
              <span className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">2</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Explainable AI Scan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our vision model detects the pathogen, estimates severity % and highlights affected spots via Grad-CAM attention heatmaps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group hover:border-forest-400 transition-all">
              <span className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">3</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Custom Treatment Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get tiered management: cultural sanitation, organic bio-agents, and approved chemicals with exact dosage per 15L sprayer tank.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group hover:border-forest-400 transition-all">
              <span className="w-8 h-8 rounded-full bg-leaf text-forest-950 font-bold flex items-center justify-center text-sm mb-4">4</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Track & Close Case</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload Day 7 & Day 14 follow-ups. Track healing graphs, consult the AI Doctor anytime, and celebrate full crop recovery!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Supported Crops Spotlight */}
      <section id="diseases" className="py-16 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Crop Health Library</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Major Indian Crops We Protect
              </h2>
            </div>
            <Link to="/diagnose" className="text-sm font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1">
              Test with sample diagnoses <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CROPS_SUPPORTED.map((crop) => (
              <div key={crop.id} className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-md hover:border-forest-300 transition-all">
                <span className="text-3xl block mb-2">{crop.icon}</span>
                <h3 className="font-bold text-sm text-slate-900">{crop.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{crop.family}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {crop.commonDiseases.slice(0, 2).map((d, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Farmer Questions</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:text-forest-800"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 text-leaf">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Protect Your Field Today With AgroCare AI
          </h2>
          <p className="text-sm sm:text-base text-forest-100 max-w-xl mx-auto">
            Take a quick photo of any sickly leaf now to verify infection risk before symptoms destroy harvest value.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/diagnose"
              className="bg-leaf hover:bg-green-500 text-forest-950 px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:scale-105 transition-all"
            >
              Start Free Diagnosis
            </Link>
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 rounded-xl font-semibold text-base border border-white/20 transition-all"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
