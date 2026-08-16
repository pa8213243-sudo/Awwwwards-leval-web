import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, User, Bot, Loader2, MessageSquare, ArrowRight, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { ParvejAvatar } from './ParvejAvatar';
import { setLenisScrollLocked } from '../lib/gsap';
import { getDeviceFingerprint, getDeviceInfo, DeviceInfo } from '../lib/deviceFingerprint';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

const MAX_SESSION_QUESTIONS = 5;
const STORAGE_KEY = 'parvej_ai_quota_v1';

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am AI Sara, Parwej's AI Strategy & Finance Assistant. Ask me anything about Parwej's CMA candidacy, 3-statement financial models, Power BI DAX telemetry, or Activity-Based Costing projects.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState(''); // Anti-bot trap field
  const [remainingQueries, setRemainingQueries] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        return isNaN(parsed) ? MAX_SESSION_QUESTIONS : Math.max(0, Math.min(MAX_SESSION_QUESTIONS, parsed));
      }
    } catch {
      // Ignore localStorage errors
    }
    return MAX_SESSION_QUESTIONS;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Tell me about Parwej's CMA candidacy & qualifications",
    "What financial valuation models has Parwej built?",
    "Explain Parwej's Power BI & DAX expertise",
    "How does Parwej approach Activity-Based Costing?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync real-time quota & inspect device hardware telemetry
  useEffect(() => {
    const info = getDeviceInfo();
    setDeviceInfo(info);

    fetch(`/api/ai/quota?deviceId=${encodeURIComponent(info.deviceId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.remainingQueries === 'number') {
          updateRemainingQueries(data.remainingQueries);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Lock background smooth scroll and freeze website when AI drawer is open
  useEffect(() => {
    if (isOpen) {
      setLenisScrollLocked(true);
    } else {
      setLenisScrollLocked(false);
    }

    return () => {
      setLenisScrollLocked(false);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Sync remaining queries to localStorage
  const updateRemainingQueries = (nextCount: number) => {
    const safeCount = Math.max(0, nextCount);
    setRemainingQueries(safeCount);
    try {
      localStorage.setItem(STORAGE_KEY, safeCount.toString());
    } catch {
      // Ignore
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isGenerating) return;

    // 1. Anti-Bot honeypot verification
    if (honeypotValue.trim() !== '') {
      console.warn('[Anti-Bot] Automated script detected via honeypot.');
      return;
    }

    // 2. Client-side Quota Check (Max 5 questions)
    if (remainingQueries <= 0) {
      const limitMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        text: "You have reached the maximum limit of 5 questions for this session to preserve AI resources. To discuss opportunities directly or schedule an executive interview, please contact Parwej at bhaiparwej70@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, limitMsg]);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsGenerating(true);

    try {
      let aiResponseText = '';
      let serverRemaining: number | undefined = undefined;
      const deviceId = getDeviceFingerprint();

      try {
        const response = await fetch('/api/ai/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            honeypot: honeypotValue,
            deviceId: deviceInfo?.deviceId || deviceId,
            deviceCode: deviceInfo?.deviceCode,
            deviceType: deviceInfo?.deviceType,
            os: deviceInfo?.os,
            browser: deviceInfo?.browser,
            history: messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            aiResponseText = data.reply;
          }
          if (typeof data.remainingQueries === 'number') {
            serverRemaining = data.remainingQueries;
          }
        } else if (response.status === 429) {
          const data = await response.json().catch(() => ({}));
          aiResponseText = data.reply || "You have reached the maximum session question limit. Contact Parwej at bhaiparwej70@gmail.com.";
          serverRemaining = 0;
        }
      } catch (fetchErr) {
        console.warn('Backend /api/ai/copilot fetch error, attempting direct SDK fallback:', fetchErr);
      }

      // Decrement queries remaining
      if (typeof serverRemaining === 'number') {
        updateRemainingQueries(serverRemaining);
      } else {
        updateRemainingQueries(remainingQueries - 1);
      }

      // If backend was not reached or returned empty, try direct client-side GoogleGenAI
      if (!aiResponseText) {
        const clientKey = (typeof process !== 'undefined' && (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)) || '';
        if (clientKey) {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: clientKey });
          const chat = ai.chats.create({
            model: 'gemini-flash-latest',
            config: {
              systemInstruction: `You are AI Sara, Parwej's AI Finance & Strategy Assistant on Parwej's personal portfolio website. Parwej is a Finance Specialist and CMA Aspirant. Keep responses strictly under 80 words in 2 crisp paragraphs. Email: bhaiparwej70@gmail.com`,
              temperature: 0.65,
            },
          });
          const result = await chat.sendMessage({ message: text });
          if (result && result.text) {
            aiResponseText = result.text;
          }
        }
      }

      const finalReply = aiResponseText || "Hello! I am AI Sara. Parwej is a Finance Specialist & CMA Candidate with expertise in 3-Statement Modeling, Power BI DAX, and Activity-Based Costing. Reach out directly at bhaiparwej70@gmail.com!";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: finalReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Sara error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Hello! I am AI Sara, Parwej's Finance & Strategy Assistant. Parwej is a Finance Specialist & CMA Candidate. Reach out directly at bhaiparwej70@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] overflow-hidden overscroll-none"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
          }
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm touch-none cursor-pointer"
        />

        {/* Right Drawer with isolated scrolling */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-lg bg-[#121214] border-l border-white/15 text-white flex flex-col justify-between shadow-2xl overscroll-contain touch-pan-y"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/60 select-none">
            <div className="flex items-center gap-3">
              <ParvejAvatar size="sm" showOnlinePing />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base sm:text-lg text-white font-semibold tracking-wide">PARVEJ AI SARA</h3>
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-xs">
                    <ShieldCheck className="w-3 h-3" /> BOT DEFENSE
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    GEMINI 3.7 FLASH
                  </p>
                  {deviceInfo && (
                    <span className="text-[9px] font-mono text-gray-400 px-1 py-0.2 bg-white/5 border border-white/10 rounded-2xs">
                      {deviceInfo.deviceCode} // {deviceInfo.deviceType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* QUOTA BADGE (5 Questions Max Limit) */}
              <div 
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-xs border ${
                  remainingQueries > 2
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                    : remainingQueries > 0
                    ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                    : 'bg-rose-950/60 text-rose-300 border-rose-600/40'
                }`}
                title="Rate limit: 5 questions per session to prevent automated bot depletion"
              >
                <span>⚡ {remainingQueries}/{MAX_SESSION_QUESTIONS} LEFT</span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 border border-white/20 hover:border-white text-white rounded-full transition-colors cursor-pointer"
                title="Close Drawer [Esc]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container with isolated vertical scroll */}
          <div 
            className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-grow overscroll-y-contain overscroll-contain touch-pan-y"
            style={{ overscrollBehavior: 'contain' }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 sm:p-4 text-xs sm:text-sm font-light leading-relaxed rounded-xs ${
                    m.sender === 'user'
                      ? 'bg-white text-black font-normal shadow-md'
                      : 'bg-black/60 border border-white/15 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[10px] font-mono text-[#8E8E93] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 text-xs font-mono text-emerald-400 rounded-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI SARA IS THINKING...</span>
              </div>
            )}

            {/* QUOTA EXHAUSTED BANNER */}
            {remainingQueries <= 0 && (
              <div className="p-4 bg-gradient-to-r from-rose-950/80 to-black border border-rose-500/40 rounded-xs space-y-2.5 my-2 text-left">
                <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>SESSION QUESTION LIMIT REACHED (5/5)</span>
                </div>
                <p className="text-[11px] font-sans text-gray-300 leading-relaxed">
                  To protect AI resources against automated bots, each visitor is allocated 5 AI queries. To discuss projects or schedule an interview with Parwej, please reach out directly:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="mailto:bhaiparwej70@gmail.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>EMAIL PARVEJ</span>
                  </a>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('contact');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold rounded-xs border border-white/20 transition-colors"
                  >
                    <span>OPEN CONTACT FORM ↵</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts (Only if queries remaining) */}
          {remainingQueries > 0 && (
            <div className="px-5 sm:px-6 py-2.5 border-t border-white/10 bg-black/30 space-y-1.5">
              <div className="text-[9px] font-mono text-[#8E8E93] uppercase tracking-wider font-semibold">
                RECOMMENDED QUESTIONS ({remainingQueries} REMAINING)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isGenerating || remainingQueries <= 0}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[10.5px] font-mono text-white rounded-xs text-left transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invisible Anti-Bot Honeypot Input (Bots automatically fill this and get rejected) */}
          <input
            type="text"
            name="website_url_hp"
            value={honeypotValue}
            onChange={(e) => setHoneypotValue(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] opacity-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Input Bar or Exhausted Banner */}
          <div className="p-4 border-t border-white/10 bg-black/80 flex items-center gap-2">
            {remainingQueries > 0 ? (
              <>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Parwej's FP&A, CMA qualifications..."
                  maxLength={500}
                  className="flex-grow bg-white/5 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-emerald-400 rounded-xs font-mono"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isGenerating || !inputValue.trim()}
                  className="p-2.5 bg-white text-black hover:bg-emerald-400 hover:text-black disabled:opacity-40 transition-colors rounded-xs cursor-pointer font-bold"
                  title="Send Question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-xs text-xs font-mono text-gray-400">
                <span>Limit reached (5/5). Email: bhaiparwej70@gmail.com</span>
                <a 
                  href="mailto:bhaiparwej70@gmail.com" 
                  className="text-emerald-400 hover:underline font-bold ml-2"
                >
                  Send Email →
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
