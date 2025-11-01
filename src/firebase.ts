import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyARay7IFijH9KQ7fFiuhx02jq5t9eumrzs",
  authDomain: "squareup-2716c.firebaseapp.com",
  projectId: "squareup-2716c",
  storageBucket: "squareup-2716c.firebasestorage.app",
  messagingSenderId: "846124704727",
  appId: "1:846124704727:web:778071fad3637e0e852192",
  databaseURL: "https://squareup-2716c-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
export { db, app, auth };
