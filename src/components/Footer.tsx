import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DEALERSHIP_INFO } from '../firebase/config';
import { Truck, Phone, MapPin, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { t, setLanguage, language } = useLanguage();
  const { hasFullPermission } = useAuth();

  return (
    <footer className="bg-[#02050E] border-t border-[#132238] text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center text-black font-black shadow-lg shadow-orange-500/20 border border-orange-400/30">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-tight">MADINA</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  Madinashop
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed font-normal">
              {t.inventorySubtitle}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-orange-400 font-mono font-bold">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>{DEALERSHIP_INFO.locationName}</span>
            </div>
          </div>

          {/* Col 2: Contact Phones */}
          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">
              {t.phoneNumbers}
            </h5>
            <div className="space-y-1.5 font-mono font-bold">
              <a
                href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
                className="flex items-center gap-2 text-white hover:text-orange-400 transition"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{DEALERSHIP_INFO.phones[0]}</span>
              </a>
              <a
                href={`tel:${DEALERSHIP_INFO.phoneTel2}`}
                className="flex items-center gap-2 text-white hover:text-orange-400 transition"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{DEALERSHIP_INFO.phones[1]}</span>
              </a>
            </div>
            <div className="pt-2">
              <a
                href={DEALERSHIP_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-orange-400 hover:underline font-bold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.openGoogleMaps}</span>
              </a>
            </div>
          </div>

          {/* Col 3: Language & Admin */}
          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">
              {t.selectLanguage}
            </h5>
            <div className="flex flex-col gap-1.5 font-bold">
              <button
                onClick={() => setLanguage('ku')}
                className={`text-left hover:text-orange-400 transition ${
                  language === 'ku' ? 'text-orange-400 font-black' : 'text-slate-300'
                }`}
              >
                ☀️ کوردی (Kurdish)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-left hover:text-orange-400 transition ${
                  language === 'en' ? 'text-orange-400 font-black' : 'text-slate-300'
                }`}
              >
                🌍 English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`text-left hover:text-orange-400 transition ${
                  language === 'ar' ? 'text-orange-400 font-black' : 'text-slate-300'
                }`}
              >
                🌙 العربية (Arabic)
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-orange-400 transition text-xs font-bold"
              >
                {hasFullPermission ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t.adminDashboard}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Admin PIN (19madina19)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#132238] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Madina Trucks (Madinashop). All Rights Reserved. Erbil, Kurdistan.
          </div>
          <div className="flex items-center gap-3 font-bold text-white">
            <span className="text-orange-400">Prices in USD ($)</span>
            <span>•</span>
            <span>Commercial Showroom</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
