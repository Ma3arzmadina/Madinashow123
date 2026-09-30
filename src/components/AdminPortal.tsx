import React, { useState, useEffect, useRef } from 'react';
import { Truck, AdminUser } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db, BOOTSTRAP_OWNER_EMAIL } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { SEED_TRUCKS } from '../data/seedTrucks';
import {
  DEFAULT_TRUCK_IMAGE,
  TRUCK_PHOTO_PRESETS,
  compressImageFile,
  validateImageUrl,
} from '../utils/imageHelper';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Truck as TruckIcon,
  Image as ImageIcon,
  DollarSign,
  Lock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Info,
  Mail,
  Upload,
  Check,
  Camera,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks: Truck[];
  editingTruck: Truck | null;
  onDoneEditing: () => void;
  onTrucksChanged: () => void;
  onDeleteTruck: (truckId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  trucks,
  editingTruck,
  onDoneEditing,
  onTrucksChanged,
  onDeleteTruck,
}) => {
  const { t } = useLanguage();
  const { user, hasFullPermission, lockAdmin, adminEmail, isOwner } = useAuth();

  const [activeTab, setActiveTab] = useState<'inventory' | 'create' | 'permissions'>('inventory');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [confirmDeleteTruckId, setConfirmDeleteTruckId] = useState<string | null>(null);
  const [confirmRevokeAdminId, setConfirmRevokeAdminId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    priceUSD: number;
    plateNumber: string;
    transmission: string;
    fuelType: string;
    axleConfig: string;
    horsepower: number;
    condition: string;
    color: string;
    descriptionEn: string;
    descriptionKu: string;
    descriptionAr: string;
    images: string[];
    status: 'available' | 'reserved' | 'sold';
    featured: boolean;
  }>({
    title: '',
    make: 'Mercedes-Benz',
    model: 'Actros 1845',
    year: new Date().getFullYear(),
    mileage: 200000,
    priceUSD: 55000,
    plateNumber: '22 A 19482 Erbil',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    axleConfig: '4x2',
    horsepower: 450,
    condition: 'Used',
    color: 'White',
    descriptionEn: '',
    descriptionKu: '',
    descriptionAr: '',
    images: [DEFAULT_TRUCK_IMAGE],
    status: 'available',
    featured: false,
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Permissions state
  const [adminsList, setAdminsList] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'manager' | 'owner'>('admin');
  const [newAdminPlateNote, setNewAdminPlateNote] = useState('Full Permission & Plate Management');

  // Load editing truck into form
  useEffect(() => {
    if (editingTruck) {
      setFormData({
        id: editingTruck.id,
        title: editingTruck.title,
        make: editingTruck.make,
        model: editingTruck.model,
        year: editingTruck.year,
        mileage: editingTruck.mileage,
        priceUSD: editingTruck.priceUSD,
        plateNumber: editingTruck.plateNumber || '',
        transmission: editingTruck.transmission || 'Automatic',
        fuelType: editingTruck.fuelType || 'Diesel',
        axleConfig: editingTruck.axleConfig || '4x2',
        horsepower: editingTruck.horsepower || 450,
        condition: editingTruck.condition || 'Used',
        color: editingTruck.color || 'White',
        descriptionEn: editingTruck.descriptionEn || '',
        descriptionKu: editingTruck.descriptionKu || '',
        descriptionAr: editingTruck.descriptionAr || '',
        images: editingTruck.images && editingTruck.images.length > 0 ? editingTruck.images : [DEFAULT_TRUCK_IMAGE],
        status: editingTruck.status,
        featured: editingTruck.featured || false,
      });
      setActiveTab('create');
    }
  }, [editingTruck]);

  // Load admin list from Firestore
  const loadAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const list: AdminUser[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<AdminUser, 'id'>) });
      });
      setAdminsList(list);
    } catch (err) {
      console.warn('Notice loading admins:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdmins();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle URL change with auto-validation
  const handleUrlInputChange = async (value: string) => {
    setNewImageUrl(value);
    if (!value.trim()) {
      setUrlStatus('idle');
      return;
    }
    const isValid = await validateImageUrl(value.trim());
    setUrlStatus(isValid ? 'valid' : 'invalid');
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images.filter((img) => img !== DEFAULT_TRUCK_IMAGE), newImageUrl.trim()],
    }));
    setNewImageUrl('');
    setUrlStatus('idle');
  };

  // Direct File Upload from phone or computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setErrorMessage(null);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await compressImageFile(file, 1100, 0.75);
          newImages.push(dataUrl);
        }
      }

      if (newImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images.filter((img) => img !== DEFAULT_TRUCK_IMAGE),
            ...newImages,
          ],
        }));
        setSuccessMessage(`Successfully uploaded ${newImages.length} photo(s)!`);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setErrorMessage('Could not process photo. Please try a different image.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddPresetPhoto = (presetUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images.filter((img) => img !== DEFAULT_TRUCK_IMAGE),
        presetUrl,
      ],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: filtered.length > 0 ? filtered : [DEFAULT_TRUCK_IMAGE],
      };
    });
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullPermission) {
      setErrorMessage(t.onlyAdminsCanPost);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const truckId = formData.id || `truck_${Date.now()}`;
      const payload: Record<string, any> = {
        title: formData.title.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        priceUSD: Number(formData.priceUSD),
        plateNumber: formData.plateNumber.trim() || '22 A Erbil',
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        axleConfig: formData.axleConfig,
        horsepower: Number(formData.horsepower) || 450,
        condition: formData.condition,
        color: formData.color.trim() || 'White',
        descriptionEn: formData.descriptionEn.trim(),
        descriptionKu: formData.descriptionKu.trim(),
        descriptionAr: formData.descriptionAr.trim(),
        images: formData.images.length > 0 ? formData.images : [DEFAULT_TRUCK_IMAGE],
        status: formData.status,
        featured: formData.featured,
        createdBy: user?.uid || adminEmail || 'madina_admin',
        createdByEmail: user?.email || adminEmail || 'admin@madinashop.com',
      };

      await setDoc(doc(db, 'trucks', truckId), payload, { merge: true });

      setSuccessMessage(formData.id ? 'Truck listing updated successfully!' : 'New truck published to showroom!');
      onTrucksChanged();
      onDoneEditing();
      setActiveTab('inventory');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'trucks');
      setErrorMessage('Failed to save truck listing. Please verify your admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Permanent Delete Truck from Firestore
  const executeDeleteTruck = async (truckId: string) => {
    if (!hasFullPermission) {
      setErrorMessage(t.onlyAdminsCanPost);
      return;
    }

    setLoading(true);
    setConfirmDeleteTruckId(null);

    // Instant optimistic removal from UI
    onDeleteTruck(truckId);

    try {
      await deleteDoc(doc(db, 'trucks', truckId));
      setSuccessMessage('Truck permanently removed from showroom.');
      onTrucksChanged();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `trucks/${truckId}`);
      setErrorMessage('Failed to delete truck listing.');
    } finally {
      setLoading(false);
    }
  };

  // Seed sample database
  const handleSeedDatabase = async () => {
    if (!hasFullPermission) {
      setErrorMessage(t.onlyAdminsCanPost);
      return;
    }

    setLoading(true);
    try {
      for (let i = 0; i < SEED_TRUCKS.length; i++) {
        const truck = SEED_TRUCKS[i];
        const truckId = `truck_${Date.now()}_${i + 1}`;
        await setDoc(doc(db, 'trucks', truckId), {
          ...truck,
          createdBy: user?.uid || adminEmail || 'madina_admin',
          createdByEmail: user?.email || adminEmail || BOOTSTRAP_OWNER_EMAIL,
        });
      }
      setSuccessMessage('Sample trucks loaded into showroom!');
      onTrucksChanged();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'trucks');
      setErrorMessage('Could not load sample inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setLoading(true);
    try {
      const cleanEmail = newAdminEmail.trim().toLowerCase();
      const sanitizedId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
      const payload: Omit<AdminUser, 'id'> = {
        email: cleanEmail,
        role: newAdminRole,
        plateAccess: newAdminPlateNote.trim(),
        addedBy: adminEmail || user?.email || 'Owner',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'admins', sanitizedId), payload);
      setSuccessMessage(`Permission granted! ${cleanEmail} can now sign in.`);
      setNewAdminEmail('');
      loadAdmins();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'admins');
      setErrorMessage('Failed to add admin.');
    } finally {
      setLoading(false);
    }
  };

  const executeRevokeAdmin = async (adminId: string) => {
    setLoading(true);
    setConfirmRevokeAdminId(null);
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      setSuccessMessage('Admin access revoked.');
      loadAdmins();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `admins/${adminId}`);
      setErrorMessage('Failed to revoke admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl my-auto bg-[#070E1C] border border-[#1A2F4C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#14233C] bg-[#030712]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.adminDashboard}
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono bg-orange-500/20 text-orange-400 font-black border border-orange-500/40">
                  {isOwner ? 'SUPER ADMIN (OWNER)' : 'AUTHORIZED ADMIN'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {adminEmail || user?.email || 'Authorized Dealership Admin'} • {t.fullPermission}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                lockAdmin();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-orange-400 text-xs font-bold border border-orange-500/30 transition"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>

            <button
              onClick={() => {
                onDoneEditing();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#14233C] bg-[#030712]/60">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <TruckIcon className="w-4 h-4" />
            <span>{t.inventoryTitle} ({trucks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 ${
              activeTab === 'create'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{formData.id ? t.editTruck : t.addTruckListing}</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 ${
              activeTab === 'permissions'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{t.managePermissions} ({adminsList.length + 1})</span>
          </button>
        </div>

        {/* Notification Banners */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-white">Current Showroom Listings</h4>
                  <p className="text-xs text-slate-300 font-medium">
                    Manage prices, license plates, remove sold trucks, or post new arrivals. Deleting a truck permanently removes it from Firestore.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        title: '',
                        make: 'Mercedes-Benz',
                        model: 'Actros 1845',
                        year: 2021,
                        mileage: 250000,
                        priceUSD: 59000,
                        plateNumber: '22 A 88412 Erbil',
                        transmission: 'Automatic',
                        fuelType: 'Diesel',
                        axleConfig: '4x2',
                        horsepower: 450,
                        condition: 'Used',
                        color: 'Silver',
                        descriptionEn: '',
                        descriptionKu: '',
                        descriptionAr: '',
                        images: [DEFAULT_TRUCK_IMAGE],
                        status: 'available',
                        featured: false,
                      });
                      setActiveTab('create');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition shadow-md shadow-orange-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addTruckListing}</span>
                  </button>

                  <button
                    onClick={handleSeedDatabase}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-orange-400 font-bold text-xs border border-orange-500/30 transition"
                    title="Load sample trucks into Firestore"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Load Sample Trucks</span>
                  </button>
                </div>
              </div>

              {trucks.length === 0 ? (
                <div className="text-center py-12 p-8 border border-dashed border-[#1E3352] rounded-3xl bg-[#030712]/50">
                  <TruckIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <h5 className="text-base font-bold text-white mb-1">Your Showroom is Empty</h5>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4">
                    All trucks have been removed or none added yet. You can post a new truck or load sample trucks.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs shadow-md transition"
                    >
                      {t.addTruckListing}
                    </button>
                    <button
                      onClick={handleSeedDatabase}
                      className="px-4 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-orange-400 font-bold text-xs border border-orange-500/30 transition"
                    >
                      Load Sample Trucks
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {trucks.map((trk) => (
                    <div
                      key={trk.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#030712] border border-[#1A2F4C] rounded-2xl gap-4 hover:border-orange-500/50 transition shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={trk.images?.[0] || DEFAULT_TRUCK_IMAGE}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_TRUCK_IMAGE;
                          }}
                          className="w-16 h-12 object-cover rounded-xl border border-[#1A2F4C] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{trk.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                trk.status === 'available'
                                  ? 'bg-emerald-500 text-black'
                                  : trk.status === 'reserved'
                                  ? 'bg-orange-500 text-black'
                                  : 'bg-rose-600 text-white'
                              }`}
                            >
                              {trk.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-1 font-bold">
                            <span>{trk.year}</span>
                            <span>•</span>
                            <span className="text-orange-400 font-black">${new Intl.NumberFormat('en-US').format(trk.priceUSD)} USD</span>
                            {trk.plateNumber && (
                              <>
                                <span>•</span>
                                <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">{trk.plateNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => {
                            setFormData({
                              id: trk.id,
                              title: trk.title,
                              make: trk.make,
                              model: trk.model,
                              year: trk.year,
                              mileage: trk.mileage,
                              priceUSD: trk.priceUSD,
                              plateNumber: trk.plateNumber || '',
                              transmission: trk.transmission || 'Automatic',
                              fuelType: trk.fuelType || 'Diesel',
                              axleConfig: trk.axleConfig || '4x2',
                              horsepower: trk.horsepower || 450,
                              condition: trk.condition || 'Used',
                              color: trk.color || 'White',
                              descriptionEn: trk.descriptionEn || '',
                              descriptionKu: trk.descriptionKu || '',
                              descriptionAr: trk.descriptionAr || '',
                              images: trk.images || [DEFAULT_TRUCK_IMAGE],
                              status: trk.status,
                              featured: trk.featured || false,
                            });
                            setActiveTab('create');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-xs font-bold text-white border border-[#1E3352] transition hover:border-orange-500/40"
                        >
                          <Edit className="w-3.5 h-3.5 text-orange-400" />
                          <span>{t.editTruck}</span>
                        </button>

                        {confirmDeleteTruckId === trk.id ? (
                          <div className="flex items-center gap-1.5 animate-in fade-in">
                            <button
                              type="button"
                              onClick={() => executeDeleteTruck(trk.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteTruckId(null)}
                              className="px-2 py-1.5 rounded-xl bg-[#0B1528] text-slate-400 hover:text-white text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteTruckId(trk.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 hover:text-white text-xs font-bold text-rose-400 border border-rose-500/30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.delete}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POST / EDIT TRUCK FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmitListing} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#14233C]">
                <h4 className="text-base font-black text-white">
                  {formData.id ? t.editTruck : t.addTruckListing}
                </h4>
                <span className="text-xs text-orange-400 font-mono font-black">
                  All prices in US Dollars ($ USD)
                </span>
              </div>

              {/* Title & Basic Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Mercedes-Benz Actros 1845 LS StreamSpace"
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Make / Brand *
                  </label>
                  <select
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  >
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Volvo">Volvo</option>
                    <option value="Scania">Scania</option>
                    <option value="MAN">MAN</option>
                    <option value="DAF">DAF</option>
                    <option value="Renault">Renault</option>
                    <option value="Iveco">Iveco</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Actros 1845, FH 500"
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.year} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1970}
                    max={2035}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2020 })}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Price in US Dollars ($ USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-orange-400 text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none font-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.mileage} (Kilometers) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.plateNumber} (e.g. Erbil Plate / VIN)
                  </label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    placeholder="22 A 84912 Erbil"
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.filterByStatus}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  >
                    <option value="available">{t.available}</option>
                    <option value="reserved">{t.reserved}</option>
                    <option value="sold">{t.sold}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.transmission}
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  >
                    <option value="Automatic">Automatic (PowerShift / I-Shift)</option>
                    <option value="Manual">Manual</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.axle} (Configuration)
                  </label>
                  <input
                    type="text"
                    value={formData.axleConfig}
                    onChange={(e) => setFormData({ ...formData, axleConfig: e.target.value })}
                    placeholder="4x2, 6x2, 6x4"
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.horsepower} (HP)
                  </label>
                  <input
                    type="number"
                    value={formData.horsepower}
                    onChange={(e) => setFormData({ ...formData, horsepower: parseInt(e.target.value) || 450 })}
                    placeholder="450, 500, 520"
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.color}
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="White, Blue, Silver, Black"
                    className="w-full px-4 py-2.5 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Enhanced Photo Manager: File Upload + Presets + Validated URL */}
              <div className="p-5 rounded-3xl bg-[#030712] border border-[#1A2F4C] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <span>Truck Photos & Gallery ({formData.images.length})</span>
                  </label>
                  <span className="text-[11px] text-orange-400 font-bold">
                    Supports Direct Camera / Phone Gallery & URLs
                  </span>
                </div>

                {/* Direct Upload from Camera / Phone Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="truck-file-upload"
                  />
                  <label
                    htmlFor="truck-file-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-xs shadow-lg shadow-orange-500/20 transition transform hover:-translate-y-0.5"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{uploadingImage ? 'Processing Photos...' : '📸 Upload Photos from Device / Camera'}</span>
                  </label>

                  <span className="text-xs text-slate-400 font-medium">or paste image link below</span>
                </div>

                {/* Paste URL Input with Live Validation */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => handleUrlInputChange(e.target.value)}
                      placeholder="Paste image link (e.g. https://... .jpg / .png)"
                      className="w-full px-4 py-3 bg-[#070E1C] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    {urlStatus === 'valid' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Image Valid
                      </span>
                    )}
                    {urlStatus === 'invalid' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 text-xs font-bold">
                        ⚠️ Link Unreachable
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-5 py-3 bg-[#0B1528] hover:bg-[#11213C] text-orange-400 border border-orange-500/40 font-black text-xs rounded-xl transition"
                  >
                    Add Link
                  </button>
                </div>

                {/* 1-Click Truck Photo Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Sample Truck Photos (1-Click Add):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TRUCK_PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetPhoto(preset.url)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070E1C] border border-[#1E3352] hover:border-orange-500 text-white text-xs font-bold transition"
                      >
                        <Plus className="w-3 h-3 text-orange-400" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Photo Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-[#1A2F4C] bg-[#070E1C]"
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
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-orange-500 text-black uppercase">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <h5 className="text-xs font-black text-white uppercase tracking-wider">
                  Vehicle Descriptions
                </h5>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    English Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Condition, retarder, fuel tanks, service history in Erbil..."
                    className="w-full px-4 py-2 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    ڕوونکردنەوە بە کوردی (Kurdish Description)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={formData.descriptionKu}
                    onChange={(e) => setFormData({ ...formData, descriptionKu: e.target.value })}
                    placeholder="دۆخی بارهەڵگر، گێڕ، هەردوو تانکی، ڕیتاردەر، مۆدێل، بێ کێشە لە هەولێر..."
                    className="w-full px-4 py-2 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    الوصف بالعربية (Arabic Description)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder="حالة الشاحنة، الفحص، سعة الوقود، المواصفات الفنية، لوحة أربيل..."
                    className="w-full px-4 py-2 bg-[#030712] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#14233C]">
                <button
                  type="button"
                  onClick={() => {
                    onDoneEditing();
                    setActiveTab('inventory');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#11213C] text-slate-300 text-xs font-bold transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-xs shadow-md transition"
                >
                  {loading ? t.loading : formData.id ? t.saveChanges : t.publishListing}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PLATES & PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-[#030712] border border-[#1A2F4C] flex items-start gap-3.5">
                <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 leading-relaxed">
                  <span className="font-black text-white text-sm block mb-1">
                    Dealership Admin Permissions Manager
                  </span>
                  Add any person's email address below to grant them permission. Once their email is added, they can sign in by entering their email address and the secret dealership PIN.
                </div>
              </div>

              {/* Grant New Admin Form */}
              <form
                onSubmit={handleAddAdmin}
                className="p-6 rounded-3xl bg-[#030712] border border-orange-500/40 space-y-4 shadow-xl shadow-orange-500/5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-orange-400" />
                    <span>Authorize New Admin Email</span>
                  </h4>
                  <span className="text-[11px] text-orange-400 font-bold">
                    Email + PIN Required for Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="e.g. manager@dealership.com"
                      className="w-full px-4 py-2.5 bg-[#070E1C] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-orange-400" />
                      <span>Role & Permission Level *</span>
                    </label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-[#070E1C] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                    >
                      <option value="admin">{t.admin} (Add, Edit & Delete Listings)</option>
                      <option value="manager">{t.manager} (Manage Listings & Status)</option>
                      <option value="owner">{t.superAdmin} (Full Owner Privileges)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {t.plateAccessNote}
                    </label>
                    <input
                      type="text"
                      value={newAdminPlateNote}
                      onChange={(e) => setNewAdminPlateNote(e.target.value)}
                      placeholder="e.g. Erbil Yard Plate Inspector"
                      className="w-full px-4 py-2.5 bg-[#070E1C] border border-[#1E3352] rounded-xl text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs rounded-xl transition shadow-md shadow-orange-500/20"
                  >
                    {loading ? t.loading : 'Grant Admin Permission'}
                  </button>
                </div>
              </form>

              {/* List of Authorized Admins */}
              <div className="space-y-3">
                <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-orange-400" />
                  <span>Authorized Administrators in Database ({adminsList.length + 1})</span>
                </h5>

                <div className="flex items-center justify-between p-4 bg-[#030712] border border-orange-500/40 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-mono">{BOOTSTRAP_OWNER_EMAIL}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-orange-500 text-black">
                          Primary Owner
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 font-medium">
                        Full Showroom & Vehicle Plate Permissions
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-orange-400 font-black font-mono">Owner Access</span>
                </div>

                {adminsList.map((adm) => (
                  <div
                    key={adm.id}
                    className="flex items-center justify-between p-4 bg-[#030712] border border-[#1A2F4C] rounded-2xl hover:border-orange-500/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#0B1528] text-slate-300 border border-[#1E3352]">
                        <UserCheck className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm font-mono">{adm.email}</span>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 uppercase font-black">
                            {adm.role}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {adm.plateAccess || 'Authorized Admin'}
                        </span>
                      </div>
                    </div>

                    {confirmRevokeAdminId === adm.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => executeRevokeAdmin(adm.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition"
                        >
                          Confirm Revoke
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRevokeAdminId(null)}
                          className="px-2 py-1.5 rounded-xl bg-[#0B1528] text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmRevokeAdminId(adm.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold border border-rose-500/30 transition"
                      >
                        {t.revokeAccess}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
