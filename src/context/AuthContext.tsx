import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, BOOTSTRAP_OWNER_EMAIL } from '../firebase/config';
import { AdminUser } from '../types';

export const ADMIN_PIN = '19madina19';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isManager: boolean;
  hasFullPermission: boolean;
  isPinUnlocked: boolean;
  adminProfile: AdminUser | null;
  unlockWithPin: (pin: string) => boolean;
  lockAdmin: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isPinModalOpen: boolean;
  openPinModal: () => void;
  closePinModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  // Check if PIN was previously unlocked in this browser session
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('madina_admin_pin_auth') === 'true';
  });

  const isOwner = Boolean(
    isPinUnlocked || (user && user.email?.toLowerCase() === BOOTSTRAP_OWNER_EMAIL.toLowerCase()) || adminProfile?.role === 'owner'
  );

  const isAdmin = Boolean(
    isPinUnlocked || isOwner || adminProfile?.role === 'admin'
  );

  const isManager = Boolean(
    adminProfile?.role === 'manager'
  );

  const hasFullPermission = isPinUnlocked || isOwner || isAdmin;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const isBootstrap = currentUser.email?.toLowerCase() === BOOTSTRAP_OWNER_EMAIL.toLowerCase();
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminDocRef);

          if (adminSnap.exists()) {
            setAdminProfile({
              id: currentUser.uid,
              ...(adminSnap.data() as Omit<AdminUser, 'id'>),
            });
          } else if (isBootstrap) {
            const ownerRecord: Omit<AdminUser, 'id'> = {
              email: currentUser.email || BOOTSTRAP_OWNER_EMAIL,
              role: 'owner',
              plateAccess: 'Full Showroom & Vehicle Plate Permissions (Owner)',
              createdAt: new Date().toISOString(),
            };
            try {
              await setDoc(adminDocRef, ownerRecord);
            } catch (err) {
              console.warn('Bootstrap owner self-write notice:', err);
            }
            setAdminProfile({
              id: currentUser.uid,
              ...ownerRecord,
            });
          }
        } catch (err) {
          console.error('Error checking admin doc:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const unlockWithPin = (enteredPin: string): boolean => {
    if (enteredPin.trim() === ADMIN_PIN) {
      setIsPinUnlocked(true);
      localStorage.setItem('madina_admin_pin_auth', 'true');
      setIsPinModalOpen(false);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsPinUnlocked(false);
    localStorage.removeItem('madina_admin_pin_auth');
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    lockAdmin();
    try {
      await firebaseSignOut(auth);
      setAdminProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isOwner,
        isManager,
        hasFullPermission,
        isPinUnlocked,
        adminProfile,
        unlockWithPin,
        lockAdmin,
        signInWithGoogle,
        signOut,
        isPinModalOpen,
        openPinModal: () => setIsPinModalOpen(true),
        closePinModal: () => setIsPinModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
