import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../data/translations';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  X,
  Lock,
  Thermometer,
  RefreshCw,
  Minimize2,
  Maximize2,
  Sliders,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { switchTenantBrand } from '../multiTenantConfig';
import { queryNellyBackend, NellyCitation, NellyCcpStatus } from '../services/nellyClient';

interface NellyMessage {
  sender: 'nelly' | 'user';
  text: string;
  time: string;
  citation?: NellyCitation | null;
  ccpStatus?: NellyCcpStatus | null;
}

interface NellyAIAgentWindowProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onTriggerBrandSwitch?: (brandId: string) => void;
  onOpenGearModal?: () => void;
}

export const NellyAIAgentWindow: React.FC<NellyAIAgentWindowProps> = ({
  isOpen,
  onClose,
  onOpenGearModal,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [ccpInputCelsius, setCcpInputCelsius] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const initialGreeting =
    'Hello! I am Nelly, your OHS & retail compliance guide. Ask me about forecourt safety, PPE, ESD evacuation, fuel spills, tanker offloading, employee rights, or R638 food temperature rules. Every answer cites its South African regulatory clause.';

  const [chatMessages, setChatMessages] = useState<NellyMessage[]>([
    {
      sender: 'nelly',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (avail && avail.length > 0) setVoices(avail);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakText = (text: string, langCode: string = 'en-ZA') => {
    if (!isVoiceActive || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    setTimeout(() => {
      try {
        if (!('speechSynthesis' in window)) return;
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        activeUtteranceRef.current = utterance;

        const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
        const matchedVoice =
          currentVoices.find((v) => v.lang.toLowerCase().startsWith('en-za')) ||
          currentVoices.find((v) => v.name.toLowerCase().includes('female')) ||
          currentVoices.find((v) => v.lang.startsWith(langCode.slice(0, 2).toLowerCase())) ||
          currentVoices[0];

        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = 'en-ZA';
        }

        utterance.rate = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    }, 60);
  };

  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const toggleVoice = () => {
    if (isVoiceActive) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
    }
  };

  const submitQueryToBackend = async (queryText: string, explicitCcp?: number | null) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const displayUserMsg =
      typeof explicitCcp === 'number' && !Number.isNaN(explicitCcp)
        ? `${trimmed} (Entered Probe Reading: ${explicitCcp}°C)`
        : trimmed;

    setChatMessages((prev) => [...prev, { sender: 'user', text: displayUserMsg, time: now }]);
    setIsLoading(true);

    try {
      const response = await queryNellyBackend(trimmed, explicitCcp);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'nelly',
          text: response.reply,
          time: replyTime,
          citation: response.citation,
          ccpStatus: response.ccpStatus,
        },
      ]);
      speakText(response.reply);
    } catch {
      const errText = "I don't have an approved source for this. Please check with your OHS officer";
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'nelly',
          text: errText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citation: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const queryText = inputQuery.trim();
    const parsedTemp =
      ccpInputCelsius.trim() !== '' ? parseFloat(ccpInputCelsius.trim()) : null;
    setInputQuery('');
    await submitQueryToBackend(
      queryText,
      parsedTemp !== null && !Number.isNaN(parsedTemp) ? parsedTemp : null
    );
  };

  const handleCcpQuickQuery = async () => {
    const parsedTemp =
      ccpInputCelsius.trim() !== '' ? parseFloat(ccpInputCelsius.trim()) : null;
    const validTemp = parsedTemp !== null && !Number.isNaN(parsedTemp) ? parsedTemp : null;
    await submitQueryToBackend(
      'What are the R638 food temperature CCP requirements for poultry and hot food?',
      validTemp
    );
  };

  if (!isOpen) return null;

  return (
    <div
      data-testid="nelly-ai-window"
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 right-6 w-72 bg-slate-900 border-2 border-purple-500/60 rounded-2xl shadow-2xl p-3'
          : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[94vw] max-w-md h-[600px] max-h-[86vh] bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col font-sans'
      }`}
    >
      {/* Window Header */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-purple-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-300" />
              </div>
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-white leading-none">Nelly OHS Guide</h3>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-bold border border-purple-500/30">
                Source-Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 font-mono">T=0.0 Retrieval Mode</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleVoice}
            aria-label={isVoiceActive ? 'Mute Nelly Voice' : 'Enable Nelly Voice'}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isVoiceActive
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}
            title={isVoiceActive ? 'Voice is ON (Click to Mute)' : 'Voice is MUTED (Click to Enable)'}
          >
            {isVoiceActive ? (
              <Volume2 className="w-4 h-4 text-purple-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Maximize Nelly Window' : 'Minimize Nelly Window'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            aria-label="Close Nelly Window"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Guidance Disclaimer & South African Frameworks Banner */}
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-bold border border-cyan-500/40">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Low-Temperature Retrieval (T=0.0)</span>
              </div>
              <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Guidance only, not legal advice
              </span>
            </div>

            <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-300">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                OHSA 85-1993
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                SANS 10089-3
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                R638 (2018)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                GSR / GMR
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300">
                BCEA / COIDA
              </span>
            </div>
          </div>

          {/* Optional CCP Probe Reading Entry & Quick Topic Chips */}
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <label htmlFor="nelly-ccp-input" className="text-[11px] font-bold text-slate-200 whitespace-nowrap">
                CCP Reading (°C):
              </label>
              <input
                id="nelly-ccp-input"
                data-testid="nelly-ccp-input"
                type="number"
                step="0.1"
                value={ccpInputCelsius}
                onChange={(e) => setCcpInputCelsius(e.target.value)}
                placeholder="Optional e.g. 75.0"
                className="w-28 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={handleCcpQuickQuery}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] font-bold border border-slate-700 transition whitespace-nowrap"
              >
                Check R638 Temp
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => submitQueryToBackend('What PPE is required for forecourt attendants?')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] font-bold border border-slate-800 whitespace-nowrap transition"
              >
                PPE Requirements
              </button>
              <button
                type="button"
                onClick={() => submitQueryToBackend('What is the ESD emergency evacuation procedure?')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-300 text-[11px] font-bold border border-slate-800 whitespace-nowrap transition"
              >
                ESD Evacuation
              </button>
              <button
                type="button"
                onClick={() => onOpenGearModal?.()}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-purple-300 text-[11px] font-bold border border-slate-800 whitespace-nowrap transition flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" /> GEAR Meters
              </button>
              <button
                type="button"
                onClick={() => switchTenantBrand('bravo')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 whitespace-nowrap transition flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Switch Site
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3" data-testid="nelly-messages-list">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'nelly' && (
                  <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-purple-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="leading-relaxed font-semibold" data-testid={`nelly-msg-text-${index}`}>
                    {msg.text}
                  </p>

                  {/* Cited Clause Callout */}
                  {msg.sender === 'nelly' && msg.citation && (
                    <div
                      data-testid="nelly-citation-box"
                      className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-[11px] text-cyan-200 space-y-1"
                    >
                      <div className="font-bold text-cyan-300">
                        Cited Clause: {msg.citation.clause}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-300">
                        <span>Verified: {msg.citation.lastVerified}</span>
                        <a
                          href={msg.citation.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-300 hover:underline inline-flex items-center gap-0.5"
                        >
                          Official Source <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* CCP Evaluation Badge ONLY when a real reading was entered */}
                  {msg.sender === 'nelly' && msg.ccpStatus && (
                    <div
                      data-testid="nelly-ccp-status-badge"
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        msg.ccpStatus.compliant
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/60 border-red-500/40 text-red-300'
                      }`}
                    >
                      Entered Probe Reading: {msg.ccpStatus.readingCelsius}°C (Threshold: ≥{' '}
                      {msg.ccpStatus.thresholdCelsius}°C) —{' '}
                      {msg.ccpStatus.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                    {msg.sender === 'nelly' ? (
                      <button
                        type="button"
                        onClick={() => speakText(msg.text)}
                        aria-label="Speak this response"
                        className="inline-flex items-center gap-1 text-[10px] text-purple-300 hover:text-purple-200 font-bold px-1.5 py-0.5 rounded hover:bg-purple-900/40 transition"
                      >
                        <Volume2 className="w-3 h-3 text-purple-300" />
                        <span>Speak</span>
                      </button>
                    ) : (
                      <span />
                    )}

                    <span
                      className={`text-[10px] font-mono ${
                        msg.sender === 'user' ? 'text-purple-200' : 'text-slate-300'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-xs text-purple-300 font-mono px-2">
                Retrieving approved South African statutory clause...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 rounded-b-3xl"
          >
            <input
              type="text"
              data-testid="nelly-query-input"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Nelly about PPE, R638 food temp, ESD, spills..."
              aria-label="Ask Nelly OHS Guide"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              data-testid="nelly-send-btn"
              aria-label="Send question to Nelly"
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
