import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Default config in case environment variables are not available
const defaultConfig = {
  apiKey: "AIzaSyDummyKeyForBuildTime",
  authDomain: "example.firebaseapp.com",
  projectId: "example-project",
  storageBucket: "example.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
}

// Use environment variables if available, otherwise use default config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultConfig.appId,
}

// Initialize Firebase
let app
let auth
let db
let storage

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} catch (error) {
  console.error("Firebase initialization error:", error)

  // Create dummy implementations for server-side rendering
  auth = {
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase not initialized")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase not initialized")),
    signOut: () => Promise.reject(new Error("Firebase not initialized")),
  }

  db = {}
  storage = {}
}

export { auth, db, storage }
