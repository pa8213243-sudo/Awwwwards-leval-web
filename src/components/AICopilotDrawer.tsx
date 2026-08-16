import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Loader2, ShieldCheck, Mail, AlertCircle, Bot, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { ParvejAvatar } from './ParvejAvatar';
import { setLenisScrollLocked } from '../lib/gsap';
import { getDeviceFingerprint, getDeviceInfo, DeviceInfo } from '../lib/deviceFingerprint';
import { sendAIMessage } from '../lib/geminiService';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

const MAX_SESSION_QUESTIONS = 5;
const STORAGE_KEY = 'parvej_ai_quota_v2';

// Helper component to render rich markdown formatting (bold, bullet points, links, email)
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-xs sm:text-sm font-light leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point line
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed;

        // Parse bold **text** and [link](url)
        const parts = [];
        const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|`.*?`)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index));
          }
          const token = match[0];
          if (token.startsWith('**') && token.endsWith('**')) {
            parts.push(
              <strong key={match.index} className="font-semibold text-white">
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith('[') && token.includes('](')) {
            const label = token.substring(1, token.indexOf(']('));
            const url = token.substring(token.indexOf('](') + 2, token.length - 1);
            parts.push(
              <a
                key={match.index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-medium"
              >
                {label}
              </a>
            );
          } else if (token.startsWith('`') && token.endsWith('`')) {
            parts.push(
              <code key={match.index} className="px-1 py-0.5 bg-white/10 font-mono text-[11px] text-emerald-300 rounded-2xs">
                {token.slice(1, -1)}
              </code>
            );
          }
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
              <div className="flex-1">{parts}</div>
            </div>
          );
        }

        return <p key={idx}>{parts}</p>;
      })}
    </div>
  );
};

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
      text: "Hello! I am **AI Sara**, Parwej's AI Strategy & Finance Assistant.\n\nAsk me anything about Parwej's **CMA candidacy (Part 1 cleared: 380/500)**, **3-statement financial models**, **Power BI DAX telemetry**, or **Activity-Based Costing** projects.",
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
        text: "You have reached the maximum limit of 5 questions for this session to preserve AI resources.\n\nTo discuss opportunities directly or schedule an executive interview, please contact Parwej at **bhaiparwej70@gmail.com**.",
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
      const deviceId = deviceInfo?.deviceId || getDeviceFingerprint();

      const aiResult = await sendAIMessage({
        prompt: text,
        honeypot: honeypotValue,
        deviceId,
        deviceCode: deviceInfo?.deviceCode,
        deviceType: deviceInfo?.deviceType,
        os: deviceInfo?.os,
        browser: deviceInfo?.browser,
        history: messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
      });

      // Update remaining quota
      if (typeof aiResult.remainingQueries === 'number') {
        updateRemainingQueries(aiResult.remainingQueries);
      } else {
        updateRemainingQueries(remainingQueries - 1);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Sara query error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Hello! I am **AI Sara**, Parwej's Finance & Strategy Assistant.\n\nParwej is a **Finance Specialist & CMA Candidate (380/500)** skilled in **3-Statement Financial Modeling**, **Power BI & DAX**, and **Activity-Based Costing**.\n\nPlease reach out directly at **bhaiparwej70@gmail.com**!",
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
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> GEMINI AI ACTIVE
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
                  className={`max-w-[90%] p-3.5 sm:p-4 rounded-xs ${
                    m.sender === 'user'
                      ? 'bg-white text-black font-normal shadow-md'
                      : 'bg-black/70 border border-white/15 text-gray-200'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <FormattedMessage text={m.text} />
                  )}
                </div>
                <span className="text-[10px] font-mono text-[#8E8E93] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 text-xs font-mono text-emerald-400 rounded-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI SARA IS THINKING & GENERATING DETAILS...</span>
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold rounded-xs border border-white/20 transition-colors cursor-pointer"
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
