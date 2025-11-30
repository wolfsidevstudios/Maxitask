import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyALmX4xk9t4PbRK_3MSl3wxMyEayK9tbBI",
    authDomain: "wolfsi-studios.firebaseapp.com",
    projectId: "wolfsi-studios",
    storageBucket: "wolfsi-studios.firebasestorage.app",
    messagingSenderId: "562922803230",
    appId: "1:562922803230:web:46e48da61fdcf019275e0f",
    measurementId: "G-R4C43H88B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics can fail in some environments (e.g. ad blockers), so we wrap it
let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Firebase Analytics failed to initialize", e);
}

export { auth, googleProvider, signInWithPopup, firebaseSignOut, analytics };