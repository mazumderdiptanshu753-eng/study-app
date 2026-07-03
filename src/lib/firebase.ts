import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  projectId: "diesel-bison-wlkqp",
  appId: "1:1071779979064:web:0b14420eabbb922961abcd",
  apiKey: "AIzaSyDELo1hxSTkvTwkcisFn03ACyBsQte2knw",
  authDomain: "diesel-bison-wlkqp.firebaseapp.com",
  storageBucket: "diesel-bison-wlkqp.firebasestorage.app",
  messagingSenderId: "1071779979064",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
