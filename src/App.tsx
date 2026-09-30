import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import { handleFirestoreError, OperationType } from './firebase/errors';
import { Truck, FilterState } from './types';
import { SEED_TRUCKS } from './data/seedTrucks';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { TruckCard } from './components/TruckCard';
import { TruckDetailModal } from './components/TruckDetailModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminPinModal } from './components/AdminPinModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LanguageModal } from './components/LanguageModal';
import { AlertCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const { hasFullPermission, openPinModal } = useAuth();

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);

  const inventoryRef = useRef<HTMLDivElement>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
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

  // Real-time Firestore synchronization
  useEffect(() => {
    const trucksColPath = 'trucks';
    const unsubscribe = onSnapshot(
      collection(db, trucksColPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Truck[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Truck, 'id'>) });
          });
          setTrucks(loaded);
        } else {
          // If Firestore is empty initially, load seed trucks with generated IDs
          const initialSeed: Truck[] = SEED_TRUCKS.map((st, i) => ({
            id: `seed_truck_${i + 1}`,
            ...st,
            createdBy: 'madina_dealership',
            createdByEmail: 'yado14007@gmail.com',
          }));
          setTrucks(initialSeed);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot notice:', error);
        const initialSeed: Truck[] = SEED_TRUCKS.map((st, i) => ({
          id: `seed_truck_${i + 1}`,
          ...st,
          createdBy: 'madina_dealership',
        }));
        setTrucks(initialSeed);
        setLoading(false);
        handleFirestoreError(error, OperationType.GET, trucksColPath);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute available makes, models, years for filtering
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    trucks.forEach((t) => t.make && set.add(t.make));
    return Array.from(set).sort();
  }, [trucks]);

  const availableModels = useMemo(() => {
    const set = new Set<string>();
    trucks
      .filter((t) => (!filters.make || t.make === filters.make))
      .forEach((t) => t.model && set.add(t.model));
    return Array.from(set).sort();
  }, [trucks, filters.make]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    trucks.forEach((t) => t.year && set.add(t.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [trucks]);

  // Filter & Sort Trucks
  const filteredTrucks = useMemo(() => {
    return trucks
      .filter((truck) => {
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = truck.title?.toLowerCase().includes(q);
          const matchMake = truck.make?.toLowerCase().includes(q);
          const matchModel = truck.model?.toLowerCase().includes(q);
          const matchPlate = truck.plateNumber?.toLowerCase().includes(q);
          if (!matchTitle && !matchMake && !matchModel && !matchPlate) {
            return false;
          }
        }

        if (filters.make && truck.make !== filters.make) return false;
        if (filters.model && truck.model !== filters.model) return false;
        if (filters.yearMin && truck.year < parseInt(filters.yearMin)) return false;
        if (filters.mileageMax && truck.mileage > parseInt(filters.mileageMax)) return false;
        if (filters.priceMax && truck.priceUSD > parseInt(filters.priceMax)) return false;
        if (filters.status && truck.status !== filters.status) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
        if (filters.sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
        if (filters.sortBy === 'mileage-asc') return a.mileage - b.mileage;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        return (b.year || 0) - (a.year || 0);
      });
  }, [trucks, filters]);

  const handleScrollToInventory = () => {
    inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditTruck = (truck: Truck) => {
    if (!hasFullPermission) {
      openPinModal();
      return;
    }
    setEditingTruck(truck);
    setIsAdminPortalOpen(true);
  };

  const handleDeleteTruck = async (truck: Truck) => {
    if (!hasFullPermission) {
      openPinModal();
      return;
    }
    if (!confirm(t.confirmDeleteDesc)) return;

    try {
      if (truck.id.startsWith('seed_truck_')) {
        setTrucks((prev) => prev.filter((t) => t.id !== truck.id));
      } else {
        await deleteDoc(doc(db, 'trucks', truck.id));
      }
      if (selectedTruck?.id === truck.id) {
        setSelectedTruck(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `trucks/${truck.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Startup Language Selection Modal */}
      <LanguageModal />

      {/* Admin PIN Unlock Modal (19madina19) */}
      <AdminPinModal
        onSuccess={() => {
          setIsAdminPortalOpen(true);
        }}
      />

      {/* Main Navbar */}
      <Navbar
        onOpenAdmin={() => {
          setEditingTruck(null);
          setIsAdminPortalOpen(true);
        }}
        onOpenNewListing={() => {
          setEditingTruck(null);
          setIsAdminPortalOpen(true);
        }}
        inventoryCount={trucks.length}
      />

      {/* Hero Section */}
      <Hero
        onScrollToInventory={handleScrollToInventory}
        inventoryCount={trucks.length}
      />

      {/* Main Showroom / Inventory Section */}
      <main ref={inventoryRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Madinashop Official Inventory
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.allTrucks}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {t.inventorySubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-inner">
            <span className="text-emerald-400 font-bold font-mono text-sm">
              ${new Intl.NumberFormat('en-US').format(filteredTrucks.length ? Math.min(...filteredTrucks.map((t) => t.priceUSD)) : 40000)}
              {' '}-{' '}
              ${new Intl.NumberFormat('en-US').format(filteredTrucks.length ? Math.max(...filteredTrucks.map((t) => t.priceUSD)) : 80000)}
            </span>
            <span className="text-slate-600">•</span>
            <span>{t.priceInDollars}</span>
          </div>
        </div>

        {/* Dynamic Filtering System */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableMakes={availableMakes}
          availableModels={availableModels}
          availableYears={availableYears}
          totalResults={filteredTrucks.length}
        />

        {/* Truck Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900 rounded-3xl h-96 border border-slate-800" />
            ))}
          </div>
        ) : filteredTrucks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onSelect={setSelectedTruck}
                onEdit={handleEditTruck}
                onDelete={handleDeleteTruck}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <AlertCircle className="w-12 h-12 text-amber-500/70 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">{t.noTrucksFound}</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              {t.noTrucksDesc}
            </p>
            <button
              onClick={() =>
                setFilters({
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
                })
              }
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              {t.resetFilters}
            </button>
          </div>
        )}
      </main>

      {/* Showroom Contact & Google Maps Section */}
      <ContactSection />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          if (hasFullPermission) {
            setEditingTruck(null);
            setIsAdminPortalOpen(true);
          } else {
            openPinModal();
          }
        }}
      />

      {/* Truck Full Specs & Multi-Image Lightbox Modal */}
      <TruckDetailModal
        truck={selectedTruck}
        onClose={() => setSelectedTruck(null)}
        onEdit={handleEditTruck}
        onDelete={handleDeleteTruck}
      />

      {/* Admin Management & Inventory Dashboard */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => {
          setIsAdminPortalOpen(false);
          setEditingTruck(null);
        }}
        trucks={trucks}
        editingTruck={editingTruck}
        onDoneEditing={() => setEditingTruck(null)}
        onTrucksChanged={() => {}}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
