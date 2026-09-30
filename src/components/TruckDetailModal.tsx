import React, { useState, useEffect } from 'react';
import { Truck } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DEALERSHIP_INFO } from '../firebase/config';
import { DEFAULT_TRUCK_IMAGE } from '../utils/imageHelper';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Gauge,
  Zap,
  Shield,
  Layers,
  Fuel,
  Share2,
  Check,
  Maximize2,
  Edit,
  Trash2,
} from 'lucide-react';

interface TruckDetailModalProps {
  truck: Truck | null;
  onClose: () => void;
  onEdit?: (truck: Truck) => void;
  onDelete?: (truck: Truck) => void;
}

export const TruckDetailModal: React.FC<TruckDetailModalProps> = ({
  truck,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { t, language } = useLanguage();
  const { hasFullPermission } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLightbox, setIsLightbox] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [truck]);

  if (!truck) return null;

  const images = truck.images && truck.images.length > 0
    ? truck.images
    : ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(truck.priceUSD);

  const formattedMileage = new Intl.NumberFormat('en-US').format(truck.mileage);

  const description =
    language === 'ku'
      ? truck.descriptionKu || truck.descriptionEn || truck.descriptionAr
      : language === 'ar'
      ? truck.descriptionAr || truck.descriptionEn || truck.descriptionKu
      : truck.descriptionEn || truck.descriptionKu || truck.descriptionAr;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Madina Trucks! I am inquiring about the ${truck.make} ${truck.model} (${truck.year}) priced at ${formattedPrice}. Plate: ${truck.plateNumber || 'N/A'}. Can I schedule an inspection in Erbil?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl my-auto bg-[#070E1C] border border-[#1A2F4C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
      >
        {/* Sticky top action bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#14233C] bg-[#030712]/95">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 px-3 py-1 rounded-xl border border-orange-500/30">
              {truck.make}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-white font-bold text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
              {truck.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasFullPermission && (
              <div className="flex items-center gap-1.5 mr-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(truck)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0B1528] hover:bg-orange-500 hover:text-black text-xs font-bold text-white border border-[#1E3352] transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{t.editTruck}</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(truck)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0B1528] hover:bg-rose-600 hover:text-white text-xs font-bold text-rose-400 border border-rose-500/40 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.delete}</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-slate-300 hover:text-white border border-[#1E3352] transition"
              title={t.share}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-slate-400 hover:text-white border border-[#1E3352] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-black border border-[#1A2F4C] group">
              <img
                src={images[activeImageIndex] || DEFAULT_TRUCK_IMAGE}
                alt={truck.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_TRUCK_IMAGE;
                }}
                className="w-full h-full object-cover select-none"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-orange-500 hover:text-black text-white backdrop-blur-md border border-white/20 transition opacity-80 group-hover:opacity-100"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-orange-500 hover:text-black text-white backdrop-blur-md border border-white/20 transition opacity-80 group-hover:opacity-100"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/20">
                  {activeImageIndex + 1} / {images.length}
                </span>
                <button
                  onClick={() => setIsLightbox(true)}
                  className="p-2 rounded-xl bg-black/80 hover:bg-orange-500 hover:text-black text-white backdrop-blur-md border border-white/20 transition"
                  title="Expand"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {truck.plateNumber && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border-2 border-black text-black font-mono text-sm font-black tracking-widest shadow-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>{truck.plateNumber}</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-2xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-lg'
                        : 'border-[#1A2F4C] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_TRUCK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price, Title, and Dealership Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#030712] border border-[#1A2F4C]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-black text-orange-400 font-mono">
                  {truck.make} {truck.model}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-white font-mono font-bold">{truck.year}</span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-500 text-black uppercase">
                  {truck.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {truck.title}
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t.price}:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-orange-400 font-mono">
                  {formattedPrice}
                </span>
                <span className="text-xs text-white font-black uppercase font-mono">USD</span>
              </div>
              <span className="text-[11px] text-slate-400">{t.priceInDollars}</span>
            </div>
          </div>

          {/* Action CTAs: Orange & Navy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-xs shadow-lg shadow-orange-500/25 transition border border-orange-400/40"
            >
              <Phone className="w-4 h-4 text-black" />
              <span>{t.callNow}: {DEALERSHIP_INFO.phones[0]}</span>
            </a>

            <a
              href={`tel:${DEALERSHIP_INFO.phoneTel2}`}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] text-orange-400 border border-orange-500/40 font-black text-xs transition"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>{t.callNow}: {DEALERSHIP_INFO.phones[1]}</span>
            </a>

            <a
              href={`https://wa.me/9647507263955?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition border border-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsappChat}</span>
            </a>

            <a
              href={DEALERSHIP_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] text-white border border-[#1E3352] font-bold text-xs transition hover:border-orange-500/50"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{t.openGoogleMaps}</span>
            </a>
          </div>

          {/* Technical Specifications Grid in Navy & Black */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span>{t.specifications}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.year}</span>
                <span className="text-white font-black text-sm">{truck.year}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.mileage}</span>
                <span className="text-white font-black text-sm">{formattedMileage} {t.km}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.transmission}</span>
                <span className="text-white font-black text-sm">{truck.transmission || 'Automatic'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.horsepower}</span>
                <span className="text-white font-black text-sm">{truck.horsepower ? `${truck.horsepower} HP` : 'N/A'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.axle}</span>
                <span className="text-white font-black text-sm">{truck.axleConfig || '4x2'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.fuelType}</span>
                <span className="text-white font-black text-sm">{truck.fuelType || 'Diesel'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.color}</span>
                <span className="text-white font-black text-sm">{truck.color || 'Standard'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C]">
                <span className="text-slate-400 text-[11px] block font-bold">{t.plateNumber}</span>
                <span className="text-orange-400 font-black text-sm">{truck.plateNumber || 'Verified'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                {t.overview}
              </h4>
              <div className="p-5 rounded-3xl bg-[#030712] border border-[#1A2F4C] text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                {description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox full screen viewer */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsLightbox(false)}
        >
          <button
            onClick={() => setIsLightbox(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[#0B1528] text-white hover:bg-orange-500 hover:text-black transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[activeImageIndex] || DEFAULT_TRUCK_IMAGE}
            alt={truck.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_TRUCK_IMAGE;
            }}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
