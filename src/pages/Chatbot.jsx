import React, { useEffect, useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  FileText, 
  ExternalLink, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { api } from '../api';

export default function Chatbot({ activeCase, cases = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');

  const quickPrompts = [
    'What cultural steps are recorded for this crop?',
    'How do I improve airflow in the canopy?',
    'Can a follow-up photo close this case?'
  ];

  useEffect(() => {
    if (!activeCase) {
      setMessages([]);
      return;
    }
    api(`/cases/${activeCase.id}/chat/messages`)
      .then((rows) => setMessages(rows))
      .catch((err) => setError(err.message));
  }, [activeCase]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || !activeCase) return;
    setInput('');
    setIsTyping(true);
    setError('');
    try {
      const reply = await api(`/cases/${activeCase.id}/chat/messages`, {
        method: 'POST',
        body: { text: query },
      });
      setMessages((prev) => [...prev, reply.farmer, reply.ai]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activeCase) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
        <h1 className="text-xl font-extrabold text-slate-900">No case is open</h1>
        <p className="text-sm text-slate-500">Save a diagnosis first. The plant doctor answers from that case and does not invent a spray rate.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Active Case Context Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-leaf flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">AI Plant Doctor Advisory</span>
              <span className="font-mono text-xs font-bold text-forest-800 bg-mint px-2 py-0.5 rounded border border-forest-100">
                {activeCase.id}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Crop: <strong className="text-slate-800">{activeCase.crop}</strong> &bull; Condition: <strong className="text-slate-800">{activeCase.disease || 'Not confirmed'}</strong>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-forest-700" />
          <span>Grounded in ICAR & CIB&RC Pathological Data</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Chat History Sidebar (3 cols) */}
        <div className="hidden md:block md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Consultation History
          </h3>
          <div className="space-y-2">
            {cases.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  c.id === activeCase.id 
                    ? 'border-forest-600 bg-mint text-forest-900 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                }`}
              >
                <div className="flex justify-between font-bold mb-0.5">
                  <span className="font-mono">{c.id}</span>
                  <span className="text-[10px] text-slate-500">{c.dateCreated}</span>
                </div>
                <p className="font-semibold text-slate-900 truncate">{c.crop} &bull; {c.disease}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-white text-forest-800 font-bold border border-forest-200">
                  {c.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            💡 <strong>Doctor Tip:</strong> You can ask the AI about rain delay, organic bio-alternatives, tank mixing safety, or seed treatment for next season.
          </div>
        </div>

        {/* Chat Stream (8 cols) */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[540px]">
          {/* Messages scroll box */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <p className="text-xs text-slate-500">Ask a question about this case. Dosage requests are refused unless a stored label reference applies, and even then you must verify the current label.</p>
            )}
            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${m.sender === 'farmer' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'farmer'
                        ? 'bg-forest-800 text-white rounded-tr-none'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Citations for AI messages */}
                  {m.citations && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {m.citations.map((c, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-leaf" /> Source: {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block px-1">
                    {m.time}
                  </span>
                </div>

                {m.sender === 'farmer' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-500 font-medium">
                <div className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="animate-pulse">Plant Doctor is typing recommendations...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-5 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex gap-2 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[11px] font-semibold bg-white hover:bg-forest-50 text-forest-800 px-3 py-1.5 rounded-full border border-forest-200 transition-colors shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 flex items-center gap-2 bg-white rounded-b-3xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about field sanitation or the written advisory..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
