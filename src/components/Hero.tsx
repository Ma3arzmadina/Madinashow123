import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEALERSHIP_INFO } from '../firebase/config';
import {
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  DollarSign,
  Truck,
  ArrowDown,
} from 'lucide-react';

interface HeroProps {
  onScrollToInventory: () => void;
  inventoryCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToInventory, inventoryCount }) => {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-[#030712] border-b border-[#132238]">
      {/* Background imagery with Navy & Black overlay and Orange radiance */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=80"
          alt="Madina Commercial Trucks"
          className="w-full h-full object-cover object-center opacity-30 filter contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-[#0A1628]/60" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-orange-500/25 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-blue-700/15 blur-3xl rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          {/* Eyebrow badge in Navy & Orange */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1528] border border-orange-500/40 text-orange-400 text-xs font-black mb-6 shadow-xl backdrop-blur-md">
            <span className="flex h-2.5 w-2.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="tracking-wider uppercase text-white font-black">MADINASHOP • KURDISTAN</span>
            <span className="text-orange-500/70">|</span>
            <span className="text-orange-300 font-bold">{DEALERSHIP_INFO.locationName}</span>
          </div>

          {/* Main Headline in Pure White */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            {t.inventoryTitle}
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed font-normal">
            {t.inventorySubtitle}
          </p>

          {/* Feature Highlights Grid in Navy with Orange accents */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#0B1528]/90 border border-[#1E3352] text-white backdrop-blur-md shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="font-bold text-white">{t.priceInDollars}</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#0B1528]/90 border border-[#1E3352] text-white backdrop-blur-md shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-white">{t.authorizedPlatesAndAdmins}</span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-2xl bg-[#0B1528]/90 border border-[#1E3352] text-white backdrop-blur-md shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-black text-orange-400 font-mono text-sm">
                {inventoryCount} {t.allTrucks}
              </span>
            </div>
          </div>

          {/* Action CTAs: High visibility Orange & Navy */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Primary Orange Call Button */}
            <a
              href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
              className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-xs sm:text-sm shadow-xl shadow-orange-500/30 transition transform hover:-translate-y-0.5 border border-orange-400/40"
            >
              <Phone className="w-4 h-4 text-black" />
              <span>{t.callNow}: {DEALERSHIP_INFO.phones[0]}</span>
            </a>

            {/* WhatsApp Direct Chat */}
            <a
              href={`https://wa.me/9647507263955?text=${encodeURIComponent('Hello Madina Trucks, I am interested in viewing your available trucks.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 transition transform hover:-translate-y-0.5 border border-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsappChat}</span>
            </a>

            {/* Google Maps link in Navy */}
            <a
              href={DEALERSHIP_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] border border-[#1E3352] text-white font-bold text-xs sm:text-sm transition shadow-lg hover:border-orange-500/50"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{t.openGoogleMaps}</span>
            </a>

            {/* Jump to inventory */}
            <button
              onClick={onScrollToInventory}
              className="flex items-center gap-2 px-4 py-4 rounded-2xl text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition"
            >
              <span>{t.allTrucks}</span>
              <ArrowDown className="w-4 h-4 animate-bounce text-orange-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
