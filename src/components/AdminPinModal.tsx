import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, KeyRound, Mail, Eye, EyeOff, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AdminPinModalProps {
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({ onSuccess }) => {
  const { isPinModalOpen, closePinModal, unlockWithEmailAndPin } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isPinModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pin.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    const res = await unlockWithEmailAndPin(email, pin);
    setLoading(false);

    if (res.success) {
      setEmail('');
      setPin('');
      setErrorMessage(null);
      onSuccess();
    } else {
      if (res.error?.includes('PIN')) {
        setErrorMessage(
          language === 'ku'
            ? 'کۆدی نهێنی (PIN) هەڵەیە!'
            : language === 'ar'
            ? 'رمز PIN غير صحيح!'
            : 'Incorrect Admin PIN. Please verify and try again.'
        );
      } else {
        setErrorMessage(
          language === 'ku'
            ? 'ئەم ئیمەیڵە ڕێگەپێدراو نییە! پێویستە خاوەنی پێشانگا سەرەتا دەسەڵات بەم ئیمەیڵە بدات.'
            : language === 'ar'
            ? 'هذا البريد الإلكتروني غير مصرح به! يجب على مالك المعرض منح الصلاحية لهذا البريد أولاً.'
            : 'This email is not authorized. The dealership owner must grant permission to your email first.'
        );
      }
    }
  };

  const title =
    language === 'ku'
      ? 'چوونەژوورەوەی بەڕێوەبەر'
      : language === 'ar'
      ? 'تسجيل دخول الإدارة'
      : 'Authorized Admin Sign In';

  const subtitle =
    language === 'ku'
      ? 'تکایە ئیمەیڵی ڕێگەپێدراو و کۆدی نهێنی بەڕێوەبەر بنووسە'
      : language === 'ar'
      ? 'يرجى إدخال البريد الإلكتروني المصرح به ورمز PIN الخاص بالإدارة'
      : 'Enter your authorized email and dealership admin PIN to manage inventory.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#070E1C] border border-[#1A2F4C] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        role="dialog"
      >
        {/* Subtle orange glow */}
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
              Security Gate
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>

        {/* Credentials Form: Email + PIN */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ku' ? 'ئیمەیڵی بەڕێوەبەر' : language === 'ar' ? 'البريد الإلكتروني للإدارة' : 'Authorized Admin Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="admin@dealership.com"
                className="w-full pl-10 pr-4 py-3 bg-[#030712] border border-[#1E3352] rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition font-medium"
              />
            </div>
          </div>

          {/* PIN input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ku' ? 'کۆدی نهێنی (PIN)' : language === 'ar' ? 'رمز الدخول (PIN)' : 'Admin PIN'}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[#030712] border border-[#1E3352] rounded-2xl text-white text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                title={showPin ? 'Hide' : 'Show'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-sm shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5 border border-orange-400/40"
            >
              {loading
                ? 'Verifying...'
                : language === 'ku'
                ? 'چوونەژوورەوە'
                : language === 'ar'
                ? 'دخول'
                : 'Sign In to Admin Panel'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#14233C] text-center text-[11px] text-slate-400 font-medium">
          Madina Trucks Showroom • Erbil, Kurdistan
        </div>
      </div>
    </div>
  );
};
