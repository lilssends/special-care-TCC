// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 COLE AQUI SEU CONFIG DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCv927VlX6-cGu_y3teLuNc5UNQMg7HuEA",
  authDomain: "special-care-a0a64.firebaseapp.com",
  projectId: "special-care-a0a64",
  storageBucket: "special-care-a0a64.firebasestorage.app",
  messagingSenderId: "509219146992",
  appId: "1:509219146992:web:6c5695f0e4cd6362a3c635"
};

// Inicializa
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);