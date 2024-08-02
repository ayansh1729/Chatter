import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBhqMIZq6Ta8i3QteTupZ2PtviLGmlEuv4",

  authDomain: "front-end-f93cd.firebaseapp.com",

  projectId: "front-end-f93cd",

  storageBucket: "front-end-f93cd.appspot.com",

  messagingSenderId: "251844070548",

  appId: "1:251844070548:web:ca13e16994085e8097b881",

  measurementId: "G-MCBXBT6K39"

};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(firebaseApp);

// Get Auth instance
const auth = getAuth();

// Create GoogleAuthProvider instance
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;



