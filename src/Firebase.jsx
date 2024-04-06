import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBGqSwWKDVDkPaJ4nflpdBkoPYd2v7TkJk",

  authDomain: "front-end-projects-5b17d.firebaseapp.com",

  projectId: "front-end-projects-5b17d",

  storageBucket: "front-end-projects-5b17d.appspot.com",

  messagingSenderId: "341960427936",

  appId: "1:341960427936:web:7b7820e2bf64fa8505bcc5",

  measurementId: "G-MQC11JEBRP"

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



