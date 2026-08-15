import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check, Send, ArrowUpRight, Github, Linkedin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ParvejAvatar } from './ParvejAvatar';
import { SectionProgressHeader } from './SectionProgressHeader';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ScrollReveal } from './KineticTypography';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';

interface ContactSectionProps {
  onCopyEmail: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onCopyEmail }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleCopy = () => {
    onCopyEmail();
    setCopied(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email address is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errors.message = 'Please enter a message with at least 10 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 }
      });
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-16 md:py-24 border-b border-black/10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 bg-[#F3F2EE] text-[#111116] select-none space-y-10 overflow-hidden">
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="contact" opacity={0.2} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="contact" accentColor="#10B981" label="CONTACT" sectionCode="12" isLightBg={true} />

      {/* SECTION PROGRESS HEADER WITH LIVE PROGRESS BAR */}
      <SectionProgressHeader
        sceneCode="[SCENE 12 // INITIATION & CONTACT TELEMETRY]"
        title="CONTACT"
        subtitle="Schedule Institutional Consultation, Strategic Inquiries & Direct Communication"
        badge="RESPONSE < 12 HRS"
        accentColor="#10B981"
        sectionId="contact"
      />

      <ScrollReveal delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Big Statement CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="text-xs font-mono tracking-widest uppercase text-emerald-800 font-bold mb-3 flex items-center gap-2">
                <span>DIRECT EXECUTIVE CHANNELS</span>
                <span className="w-8 h-[1px] bg-emerald-600/30" />
              </div>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#111116] tracking-tight uppercase leading-[0.9]">
                LET'S WORK <br />
                <span className="italic font-normal text-emerald-700">TOGETHER.</span>
              </h2>
            </div>

            <p className="text-base font-sans font-medium text-[#444444] leading-relaxed max-w-lg">
              Whether you are recruiting for FP&A, Financial Modeling, CMA Strategic Cost Analysis, or Executive Power BI Telemetry roles — I am available for strategic impact.
            </p>

            {/* Direct Email Contact Card */}
            <div className="p-6 border-2 border-dashed border-black/25 bg-white shadow-md rounded-none space-y-4 relative">
              <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-black" />
              <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-black" />
              <div className="flex items-center gap-3">
                <ParvejAvatar size="md" showOnlinePing />
                <div>
                  <div className="text-xs font-mono uppercase text-[#111116] font-bold">{PERSONAL_INFO.name}</div>
                  <div className="text-[10px] font-mono uppercase text-[#666666] font-semibold">DIRECT EMAIL CONTACT</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 font-mono text-sm sm:text-base text-[#111116]">
                <a
                  href={PERSONAL_INFO.socials.email}
                  className="truncate text-emerald-800 font-bold hover:underline flex items-center gap-1.5"
                  title="Send Draft Email"
                >
                  <span>{PERSONAL_INFO.email}</span>
                </a>
                <a
                  href={PERSONAL_INFO.socials.email}
                  className="px-4 py-2 bg-emerald-600 text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all flex-shrink-0 cursor-pointer shadow-xs"
                  data-cursor="DRAFT"
                >
                  <Mail className="w-3.5 h-3.5 text-white" />
                  <span>SEND EMAIL</span>
                </a>
              </div>
            </div>

            {/* Professional Links */}
            <div className="space-y-3 pt-4 border-t border-black/15">
              <div className="text-xs font-mono uppercase text-[#666666] font-bold">PROFESSIONAL NETWORKS</div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={PERSONAL_INFO.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border-2 border-dashed border-black/25 bg-white text-[#111116] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-black/5 transition-colors shadow-xs"
                  data-cursor="LINK"
                >
                  <Linkedin className="w-4 h-4 text-emerald-700" />
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#777777]" />
                </a>

                <a
                  href={PERSONAL_INFO.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border-2 border-dashed border-black/25 bg-white text-[#111116] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-black/5 transition-colors shadow-xs"
                  data-cursor="LINK"
                >
                  <Github className="w-4 h-4 text-emerald-700" />
                  <span>GITHUB</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#777777]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-6 border-2 border-dashed border-black/25 bg-white p-8 md:p-10 rounded-none shadow-md text-[#111116] relative">
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-black" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-black" />
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-3xl text-[#111116] font-bold">MESSAGE TRANSMITTED</h3>
                <p className="text-xs font-mono text-[#555555] font-medium max-w-sm mx-auto">
                  Thank you for reaching out. Parvej will review your query and respond directly to <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', company: '', message: '' });
                  }}
                  className="py-2.5 px-6 border border-black/20 text-[#111116] font-mono text-xs uppercase tracking-widest font-bold hover:bg-black/5 transition-all"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-xs font-mono uppercase text-[#666666] font-bold border-b border-black/10 pb-3 flex items-center justify-between">
                  <span>INQUIRY FORM</span>
                  <span>DIRECT TO PARWEJ</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#111116] font-bold block">YOUR NAME *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full bg-[#F9F9F7] border border-black/15 px-4 py-3 text-sm font-sans text-[#111116] font-medium placeholder-[#888888] focus:outline-none focus:border-emerald-600 rounded-none"
                  />
                  {formErrors.name && <span className="text-[10px] font-mono text-red-600 font-bold">{formErrors.name}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#111116] font-bold block">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., sarah@company.com"
                    className="w-full bg-[#F9F9F7] border border-black/15 px-4 py-3 text-sm font-sans text-[#111116] font-medium placeholder-[#888888] focus:outline-none focus:border-emerald-600 rounded-none"
                  />
                  {formErrors.email && <span className="text-[10px] font-mono text-red-600 font-bold">{formErrors.email}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#111116] font-bold block">COMPANY / ORGANIZATION</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Apex Financial Capital"
                    className="w-full bg-[#F9F9F7] border border-black/15 px-4 py-3 text-sm font-sans text-[#111116] font-medium placeholder-[#888888] focus:outline-none focus:border-emerald-600 rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#111116] font-bold block">PROJECT / OPPORTUNITY DETAILS *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, financial modeling needs, or open role..."
                    className="w-full bg-[#F9F9F7] border border-black/15 px-4 py-3 text-sm font-sans text-[#111116] font-medium placeholder-[#888888] focus:outline-none focus:border-emerald-600 rounded-none"
                  />
                  {formErrors.message && <span className="text-[10px] font-mono text-red-600 font-bold">{formErrors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                  data-cursor="SUBMIT"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'TRANSMITTING...' : 'SUBMIT INQUIRY'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
