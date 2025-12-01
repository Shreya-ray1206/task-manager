import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Only import Analytics in production
let analytics;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ---------------------------------------------
// 🚫 DISABLE FIREBASE MESSAGING IN TEST MODE
// ---------------------------------------------
let messaging = null;

if (import.meta.env.MODE !== "test") {
  try {
    messaging = getMessaging(app);

    // Request token only in real browser, not in test
    getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    }).then((token) => {
      if (token) console.log("FCM Token:", token);
      else console.warn("No registration token available.");
    });

    // Foreground notifications
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
    });

  } catch (err) {
    console.warn("Messaging disabled due to unsupported environment.", err);
  }
} else {
  console.warn("🔥 Firebase Messaging skipped in Vitest.");
}

// Initialize Analytics only in production
if (import.meta.env.MODE === "production") {
  // import { getAnalytics } from "firebase/analytics";
  // analytics = getAnalytics(app);
}

export { app, analytics, messaging };
