import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEALERSHIP_INFO } from '../firebase/config';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Send,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryTruckModel, setInquiryTruckModel] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello Madina Trucks! My name is ${inquiryName || 'Buyer'}. Phone: ${inquiryPhone}. I am interested in: ${inquiryTruckModel || 'Available heavy trucks'}.`
    );
    window.open(`https://wa.me/9647507263955?text=${msg}`, '_blank');
    setInquirySent(true);
  };

  return (
    <section id="contact-section" className="py-16 bg-[#030712] border-t border-[#132238]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Madina Dealership • Erbil</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.contactUs}
          </h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            Visit our showroom in Erbil or contact our sales team directly by phone or WhatsApp.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Direct Phone Lines */}
          <div className="p-7 rounded-3xl bg-[#070E1C] border border-[#1A2F4C] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">{t.phoneNumbers}</h3>
              <p className="text-xs text-slate-300 mb-6 font-medium">
                Direct lines to our sales and inspection managers in Erbil.
              </p>

              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1E3352] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span className="font-black text-white text-sm">{DEALERSHIP_INFO.phones[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${DEALERSHIP_INFO.phoneTel1}`}
                      className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition"
                    >
                      {t.callNow}
                    </a>
                    <a
                      href={`https://wa.me/9647507263955`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition border border-emerald-500/30"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#030712] border border-[#1E3352] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span className="font-black text-white text-sm">{DEALERSHIP_INFO.phones[1]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${DEALERSHIP_INFO.phoneTel2}`}
                      className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition"
                    >
                      {t.callNow}
                    </a>
                    <a
                      href={`https://wa.me/9647504469680`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition border border-emerald-500/30"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#14233C] text-xs text-slate-300 flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{t.dealershipHoursVal}</span>
            </div>
          </div>

          {/* Card 2: Showroom Location & Google Maps */}
          <div className="p-7 rounded-3xl bg-[#070E1C] border border-[#1A2F4C] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">{t.addressLabel}</h3>
              <p className="text-xs text-slate-300 mb-6 font-medium">
                Kurdistan, Erbil - Convenient commercial truck testing and inspection routes.
              </p>

              <div className="p-4 rounded-2xl bg-[#030712] border border-[#1E3352] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping" />
                  <span>Madina Trucks Main Yard</span>
                </div>
                <p className="text-xs text-slate-300">
                  Erbil, Kurdistan Region, Iraq
                </p>
                <div className="text-[11px] text-orange-400 font-mono font-bold">
                  Direct GPS Location Active
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#14233C]">
              <a
                href={DEALERSHIP_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] border border-orange-500/40 text-orange-400 hover:text-white font-black text-xs shadow-lg transition"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{t.openGoogleMaps}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Card 3: Quick WhatsApp Inquiry Form */}
          <div className="p-7 rounded-3xl bg-[#070E1C] border border-[#1A2F4C] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Direct Sales Inquiry</h3>
              <p className="text-xs text-slate-300 mb-4 font-medium">
                Ask about specific truck models, plates, or schedule an inspection.
              </p>

              {inquirySent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Inquiry opened in WhatsApp! Our manager will reply shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Interested in (e.g. Actros, Volvo FH, MAN)"
                    value={inquiryTruckModel}
                    onChange={(e) => setInquiryTruckModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition shadow-md shadow-orange-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#14233C] text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Official Madina Dealership Direct Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
