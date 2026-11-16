import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../data/translations';
import { 
  Bot, 
  X, 
  Volume2, 
  VolumeX, 
  Lock, 
  ShieldCheck, 
  Send, 
  Thermometer, 
  Maximize2, 
  Minimize2,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { switchTenantBrand } from '../multiTenantConfig';

interface NellyAIAgentWindowProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onTriggerBrandSwitch?: (brand: 'standard' | 'express' | 'highway' | 'urban') => void;
  onOpenGearModal?: () => void;
}

export const NellyAIAgentWindow: React.FC<NellyAIAgentWindowProps> = ({
  isOpen,
  onClose,
  lang,
  onTriggerBrandSwitch,
  onOpenGearModal
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [ccpThermalTemp] = useState<number>(73.9);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const initialGreeting = "Hello! I am Nelly, your AI guide for forecourt & retail statutory compliance. I give AI-drafted guidance with citations to OHS Act 85 of 1993, SANS 10089, R638, ISO 22000, and FDA standards. Verify every citation against the primary legislation, and have a competent person review anything you act on. How can I assist your site today?";

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'nelly' | 'user'; text: string; time: string }>>([
    {
      sender: 'nelly',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Load and cache browser voices (handles async loading in Chrome/Edge/Safari)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (avail && avail.length > 0) {
        setVoices(avail);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speakText = (text: string, langCode: string = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return;
    }

    // 1. Cancel previous speech
    window.speechSynthesis.cancel();

    // 2. Chromium requires a slight delay after cancel to prevent cancelling the next utterance
    setTimeout(() => {
      try {
        if (!('speechSynthesis' in window)) return;

        // Unpause stuck queue if paused
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        activeUtteranceRef.current = utterance; // Keep reference to prevent GC in Chromium

        const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
        
        // Priority to natural English female voices
        const matchedVoice = currentVoices.find(v => v.name.toLowerCase().includes('rachel'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('natural') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('aria')))
                          || currentVoices.find(v => v.name.toLowerCase().includes('zira'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('aria'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('jenny'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('samantha'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('victoria'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('karen'))
                          || currentVoices.find(v => v.name.toLowerCase().includes('female'))
                          || currentVoices.find(v => v.lang.startsWith(langCode.toLowerCase()))
                          || currentVoices.find(v => v.lang.startsWith('en'))
                          || currentVoices[0];

        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = 'en-US';
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.15; // Natural female voice timbre

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
        };
        utterance.onerror = (e) => {
          console.warn('Nelly speech synthesis event:', e);
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Nelly speech synthesis error:', err);
        setIsSpeaking(false);
      }
    }, 60);
  };

  // Auto-speak welcome greeting when Nelly window is opened
  useEffect(() => {
    if (isOpen && isVoiceActive) {
      const timer = setTimeout(() => {
        speakText(initialGreeting);
      }, 350);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const toggleVoice = () => {
    if (isVoiceActive) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      speakText("Nelly voice activated. Statutory determinism online.");
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = inputQuery.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setInputQuery('');

    setTimeout(() => {
      let replyText = "Under T=0.0 Statutory Determinism, every operational step is logged and mapped strictly to OHS Act 85 of 1993 and SANS 10089 standards.";

      const lower = userMsg.toLowerCase();
      if (lower.includes('ccp') || lower.includes('thermal') || lower.includes('temperature') || lower.includes('food')) {
        replyText = `CCP Thermal Probe verified: Internal poultry temperature threshold strictly locked at ${ccpThermalTemp}°C (Min 73.9°C required under FDA Food Code 2022 & R638). Critical Control Point is COMPLIANT.`;
      } else if (lower.includes('brand') || lower.includes('express') || lower.includes('standard') || lower.includes('highway') || lower.includes('urban')) {
        replyText = "Switching multi-tenant white-label brand configuration while maintaining client-side POPIA AES-256 data encryption.";
        if (lower.includes('express')) onTriggerBrandSwitch?.('express');
        else if (lower.includes('highway')) onTriggerBrandSwitch?.('highway');
        else if (lower.includes('urban')) onTriggerBrandSwitch?.('urban');
        else onTriggerBrandSwitch?.('standard');
      } else if (lower.includes('gear') || lower.includes('pillar') || lower.includes('calibrate')) {
        replyText = "Opening G.E.A.R. Pillar System Suite. Governance, Ergonomics, SLA Escalation, and Risk Reduction meters are ready for live threshold calibration.";
        onOpenGearModal?.();
      }

      setChatMessages(prev => [...prev, { sender: 'nelly', text: replyText, time: now }]);
      speakText(replyText);
    }, 600);
  };

  const runPresetAction = (actionType: 'ccp' | 'gear' | 'brand' | 'sla') => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (actionType === 'ccp') {
      const text = `Executing CCP Thermal Check: Food probe measures ${ccpThermalTemp}°C against mandatory 73.9°C poultry safety threshold. Status: PASSED (ISO 22000 & R638 Certified).`;
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: "Conduct CCP 73.9°C Thermal Probe Verification", time: now },
        { sender: 'nelly', text, time: now }
      ]);
      speakText(text);
    } else if (actionType === 'gear') {
      const text = "G.E.A.R. Pillar System Suite recalibration triggered. Adjusting live risk thresholds.";
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: "Recalibrate G.E.A.R. System Pillars", time: now },
        { sender: 'nelly', text, time: now }
      ]);
      speakText(text);
      if (onOpenGearModal) onOpenGearModal();
    } else if (actionType === 'brand') {
      const text = "Cycling multi-tenant white-label network to Retail Service Station Bravo (Site STN-BRAVO).";
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: "Test Multi-Tenant White-Labeling Network Engine", time: now },
        { sender: 'nelly', text, time: now }
      ]);
      speakText(text);
      switchTenantBrand('bravo');
    } else if (actionType === 'sla') {
      const text = "Audit Readiness SLA Matrix: 100% of high-severity hazard reports assigned mandatory supervisor owners with 4-hour escalation timers.";
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: "Check SLA Escalation Matrix & Action Plans", time: now },
        { sender: 'nelly', text, time: now }
      ]);
      speakText(text);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-72 bg-slate-900 border-2 border-purple-500/60 rounded-2xl shadow-2xl p-3'
        : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[94vw] max-w-md h-[560px] max-h-[85vh] bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col font-sans'
    }`}>
      
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
              <h3 className="text-sm font-black text-white leading-none">Nelly AI</h3>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-black uppercase border border-purple-500/30">
                👩‍💼 Female Avatar Guide
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">T=0.0 Statutory Determinism</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isVoiceActive ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-500'
            }`}
            title={isVoiceActive ? "Voice is ON (Click to Mute)" : "Voice is MUTED (Click to Enable)"}
          >
            {isVoiceActive ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Statutory Guardrails Indicator Banner */}
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/40">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Determinism Mode: T=0.0 (Locked)</span>
              </div>

              {/* Animated Audio Waveform */}
              <div className="flex items-center gap-0.5 h-4">
                {[40, 70, 30, 90, 50, 80, 40].map((h, i) => (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full bg-purple-400 transition-all duration-300 ${
                      isSpeaking ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{ height: isSpeaking ? `${h}%` : '4px' }}
                  />
                ))}
              </div>
            </div>

            {/* Active Compliance Framework Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[9px] font-mono text-slate-400 pb-0.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">OHS Act 85</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">R638</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">ISO 22000</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-400">FDA Food Code 2022</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-400">Nevada SNHD</span>
            </div>
          </div>

          {/* Preset Quick Actions */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => speakText(initialGreeting)}
              className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-[10px] font-black flex items-center gap-1 border border-purple-500/40 whitespace-nowrap transition shadow-sm"
              title="Play Nelly's Verbal Introduction"
            >
              <Volume2 className="w-3 h-3 text-purple-400" />
              <span>🔊 Speak Intro</span>
            </button>

            <button
              onClick={() => runPresetAction('ccp')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 border border-slate-800 whitespace-nowrap transition"
            >
              <Thermometer className="w-3 h-3 text-amber-400" />
              <span>CCP 73.9°C Check</span>
            </button>

            <button
              onClick={() => runPresetAction('gear')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[10px] font-extrabold flex items-center gap-1 border border-slate-800 whitespace-nowrap transition"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>GEAR Calibration</span>
            </button>

            <button
              onClick={() => runPresetAction('brand')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 text-[10px] font-extrabold flex items-center gap-1 border border-slate-800 whitespace-nowrap transition"
            >
              <RefreshCw className="w-3 h-3 text-purple-400" />
              <span>Switch Brand Theme</span>
            </button>

            <button
              onClick={() => runPresetAction('sla')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1 border border-slate-800 whitespace-nowrap transition"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>SLA Audit Matrix</span>
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
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

                <div className={`max-w-[82%] p-3 rounded-2xl text-xs space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}>
                  <p className="leading-relaxed font-semibold">{msg.text}</p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                    {msg.sender === 'nelly' ? (
                      <button
                        type="button"
                        onClick={() => speakText(msg.text)}
                        className="inline-flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 font-bold px-1.5 py-0.5 rounded hover:bg-purple-900/40 transition"
                        title="Play voice audio for this message"
                      >
                        <Volume2 className="w-3 h-3 text-purple-400" />
                        <span>Speak</span>
                      </button>
                    ) : <span />}

                    <span className={`text-[9px] font-mono ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-slate-500'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 rounded-b-3xl">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Nelly about OHS Act, R638, or GEAR thresholds..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition shadow-lg flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
