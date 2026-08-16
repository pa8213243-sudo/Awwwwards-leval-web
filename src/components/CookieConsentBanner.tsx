import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie, Lock, X, CheckCircle2 } from 'lucide-react';
import { hasCookieConsent, setCookieConsent, getDeviceFingerprint } from '../lib/deviceFingerprint';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate device fingerprint immediately
    getDeviceFingerprint();

    // Check if consent was already provided
    const alreadyConsented = hasCookieConsent();
    if (!alreadyConsented) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // 1.5s delay after page load
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (all = true) => {
    setCookieConsent(all);
    getDeviceFingerprint(); // ensure cookie is set
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] bg-[#111116]/95 backdrop-blur-xl border-2 border-dashed border-white/20 text-white p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] select-none"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xs bg-[#E0533C]/20 border border-[#E0533C]/40 flex items-center justify-center text-[#E0533C]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white tracking-wide">
                DEVICE SECURITY & COOKIES
              </h4>
              <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                BOT DEFENSE // AI QUOTA TELEMETRY
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAccept(false)}
            className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] font-sans text-gray-300 leading-relaxed">
          We use essential device identifiers and cookies to prevent automated bot abuse, securely manage your <strong className="text-white">5 Free AI Sara Questions</strong> across refreshes, and guarantee ultra-smooth portfolio performance.
        </p>

        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
          <button
            onClick={() => handleAccept(true)}
            className="flex-1 px-3 py-2 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            ACCEPT & INITIALIZE
          </button>
          <button
            onClick={() => handleAccept(false)}
            className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-[11px] font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-center"
          >
            ESSENTIAL ONLY
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
