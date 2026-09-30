import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DEALERSHIP_INFO } from '../firebase/config';
import {
  Truck,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  Lock,
  PlusCircle,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenNewListing: () => void;
  inventoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenNewListing,
  inventoryCount,
}) => {
  const { language, setLanguage, openLanguageModal, t } = useLanguage();
  const { hasFullPermission, isPinUnlocked, openPinModal, lockAdmin, adminEmail } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    if (hasFullPermission) {
      onOpenAdmin();
    } else {
      openPinModal();
    }
  };

  const currentLangLabel =
    language === 'ku' ? '☀️ کوردی' : language === 'ar' ? '🌙 العربية' : '🌍 English';

  return (
    <header className="sticky top-0 z-40 bg-[#040814]/95 backdrop-blur-xl border-b border-[#132238] transition-all">
      {/* Top hotline bar with Navy & Orange branding */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-black text-xs font-black py-1.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#050B17] text-white px-2.5 py-0.5 rounded font-mono uppercase tracking-wider text-[11px] font-black border border-white/20">
              Madinashop
            </span>
            <span className="font-extrabold text-white drop-shadow-sm">{t.dealershipAddress}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <a
              href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
              className="flex items-center gap-1.5 hover:underline font-black text-black bg-white/90 px-2 py-0.5 rounded shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>{DEALERSHIP_INFO.phones[0]}</span>
            </a>
            <span className="hidden sm:inline text-black/50 font-bold">|</span>
            <a
              href={`tel:${DEALERSHIP_INFO.phoneTel2}`}
              className="hidden sm:flex items-center gap-1.5 hover:underline font-black text-black bg-white/90 px-2 py-0.5 rounded shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>{DEALERSHIP_INFO.phones[1]}</span>
            </a>
            <span className="hidden md:inline text-black/50 font-bold">|</span>
            <a
              href={DEALERSHIP_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 hover:underline font-black text-white bg-[#0A1628] px-2.5 py-0.5 rounded border border-white/20"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.openGoogleMaps}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3.5 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition border border-orange-400/30">
                <Truck className="w-7 h-7 text-white" />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-[#040814]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition">
                    MADINA
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/40">
                    Madinashop
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  <span className="text-white font-medium">{DEALERSHIP_INFO.locationName}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-orange-400 font-mono font-bold">
                    {inventoryCount} {t.allTrucks}
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Desktop Phone Quick Call & Maps in Navy / Orange */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-[#0B1528] border border-[#1B2F4E] rounded-2xl p-2 px-3.5 shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase text-orange-300 font-black tracking-wide leading-none">
                  {t.callNow} (Erbil)
                </span>
                <div className="flex gap-2 font-mono text-xs text-white font-black mt-1">
                  <a href={`tel:${DEALERSHIP_INFO.phoneTel1}`} className="hover:text-orange-400 transition">
                    {DEALERSHIP_INFO.phones[0]}
                  </a>
                  <span className="text-slate-600">/</span>
                  <a href={`tel:${DEALERSHIP_INFO.phoneTel2}`} className="hover:text-orange-400 transition">
                    {DEALERSHIP_INFO.phones[1]}
                  </a>
                </div>
              </div>
            </div>

            <a
              href={DEALERSHIP_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0B1528] border border-[#1B2F4E] text-xs font-bold text-white hover:border-orange-500/50 hover:text-orange-400 transition shadow-sm"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{t.openGoogleMaps}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Right Controls: Language & Admin */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#0B1528] border border-[#1B2F4E] text-xs font-bold text-white hover:bg-[#11213C] hover:border-orange-500/40 transition shadow-sm"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-orange-400" />
              <span>{currentLangLabel}</span>
            </button>

            {/* Admin State Button */}
            {hasFullPermission ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenNewListing}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs shadow-lg shadow-orange-500/25 transition"
                >
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>{t.addTruckListing}</span>
                </button>

                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#0B1528] border border-orange-500/50 text-xs font-bold text-white hover:bg-[#11213C] transition"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>{t.adminDashboard}</span>
                </button>

                <button
                  onClick={lockAdmin}
                  className="p-2.5 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] border border-[#1B2F4E] text-slate-400 hover:text-rose-400 transition"
                  title="Lock Admin Session"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] border border-[#1B2F4E] hover:border-orange-500/50 text-xs font-bold text-white hover:text-orange-400 transition shadow-sm"
              >
                <Lock className="w-4 h-4 text-orange-400" />
                <span>{t.adminLogin}</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openLanguageModal}
              className="p-2 rounded-xl bg-[#0B1528] border border-[#1B2F4E] text-orange-400 text-xs font-black font-mono"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0B1528] border border-[#1B2F4E] text-white hover:text-orange-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#132238] bg-[#040814] px-4 py-4 space-y-3">
          <div className="p-3 bg-[#0B1528] rounded-xl border border-[#1B2F4E] space-y-2">
            <span className="text-[11px] text-orange-400 font-black uppercase">{t.phoneNumbers}</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
              <a
                href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-white font-black"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                {DEALERSHIP_INFO.phones[0]}
              </a>
              <a
                href={`tel:${DEALERSHIP_INFO.phoneTel2}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-white font-black"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                {DEALERSHIP_INFO.phones[1]}
              </a>
            </div>
          </div>

          <a
            href={DEALERSHIP_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-[#0B1528] border border-[#1B2F4E] text-xs font-bold text-white"
          >
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>{t.openGoogleMaps}</span>
          </a>

          {/* Admin state in mobile */}
          <div className="pt-2 border-t border-[#132238]">
            {hasFullPermission ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.adminDashboard}</span>
                </button>
                <button
                  onClick={() => {
                    lockAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-[#0B1528] text-rose-400 text-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Admin Session</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openPinModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#0B1528] border border-orange-500/40 text-orange-400 text-xs font-black"
              >
                <Lock className="w-4 h-4" />
                <span>{t.adminLogin}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
