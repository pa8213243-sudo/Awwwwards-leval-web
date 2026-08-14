import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, User, Bot, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';
import { ParvejAvatar } from './ParvejAvatar';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
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

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isGenerating) return;

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
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Sara API.');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "I am AI Sara. Parwej is a Finance Specialist & CMA Candidate available at bhaiparwej70@gmail.com.",
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
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Right Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-lg bg-[#121214] border-l border-white/15 text-white flex flex-col justify-between shadow-2xl"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/60">
            <div className="flex items-center gap-3">
              <ParvejAvatar size="sm" showOnlinePing />
              <div>
                <h3 className="font-serif text-lg text-white font-semibold tracking-wide">PARVEJ AI SARA</h3>
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  POWERED BY GEMINI 3.1 PRO
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 border border-white/20 hover:border-white text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="p-6 overflow-y-auto space-y-4 flex-grow">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 text-xs sm:text-sm font-light leading-relaxed rounded-sm ${
                    m.sender === 'user'
                      ? 'bg-white text-black font-normal'
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
              <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 text-xs font-mono text-emerald-400 rounded-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI SARA IS THINKING...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts */}
          <div className="px-6 py-3 border-t border-white/10 bg-black/30 space-y-2">
            <div className="text-[10px] font-mono text-[#8E8E93] uppercase">RECOMMENDED RECRUITER QUESTIONS</div>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-mono text-white rounded-sm text-left transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-white/10 bg-black/80 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about Parwej's finance background, CMA candidacy..."
              className="flex-grow bg-white/5 border border-white/15 px-4 py-2.5 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-white rounded-sm font-mono"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isGenerating || !inputValue.trim()}
              className="p-2.5 bg-white text-black hover:bg-[#E5E5EA] disabled:opacity-50 transition-colors rounded-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
