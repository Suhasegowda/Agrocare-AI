import React, { useEffect, useState } from 'react';
import { CloudSun, Wind, Droplets, CheckCircle2 } from 'lucide-react';
import { api } from '../../api';

export default function WeatherWidget({ compact = false, location = '' }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    api(`/weather${query}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [location]);

  if (error) {
    return <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">Weather is unavailable. No forecast is shown in its place.</div>;
  }
  if (!data) {
    return <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-500">Loading weather for {location || 'the default station'}...</div>;
  }
  if (compact) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">{data.temp}°C</span>
              <span className="text-xs text-slate-500">{data.location}</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {data.sprayWindowStatus}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Humidity: <span className="font-semibold text-slate-700">{data.humidity}%</span></div>
          <div>Wind: <span className="font-semibold text-slate-700">{data.windSpeed}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-mint/40 rounded-2xl p-5 border border-forest-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            Micro-Climate & Spray Advisory
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
            {data.location}
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-800 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
          {data.sprayWindowStatus}
        </span>
      </div>

      {/* Temp and key metrics */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Temperature</span>
          <span className="text-2xl font-extrabold text-slate-900">{data.temp}°C</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{data.condition}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500" /> Humidity
          </span>
          <span className="text-2xl font-extrabold text-slate-900">{data.humidity}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Relative humidity</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Wind className="w-3 h-3 text-teal-500" /> Wind
          </span>
          <span className="text-base font-extrabold text-slate-900 mt-1">{data.windSpeed}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{data.windSpeed}</span>
        </div>
      </div>

      {/* Agronomist Spray Advisory */}
      <div className="bg-white p-3.5 rounded-xl border border-forest-200/80 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-forest-800 font-bold">
          <CheckCircle2 className="w-4 h-4 text-forest-600" />
          Spray Suitability Recommendation
        </div>
        <p className="text-slate-600 leading-relaxed">
          {data.sprayWindowAdvice}
        </p>
      </div>

      {/* 4-Day Forecast Ticker */}
      <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100">
        {data.forecast.map((item, idx) => (
          <div key={idx} className="text-center p-2 rounded-lg hover:bg-white/80 transition-colors">
            <span className="text-[11px] font-semibold text-slate-500 block">{item.day}</span>
            <span className="text-lg my-0.5 block">{item.icon}</span>
            <span className="text-xs font-bold text-slate-800 block">{item.temp}</span>
            <span className={`text-[10px] font-semibold block mt-0.5 ${
              item.risk === 'High' ? 'text-rose-600' : item.risk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {item.risk} Risk
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
