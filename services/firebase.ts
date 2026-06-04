
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, updateProfile, Auth, User } from "firebase/auth";
import { getFirestore, Firestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, logEvent as firebaseLogEvent, Analytics } from "firebase/analytics";
import firebaseConfig from '../firebase-applet-config.json';

const isFirebaseConfigured = !!firebaseConfig.projectId;

let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

const googleProvider = new GoogleAuthProvider();

async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    storage = getStorage(app);
    
    testConnection();
    
    // Analytics hanya berjalan di lingkungan browser
    if (typeof window !== 'undefined') {
        try {
            analytics = getAnalytics(app);
        } catch (e) {
            console.warn("Analytics not supported in this environment");
        }
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // @ts-ignore
    auth = createMockAuth();
    // @ts-ignore
    db = {}; 
    // @ts-ignore
    storage = {};
  }
} else {
  console.warn("Firebase configuration missing. Using Mock Services.");
  // @ts-ignore
  auth = createMockAuth();
  // @ts-ignore
  db = {};
  // @ts-ignore
  storage = {};
}

function createMockAuth(): Auth {
    return {
        currentUser: null,
        onAuthStateChanged: (nextOrObserver: any) => {
            if (typeof nextOrObserver === 'function') nextOrObserver(null);
            else if (nextOrObserver && nextOrObserver.next) nextOrObserver.next(null);
            return () => {};
        },
        signOut: async () => {},
        updateProfile: async () => {},
    } as unknown as Auth;
}

export { auth, db, storage, analytics };

// --- AUTH SERVICES ---

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    throw new Error("Konfigurasi Firebase belum terdeteksi. Silakan cek file .env atau hardcoded config.");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Log login event
    logAnalyticsEvent('login', { method: 'google' });
    return result.user;
  } catch (error: any) {
    console.error("Login Error Full:", error);
    throw error;
  }
};

export const logout = async () => {
  if (!isFirebaseConfigured) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

export const updateUserProfile = async (user: User, displayName: string) => {
    if (!user) throw new Error("No user to update");
    try {
        await updateProfile(user, { displayName });
    } catch (error) {
        console.error("Update Profile Error:", error);
        throw error;
    }
};

// --- STORAGE SERVICES (NEW) ---

/**
 * Mengupload file Base64 ke Firebase Storage untuk menghemat Firestore
 * @param userId ID user pemilik file
 * @param fileBase64 String base64 file (data:image/png;base64,...)
 * @param fileName Nama file
 * @returns Promise string URL download
 */
export const uploadFileToStorage = async (userId: string, fileBase64: string, fileName: string): Promise<string> => {
    if (!storage || !userId) return fileBase64; // Fallback jika storage tidak aktif

    try {
        const timestamp = Date.now();
        // Path: uploads/{userId}/{timestamp}_{filename}
        const storageRef = ref(storage, `uploads/${userId}/${timestamp}_${fileName}`);
        
        // Upload string (Base64)
        await uploadString(storageRef, fileBase64, 'data_url');
        
        // Dapatkan URL publik
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Upload Storage Error:", error);
        return fileBase64; // Fallback ke base64 jika gagal upload
    }
};

// --- ANALYTICS SERVICES (NEW) ---

export const logAnalyticsEvent = (eventName: string, params?: any) => {
    if (analytics) {
        try {
            firebaseLogEvent(analytics, eventName, params);
        } catch (e) {
            console.log("Analytics Log Skipped (Dev Mode)");
        }
    }
};
