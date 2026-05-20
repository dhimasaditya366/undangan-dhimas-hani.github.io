let app: any = null;
let db: any = null;
let unsubscribe: (() => void) | null = null;

const getFirebaseConfig = () => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) return null;
  return {
    apiKey: key,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
};

export const isRemoteEnabled = () => {
  return typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};

export const initFirebase = async () => {
  if (db) return db;
  if (!isRemoteEnabled()) return null;
  const config = getFirebaseConfig();
  if (!config) return null;

  const { initializeApp, getApps } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");

  const existing = getApps();
  app = existing.length > 0 ? existing[0] : initializeApp(config);
  db = getFirestore(app);
  return db;
};

const DOC_PATH = { collection: "wedding_data", docId: "primary" } as const;

export const saveAllRemote = async (payload: {
  guestList?: any[];
  checkinList?: any[];
  rsvpList?: any[];
}) => {
  const firestore = await initFirebase();
  if (!firestore) throw new Error("Firebase tidak dikonfigurasi.");
  const { doc, setDoc } = await import("firebase/firestore");
  const ref = doc(firestore, DOC_PATH.collection, DOC_PATH.docId);
  await setDoc(ref, payload, { merge: true });
};

export const loadAllRemote = async () => {
  const firestore = await initFirebase();
  if (!firestore) return null;
  const { doc, getDoc } = await import("firebase/firestore");
  const ref = doc(firestore, DOC_PATH.collection, DOC_PATH.docId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as { guestList?: any[]; checkinList?: any[]; rsvpList?: any[] };
};

/**
 * Dengarkan perubahan real-time dari Firestore.
 * Callback dipanggil setiap ada update dari device lain.
 * Panggil stopListening() untuk berhenti.
 */
export const startListening = async (
  onUpdate: (data: { guestList?: any[]; checkinList?: any[]; rsvpList?: any[] }) => void
) => {
  stopListening();
  const firestore = await initFirebase();
  if (!firestore) return;
  const { doc, onSnapshot } = await import("firebase/firestore");
  const ref = doc(firestore, DOC_PATH.collection, DOC_PATH.docId);
  unsubscribe = onSnapshot(ref, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as any);
    }
  });
};

export const stopListening = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};
