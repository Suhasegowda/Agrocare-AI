import React, { useState } from 'react';
import { 
  Bell, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  Check,
  Settings2
} from 'lucide-react';
import { NOTIFICATIONS_LIST } from '../data/mockData';

export default function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST);
  const [filter, setFilter] = useState('all'); // all | follow-up | weather-alert | expert-review
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsAppAlerts, setWhatsAppAlerts] = useState(true);

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Follow-up Alerts & Schedule</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Follow-up Calendar
          </h1>
          <p className="text-xs text-slate-500">
            Never miss a crucial fungicide spray window, checkup photo upload, or weather warning
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs shadow-2xs transition-colors"
        >
          <Check className="w-3.5 h-3.5 text-forest-700" />
          Mark All as Read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Notifications Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'all' ? 'bg-white text-forest-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('follow-up')}
              className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'follow-up' ? 'bg-white text-forest-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Checkup Reminders
            </button>
            <button
              onClick={() => setFilter('weather-alert')}
              className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'weather-alert' ? 'bg-white text-forest-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Micro-Climate Alerts
            </button>
            <button
              onClick={() => setFilter('expert-review')}
              className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'expert-review' ? 'bg-white text-forest-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Agronomist Verifications
            </button>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredNotifs.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                  item.unread
                    ? 'bg-white border-forest-200 shadow-sm ring-1 ring-forest-100'
                    : 'bg-white/70 border-slate-200 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.type === 'follow-up'
                      ? 'bg-mint text-forest-800'
                      : item.type === 'weather-alert'
                      ? 'bg-amber-50 text-amber-600'
                      : item.type === 'expert-review'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {item.type === 'follow-up' ? <Clock className="w-4 h-4" /> :
                     item.type === 'weather-alert' ? <AlertTriangle className="w-4 h-4" /> :
                     item.type === 'expert-review' ? <ShieldCheck className="w-4 h-4" /> :
                     <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-forest-700 inline-block"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">{item.time}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-forest-50 text-forest-800 font-bold text-xs border border-slate-200 hover:border-forest-200 whitespace-nowrap transition-colors"
                >
                  {item.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Follow-up Calendar & SMS Toggles (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Interactive Mini Calendar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-forest-700" />
                November 2026 Schedule
              </h3>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</span>
              ))}
              {/* Day numbers */}
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const isToday = day === 31;
                const hasFollowUp = day === 1 || day === 3 || day === 7;
                return (
                  <div
                    key={day}
                    className={`py-1.5 rounded-xl text-[11px] font-semibold relative transition-all ${
                      hasFollowUp
                        ? 'bg-forest-800 text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-mint text-forest-900 border border-forest-300 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                    {hasFollowUp && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-leaf"></span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-800"></span>
                <span>Nov 01: Potato Late Blight Follow-up</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-800"></span>
                <span>Nov 03: Tomato Early Blight Clearance</span>
              </div>
            </div>
          </div>

          {/* Delivery Preferences */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-forest-700" />
              Delivery Channels
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Kisan SMS Alerts</span>
                  <span className="text-[10px] text-slate-400">Receive spray window notifications on mobile</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-forest-700 focus:ring-forest-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">WhatsApp Updates</span>
                  <span className="text-[10px] text-slate-400">Receive diagnosis PDFs & Doctor replies</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsAppAlerts}
                  onChange={(e) => setWhatsAppAlerts(e.target.checked)}
                  className="rounded text-forest-700 focus:ring-forest-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
