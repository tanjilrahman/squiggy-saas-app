import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBU6dNWMf7_oLVbqenQw9Hq7KpMBwVtXcQ",
    authDomain: "squiggy-saas-project.firebaseapp.com",
    projectId: "squiggy-saas-project",
    storageBucket: "squiggy-saas-project.appspot.com",
    messagingSenderId: "967027251115",
    appId: "1:967027251115:web:1a1f3a55ad9f86974ea4ee"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, auth, functions };