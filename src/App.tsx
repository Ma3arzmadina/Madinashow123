import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, onSnapshot, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db, BOOTSTRAP_OWNER_EMAIL } from './firebase/config';
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
import { DeleteModal } from './components/DeleteModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LanguageModal } from './components/LanguageModal';
import { AlertCircle, Plus } from 'lucide-react';

const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const { hasFullPermission, openPinModal } = useAuth();

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);

  // Custom Delete Modal State (replaces blocked window.confirm)
  const [truckToDelete, setTruckToDelete] = useState<Truck | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  // Persistent Firestore synchronization:
  // Deleted trucks STAY DELETED and never re-appear automatically.
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const initializeAndListen = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'showroom');
        const settingsSnap = await getDoc(settingsRef);

        // Perform one-time initial seed ONLY if showroom has never been setup
        if (!settingsSnap.exists()) {
          const currentTrucksSnap = await getDocs(collection(db, 'trucks'));
          if (currentTrucksSnap.empty) {
            for (let i = 0; i < SEED_TRUCKS.length; i++) {
              const truck = SEED_TRUCKS[i];
              const docId = `truck_init_${Date.now()}_${i + 1}`;
              await setDoc(doc(db, 'trucks', docId), {
                ...truck,
                createdBy: 'madina_dealership',
                createdByEmail: BOOTSTRAP_OWNER_EMAIL,
              });
            }
          }
          await setDoc(settingsRef, {
            initialized: true,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Initial database setup check notice:', err);
      }

      // Attach real-time Firestore listener
      unsubscribe = onSnapshot(
        collection(db, 'trucks'),
        (snapshot) => {
          const loaded: Truck[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Truck, 'id'>) });
          });
          setTrucks(loaded);
          setLoading(false);
        },
        (error) => {
          console.error('Firestore onSnapshot error:', error);
          setLoading(false);
          handleFirestoreError(error, OperationType.GET, 'trucks');
        }
      );
    };

    initializeAndListen();

    return () => {
      if (unsubscribe) unsubscribe();
    };
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

  // Open custom In-App Delete Modal (No window.confirm!)
  const handleRequestDeleteTruck = (truck: Truck) => {
    if (!hasFullPermission) {
      openPinModal();
      return;
    }
    setTruckToDelete(truck);
    setIsDeleteModalOpen(true);
  };

  // Perform permanent deletion in Firestore & optimistic state update
  const handleExecuteDelete = async (truck: Truck) => {
    try {
      // 1. Optimistic removal from state immediately
      setTrucks((prev) => prev.filter((t) => t.id !== truck.id));

      if (selectedTruck?.id === truck.id) {
        setSelectedTruck(null);
      }

      // 2. Permanent deletion in Cloud Firestore
      await deleteDoc(doc(db, 'trucks', truck.id));
    } catch (err) {
      console.error('Delete error:', err);
      handleFirestoreError(err, OperationType.DELETE, `trucks/${truck.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Startup Language Selection Modal */}
      <LanguageModal />

      {/* Admin Email + PIN Security Modal */}
      <AdminPinModal
        onSuccess={() => {
          setIsAdminPortalOpen(true);
        }}
      />

      {/* In-App Delete Confirmation Modal (Guaranteed to work without window.confirm) */}
      <DeleteModal
        truck={truckToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTruckToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
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
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs font-mono font-black uppercase tracking-wider text-orange-400">
                Madinashop Official Inventory
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.allTrucks}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl font-normal">
              {t.inventorySubtitle}
            </p>
          </div>

          {filteredTrucks.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#070E1C] border border-[#1A2F4C] px-4 py-2.5 rounded-2xl shadow-inner font-bold">
              <span className="text-orange-400 font-mono text-sm">
                ${new Intl.NumberFormat('en-US').format(Math.min(...filteredTrucks.map((t) => t.priceUSD)))}
                {' '}-{' '}
                ${new Intl.NumberFormat('en-US').format(Math.max(...filteredTrucks.map((t) => t.priceUSD)))}
              </span>
              <span className="text-slate-600">•</span>
              <span>{t.priceInDollars}</span>
            </div>
          )}
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
              <div key={n} className="bg-[#070E1C] rounded-3xl h-96 border border-[#1A2F4C]" />
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
                onDelete={handleRequestDeleteTruck}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#070E1C]/60 border border-[#1A2F4C] rounded-3xl">
            <AlertCircle className="w-12 h-12 text-orange-400/80 mx-auto mb-3" />
            <h3 className="text-lg font-black text-white mb-1">
              {trucks.length === 0 ? 'No Trucks in Showroom' : t.noTrucksFound}
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
              {trucks.length === 0
                ? 'All trucks have been removed or marked as sold. Use the Admin Portal to post new arrivals.'
                : t.noTrucksDesc}
            </p>
            <div className="flex items-center justify-center gap-3">
              {trucks.length === 0 ? (
                hasFullPermission ? (
                  <button
                    onClick={() => {
                      setEditingTruck(null);
                      setIsAdminPortalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs rounded-xl shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addTruckListing}</span>
                  </button>
                ) : (
                  <button
                    onClick={openPinModal}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs rounded-xl shadow-md transition"
                  >
                    {t.adminLogin}
                  </button>
                )
              ) : (
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
                  className="px-5 py-2.5 bg-[#0B1528] hover:bg-[#11213C] text-orange-400 font-bold text-xs rounded-xl border border-orange-500/30 transition"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>
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
        onDelete={handleRequestDeleteTruck}
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
        onDeleteTruck={(id) => {
          setTrucks((prev) => prev.filter((t) => t.id !== id));
          if (selectedTruck?.id === id) setSelectedTruck(null);
        }}
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
