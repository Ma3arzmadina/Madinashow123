import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';
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
  adminEmail: string | null;
  adminProfile: AdminUser | null;
  unlockWithEmailAndPin: (email: string, pin: string) => Promise<{ success: boolean; error?: string }>;
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

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('madina_admin_email');
  });

  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('madina_admin_pin_auth') === 'true' && Boolean(localStorage.getItem('madina_admin_email'));
  });

  const isOwner = Boolean(
    (adminEmail && adminEmail.toLowerCase() === BOOTSTRAP_OWNER_EMAIL.toLowerCase()) ||
    (user && user.email?.toLowerCase() === BOOTSTRAP_OWNER_EMAIL.toLowerCase()) ||
    adminProfile?.role === 'owner'
  );

  const isAdmin = Boolean(
    isPinUnlocked || isOwner || adminProfile?.role === 'admin'
  );

  const isManager = Boolean(
    adminProfile?.role === 'manager'
  );

  const hasFullPermission = isPinUnlocked || isOwner || isAdmin;

  // Initialize bootstrap owner in Firestore if needed
  useEffect(() => {
    const bootstrapCheck = async () => {
      try {
        const ownerDocId = BOOTSTRAP_OWNER_EMAIL.replace(/[^a-zA-Z0-9_-]/g, '_');
        const ownerRef = doc(db, 'admins', ownerDocId);
        const snap = await getDoc(ownerRef);
        if (!snap.exists()) {
          await setDoc(ownerRef, {
            email: BOOTSTRAP_OWNER_EMAIL.toLowerCase(),
            role: 'owner',
            plateAccess: 'Super Admin & Full Vehicle Permissions',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('Bootstrap owner check notice:', e);
      }
    };
    bootstrapCheck();
  }, []);

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const isBootstrap = currentUser.email.toLowerCase() === BOOTSTRAP_OWNER_EMAIL.toLowerCase();
          const docId = currentUser.email.replace(/[^a-zA-Z0-9_-]/g, '_');
          const adminSnap = await getDoc(doc(db, 'admins', docId));

          if (adminSnap.exists()) {
            setAdminProfile({
              id: docId,
              ...(adminSnap.data() as Omit<AdminUser, 'id'>),
            });
          } else if (isBootstrap) {
            setAdminProfile({
              id: docId,
              email: currentUser.email,
              role: 'owner',
              plateAccess: 'Super Admin & Full Permissions',
            });
          }
        } catch (err) {
          console.warn('Error fetching admin doc for current user:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Unlock with BOTH Email and PIN
  const unlockWithEmailAndPin = async (
    email: string,
    enteredPin: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = enteredPin.trim();

    // 1. Verify PIN
    if (cleanPin !== ADMIN_PIN) {
      return { success: false, error: 'Incorrect PIN.' };
    }

    // 2. Check if Email is authorized
    if (cleanEmail === BOOTSTRAP_OWNER_EMAIL.toLowerCase()) {
      // Primary Owner is always authorized
      setIsPinUnlocked(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem('madina_admin_pin_auth', 'true');
      localStorage.setItem('madina_admin_email', cleanEmail);
      setIsPinModalOpen(false);
      return { success: true };
    }

    // Check Firestore 'admins' collection for this email
    try {
      const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
      const directSnap = await getDoc(doc(db, 'admins', docId));

      if (directSnap.exists()) {
        const rawData = directSnap.data();
        setIsPinUnlocked(true);
        setAdminEmail(cleanEmail);
        setAdminProfile({
          id: docId,
          email: rawData.email,
          role: rawData.role || 'admin',
          plateAccess: rawData.plateAccess,
          addedBy: rawData.addedBy,
          createdAt: rawData.createdAt,
        });
        localStorage.setItem('madina_admin_pin_auth', 'true');
        localStorage.setItem('madina_admin_email', cleanEmail);
        setIsPinModalOpen(false);
        return { success: true };
      }

      // Also try query by email field
      const q = query(collection(db, 'admins'), where('email', '==', cleanEmail));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const firstDoc = qSnap.docs[0];
        const rawData = firstDoc.data();
        setIsPinUnlocked(true);
        setAdminEmail(cleanEmail);
        setAdminProfile({
          id: firstDoc.id,
          email: rawData.email,
          role: rawData.role || 'admin',
          plateAccess: rawData.plateAccess,
          addedBy: rawData.addedBy,
          createdAt: rawData.createdAt,
        });
        localStorage.setItem('madina_admin_pin_auth', 'true');
        localStorage.setItem('madina_admin_email', cleanEmail);
        setIsPinModalOpen(false);
        return { success: true };
      }

      return {
        success: false,
        error: 'This email is not authorized. The dealership owner must grant permission to your email first.',
      };
    } catch (err) {
      console.error('Error verifying email authorization in Firestore:', err);
      return {
        success: false,
        error: 'Error checking authorization. Please verify network and try again.',
      };
    }
  };

  const lockAdmin = () => {
    setIsPinUnlocked(false);
    setAdminEmail(null);
    setAdminProfile(null);
    localStorage.removeItem('madina_admin_pin_auth');
    localStorage.removeItem('madina_admin_email');
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
        adminEmail,
        adminProfile,
        unlockWithEmailAndPin,
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
