import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { Globe, CheckCircle2, Truck, X } from 'lucide-react';

export const LanguageModal: React.FC = () => {
  const { isModalOpen, closeLanguageModal, setLanguage, language, t } = useLanguage();

  if (!isModalOpen) return null;

  const languages: { code: Language; name: string; nativeName: string; region: string; icon: string }[] = [
    {
      code: 'ku',
      name: 'Kurdish',
      nativeName: 'کوردی (سۆرانی)',
      region: 'هەولێر، کوردستان',
      icon: '☀️',
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English (US)',
      region: 'International & Export',
      icon: '🌍',
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      region: 'العراق والشرق الأوسط',
      icon: '🌙',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#070E1C] border border-[#1A2F4C] rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle glowing orange & navy background aura */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={closeLanguageModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#11213C] transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 mb-3 shadow-inner">
            <Truck className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-3 py-0.5 text-xs font-black uppercase tracking-wider rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
              Madinashop • Erbil
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t.selectLanguage}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            {t.selectLanguageDesc}
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`relative flex flex-col items-start p-4 rounded-2xl text-left transition-all border group ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-500 shadow-xl shadow-orange-500/15 ring-1 ring-orange-500/50'
                    : 'bg-[#0B1528] border-[#1A2E4C] hover:bg-[#101F38] hover:border-orange-500/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-orange-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-orange-400" />
                  )}
                </div>
                <div className="font-black text-base text-white group-hover:text-orange-400 transition">
                  {item.nativeName}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{item.name}</div>
                <div className="text-[11px] text-orange-400/80 mt-2 font-mono font-bold">{item.region}</div>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#14233C] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" />
            <span className="text-slate-300">You can change the language anytime from the menu.</span>
          </div>
          <button
            onClick={closeLanguageModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-xs shadow-lg shadow-orange-500/20 transition"
          >
            {t.continueBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
