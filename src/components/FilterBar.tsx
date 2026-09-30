import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FilterState } from '../types';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  Calendar,
  Gauge,
  DollarSign,
  Tag,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableMakes: string[];
  availableModels: string[];
  availableYears: number[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableMakes,
  availableModels,
  availableYears,
  totalResults,
}) => {
  const { t } = useLanguage();

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      priceMin: '',
      priceMax: '',
      condition: '',
      status: '',
      sortBy: 'newest',
    });
  };

  const isFiltered =
    Boolean(filters.searchQuery) ||
    Boolean(filters.make) ||
    Boolean(filters.model) ||
    Boolean(filters.yearMin) ||
    Boolean(filters.yearMax) ||
    Boolean(filters.mileageMax) ||
    Boolean(filters.priceMin) ||
    Boolean(filters.priceMax) ||
    Boolean(filters.condition) ||
    Boolean(filters.status);

  return (
    <div className="bg-[#070E1C] border border-[#1A2F4C] rounded-3xl p-5 sm:p-6 mb-8 shadow-2xl backdrop-blur-md">
      {/* Top Search bar & Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5 pb-5 border-b border-[#14233C]">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3.5 bg-[#030712] border border-[#1E3352] rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition shadow-inner font-medium"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-orange-400 hover:text-white px-2 py-1 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort selector & Reset in Navy & Orange */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0B1528] border border-[#1E3352] rounded-2xl px-4 py-2.5 text-xs">
            <SlidersHorizontal className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-slate-300 font-bold whitespace-nowrap">{t.sortBy}:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-black"
            >
              <option value="newest" className="bg-[#0B1528] text-white">
                {t.newest}
              </option>
              <option value="price-asc" className="bg-[#0B1528] text-white">
                {t.priceLowHigh}
              </option>
              <option value="price-desc" className="bg-[#0B1528] text-white">
                {t.priceHighLow}
              </option>
              <option value="mileage-asc" className="bg-[#0B1528] text-white">
                {t.mileageLowHigh}
              </option>
              <option value="year-desc" className="bg-[#0B1528] text-white">
                {t.yearNewOld}
              </option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#0B1528] hover:bg-[#11213C] text-orange-400 text-xs font-black border border-orange-500/40 transition whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>
      </div>

      {/* Structured Filters Grid (Make, Model, Year, Mileage, Price, Status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Make / Brand */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.filterByMake}</span>
          </label>
          <select
            value={filters.make}
            onChange={(e) => onFilterChange({ ...filters, make: e.target.value, model: '' })}
            className="w-full px-3.5 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">{t.allMakes}</option>
            {availableMakes.map((m) => (
              <option key={m} value={m} className="bg-[#070E1C] text-white">
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.filterByModel}</span>
          </label>
          <select
            value={filters.model}
            onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">{t.allModels}</option>
            {availableModels.map((m) => (
              <option key={m} value={m} className="bg-[#070E1C] text-white">
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.filterByYear}</span>
          </label>
          <select
            value={filters.yearMin}
            onChange={(e) => onFilterChange({ ...filters, yearMin: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
          >
            <option value="">{t.filterByYear} (All)</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr} className="bg-[#070E1C] text-white">
                {yr} & Newer
              </option>
            ))}
          </select>
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.filterByMileage}</span>
          </label>
          <select
            value={filters.mileageMax}
            onChange={(e) => onFilterChange({ ...filters, mileageMax: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
          >
            <option value="">All Mileage</option>
            <option value="150000">&lt; 150,000 km</option>
            <option value="300000">&lt; 300,000 km</option>
            <option value="500000">&lt; 500,000 km</option>
            <option value="750000">&lt; 750,000 km</option>
          </select>
        </div>

        {/* Price in Dollars */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.filterByPrice}</span>
          </label>
          <select
            value={filters.priceMax}
            onChange={(e) => onFilterChange({ ...filters, priceMax: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-orange-400"
          >
            <option value="">All Prices ($ USD)</option>
            <option value="50000">Under $50,000</option>
            <option value="70000">Under $70,000</option>
            <option value="90000">Under $90,000</option>
          </select>
        </div>
      </div>

      {/* Bottom Bar: Results Count & Active Status Filter tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#14233C] text-xs">
        <div className="text-slate-300 font-medium">
          {t.showingResults}: <span className="font-black text-orange-400 font-mono text-sm">{totalResults}</span> {t.allTrucks}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-bold">{t.filterByStatus}:</span>
          <button
            onClick={() => onFilterChange({ ...filters, status: '' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filters.status === ''
                ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                : 'bg-[#030712] text-white hover:text-orange-400 border border-[#1E3352]'
            }`}
          >
            {t.allStatuses}
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, status: 'available' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filters.status === 'available'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#030712] text-slate-300 hover:text-white border border-[#1E3352]'
            }`}
          >
            {t.available}
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, status: 'reserved' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filters.status === 'reserved'
                ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                : 'bg-[#030712] text-slate-300 hover:text-white border border-[#1E3352]'
            }`}
          >
            {t.reserved}
          </button>
        </div>
      </div>
    </div>
  );
};
