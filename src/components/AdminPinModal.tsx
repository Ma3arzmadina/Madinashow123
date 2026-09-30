import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert } from 'lucide-react';

interface AdminPinModalProps {
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({ onSuccess }) => {
  const { isPinModalOpen, closePinModal, unlockWithPin } = useAuth();
  const { language } = useLanguage();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (!isPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    const success = unlockWithPin(pin);
    if (success) {
      setPin('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const pinLabel =
    language === 'ku'
      ? 'کۆدی نهێنی بەڕێوەبەری مەدینە'
      : language === 'ar'
      ? 'رمز PIN السري لإدارة المدينة'
      : 'Madina Admin Access PIN';

  const pinDesc =
    language === 'ku'
      ? 'تکایە کۆدی نهێنی تایبەت بە بەڕێوەبەرانی مەدینە ترەکس بنووسە بۆ بەڕێوەبردنی بارهەڵگرەکان'
      : language === 'ar'
      ? 'يرجى إدخال رمز الأمان المخصص لمدراء المعرض للوصول إلى لوحة التحكم وحذف أو إضافة الشاحنات'
      : 'Enter the authorized dealership admin PIN to unlock inventory management, editing, and listing removal.';

  const incorrectLabel =
    language === 'ku'
      ? 'کۆدی نهێنی هەڵەیە! تکایە دووبارە هەوڵبدەرەوە.'
      : language === 'ar'
      ? 'رمز PIN غير صحيح! يرجى إعادة المحاولة.'
      : 'Incorrect Admin PIN. Please verify and try again.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#070E1C] border border-[#1A2F4C] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        role="dialog"
      >
        {/* Orange aura */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={closePinModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#11213C] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="px-3 py-0.5 text-[10px] font-mono font-black uppercase rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
              Admin Security Gate
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {pinLabel}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {pinDesc}
          </p>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input
              type={showPin ? 'text' : 'password'}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter Admin PIN..."
              className={`w-full pl-11 pr-11 py-3.5 bg-[#030712] border ${
                error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-[#1E3352]'
              } rounded-2xl text-white text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition`}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              title={showPin ? 'Hide' : 'Show'}
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{incorrectLabel}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-sm shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5 border border-orange-400/40"
            >
              {language === 'ku' ? 'چوونەژوورەوەی بەڕێوەبەر' : language === 'ar' ? 'تأكيد الدخول' : 'Unlock Admin Panel'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#14233C] text-center text-[11px] text-slate-400 font-mono">
          Madina Trucks Showroom • Erbil, Kurdistan
        </div>
      </div>
    </div>
  );
};
