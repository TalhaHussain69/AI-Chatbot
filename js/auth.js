import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

async function saveUserProfile(user, extraData = {}) {
  const userRef = doc(db, "users", user.uid);
  const existingDoc = await getDoc(userRef);

  if (!existingDoc.exists()) {
    await setDoc(userRef, {
      name: user.displayName || extraData.name || "User",
      email: user.email,
      provider: extraData.provider || "email",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } else {
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }
}

export async function signUpWithEmail(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await saveUserProfile(result.user, { name, provider: "email" });
  return result.user;
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await saveUserProfile(result.user, { provider: "email" });
  return result.user;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await saveUserProfile(result.user, { provider: "google" });
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

export function getAuthErrorMessage(errorCode) {
  const errors = {
    "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Please check your connection."
  };
  return errors[errorCode] || "Something went wrong. Please try again.";
}