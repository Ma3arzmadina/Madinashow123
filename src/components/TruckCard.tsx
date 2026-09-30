import React from 'react';
import { Truck } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DEALERSHIP_INFO } from '../firebase/config';
import { DEFAULT_TRUCK_IMAGE } from '../utils/imageHelper';
import {
  Calendar,
  Gauge,
  Zap,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  Edit,
  Camera,
  Layers,
} from 'lucide-react';

interface TruckCardProps {
  truck: Truck;
  onSelect: (truck: Truck) => void;
  onEdit?: (truck: Truck) => void;
  onDelete?: (truck: Truck) => void;
}

export const TruckCard: React.FC<TruckCardProps> = ({
  truck,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();
  const { hasFullPermission } = useAuth();

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(truck.priceUSD);

  const formattedMileage = new Intl.NumberFormat('en-US').format(truck.mileage);

  // Status badges in Black, White, Orange & Emerald
  const statusBadge =
    truck.status === 'available' ? (
      <span className="px-3 py-1 text-xs font-black rounded-xl bg-emerald-500 text-black shadow-md shadow-emerald-500/20 backdrop-blur-md">
        {t.available}
      </span>
    ) : truck.status === 'reserved' ? (
      <span className="px-3 py-1 text-xs font-black rounded-xl bg-orange-500 text-black shadow-md shadow-orange-500/20 backdrop-blur-md">
        {t.reserved}
      </span>
    ) : (
      <span className="px-3 py-1 text-xs font-black rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/20 backdrop-blur-md">
        {t.sold}
      </span>
    );

  const coverImage =
    truck.images && truck.images.length > 0
      ? truck.images[0]
      : 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80';

  const photoCount = truck.images?.length || 1;

  const whatsappMessage = encodeURIComponent(
    `Hello Madina Trucks! I am inquiring about the ${truck.make} ${truck.model} (${truck.year}) priced at ${formattedPrice}. Plate: ${truck.plateNumber || 'N/A'}. Is it still available?`
  );

  return (
    <div className="group relative bg-[#070E1C] border border-[#162742] hover:border-orange-500/70 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer" onClick={() => onSelect(truck)}>
        <img
          src={coverImage}
          alt={truck.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_TRUCK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070E1C] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {statusBadge}

          {/* Photo count indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
            <Camera className="w-3.5 h-3.5 text-orange-400" />
            <span>{photoCount}</span>
          </div>
        </div>

        {/* License plate tag overlay */}
        {truck.plateNumber && (
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 px-3 py-1 rounded-md bg-white border-2 border-black text-black font-mono text-xs font-black tracking-wider shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>{truck.plateNumber}</span>
          </div>
        )}

        {/* Admin quick controls overlay */}
        {hasFullPermission && (
          <div
            className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                onClick={() => onEdit(truck)}
                className="p-2 rounded-xl bg-black/85 hover:bg-orange-500 hover:text-black text-white border border-white/20 shadow-lg transition"
                title={t.editTruck}
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(truck)}
                className="p-2 rounded-xl bg-black/85 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 shadow-lg transition"
                title={t.deleteTruck}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Make & Condition header */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-300 mb-1.5">
            <span className="font-black uppercase tracking-wider text-orange-400 font-mono">
              {truck.make}
            </span>
            <span className="bg-[#0D182A] border border-[#1A2E4C] px-2.5 py-0.5 rounded-md text-[11px] text-white font-bold">
              {truck.condition || 'Certified'}
            </span>
          </div>

          {/* Title in Pure White */}
          <h3
            onClick={() => onSelect(truck)}
            className="text-lg sm:text-xl font-black text-white group-hover:text-orange-400 transition cursor-pointer line-clamp-1 mb-2.5"
          >
            {truck.title}
          </h3>

          {/* Specifications Pills in Deep Black & Navy */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-200 font-mono">
            <div className="flex items-center gap-2 bg-[#030712] p-2 rounded-xl border border-[#182B48]">
              <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-bold text-white">{truck.year}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#030712] p-2 rounded-xl border border-[#182B48]">
              <Gauge className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate font-bold text-white">{formattedMileage} {t.km}</span>
            </div>

            {truck.transmission && (
              <div className="flex items-center gap-2 bg-[#030712] p-2 rounded-xl border border-[#182B48]">
                <Layers className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate font-bold text-white">{truck.transmission}</span>
              </div>
            )}

            {truck.horsepower && (
              <div className="flex items-center gap-2 bg-[#030712] p-2 rounded-xl border border-[#182B48]">
                <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="font-bold text-white">{truck.horsepower} {t.hp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-4 border-t border-[#14233C] mt-2">
          <div className="flex items-baseline justify-between mb-3.5">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.price}:</span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono drop-shadow-sm">
                {formattedPrice}
              </span>
              <span className="text-[11px] text-white ml-1 font-black uppercase font-mono">USD</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSelect(truck)}
              className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-white font-bold text-xs transition border border-[#1E3352] hover:border-orange-500/40"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.viewDetails}</span>
            </button>

            <a
              href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
              className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition shadow-md shadow-orange-500/20"
              title={`${t.callNow}: ${DEALERSHIP_INFO.phones[0]}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.callNow}</span>
            </a>

            <a
              href={`https://wa.me/9647507263955?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/10 border border-emerald-500/30"
              title={t.whatsappChat}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
