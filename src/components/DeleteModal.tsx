import React, { useState } from 'react';
import { Truck } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { DEFAULT_TRUCK_IMAGE } from '../utils/imageHelper';

interface DeleteModalProps {
  truck: Truck | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (truck: Truck) => Promise<void>;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  truck,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { language } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !truck) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(truck);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const title =
    language === 'ku'
      ? 'سڕینەوەی بارهەڵگر'
      : language === 'ar'
      ? 'حذف الشاحنة نهائياً'
      : 'Delete Vehicle Listing';

  const desc =
    language === 'ku'
      ? 'ئایا دڵنیایت دەتەوێت ئەم بارهەڵگرە لە پێشانگا بسڕیتەوە؟ ئەم کردارە ناگەڕێتەوە.'
      : language === 'ar'
      ? 'هل أنت متأكد من رغبتك في حذف هذه الشاحنة من المعرض؟ لا يمكن التراجع عن هذا الإجراء.'
      : 'Are you sure you want to permanently delete this truck from the showroom inventory? This action cannot be undone.';

  const confirmText =
    language === 'ku'
      ? 'بەڵێ، بسڕەوە'
      : language === 'ar'
      ? 'نعم، حذف نهائي'
      : 'Yes, Delete Truck';

  const cancelText =
    language === 'ku' ? 'پاشگەزبوونەوە' : language === 'ar' ? 'إلغاء' : 'Cancel';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#070E1C] border border-rose-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7"
        role="dialog"
      >
        {/* Rose glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#11213C] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-3 shadow-inner">
            <Trash2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">{desc}</p>
        </div>

        {/* Truck card snippet */}
        <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1A2F4C] flex items-center gap-3 mb-6">
          <img
            src={truck.images?.[0] || DEFAULT_TRUCK_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_TRUCK_IMAGE;
            }}
            className="w-16 h-12 rounded-xl object-cover border border-[#1E3352] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-white truncate">{truck.title}</h4>
            <div className="flex items-center gap-2 text-[11px] font-mono text-orange-400 mt-1 font-bold">
              <span>{truck.year}</span>
              <span>•</span>
              <span>${new Intl.NumberFormat('en-US').format(truck.priceUSD)} USD</span>
            </div>
            {truck.plateNumber && (
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Plate: {truck.plateNumber}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="w-full py-3 px-4 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-slate-300 text-xs font-bold transition border border-[#1E3352]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-xs shadow-lg shadow-rose-600/25 transition border border-rose-500/40 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Deleting...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
