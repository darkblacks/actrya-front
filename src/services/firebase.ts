import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLUUYLuW3LvJRho36NHWRvwcpCQtwwvig",
  authDomain: "actyra-67a77.firebaseapp.com",
  projectId: "actyra-67a77",
  storageBucket: "actyra-67a77.firebasestorage.app",
  messagingSenderId: "101255932983",
  appId: "1:101255932983:web:b68b9db27d2baba33e23b2",
  measurementId: "G-HL9GEKHG8J",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);