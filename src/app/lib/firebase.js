import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqA17xjClLymY5Vstm9zhHb4G-QD5Ud5o",
  authDomain: "eucerin-nextjs-app.firebaseapp.com",
  projectId: "eucerin-nextjs-app",
  storageBucket: "eucerin-nextjs-app.appspot.com",
  messagingSenderId: "247179685471",
  appId: "1:247179685471:web:09c173a5f5783bc813b5ea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
