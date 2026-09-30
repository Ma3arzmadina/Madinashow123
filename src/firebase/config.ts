import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const BOOTSTRAP_OWNER_EMAIL = 'yado14007@gmail.com';

export const DEALERSHIP_INFO = {
  name: 'Madina Trucks',
  shopName: 'Madinashop',
  taglineEn: 'Premier Commercial & Heavy Truck Dealership',
  taglineKu: 'پێشانگای سەرەکی بارهەڵگر لە هەولێر کوردستان',
  taglineAr: 'المعرض الرائد للشاحنات الثقيلة في أربيل كردستان',
  locationName: 'Kurdistan, Erbil',
  phones: ['07507263955', '07504469680'],
  phoneTel1: '+9647507263955',
  phoneTel2: '+9647504469680',
  mapsUrl: 'https://maps.app.goo.gl/5WUbXH3fPCtZSS2u8?g_st=ipc',
  currency: 'USD',
  currencySymbol: '$',
};

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();
