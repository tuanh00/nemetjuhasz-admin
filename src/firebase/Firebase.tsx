// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage

const firebaseConfig = {
  apiKey: "AIzaSyC6WodfYov9ZrLLtCTth2lvjYDO2DRQOII",
  authDomain: "testing-a198b.firebaseapp.com",
  projectId: "testing-a198b",
  storageBucket: "testing-a198b.appspot.com",
  messagingSenderId: "442961509192",
  appId: "1:442961509192:web:7bf20e94d2dd20a4e5917d",
  measurementId: "G-8N7R9N4NSE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export storage
export { serverTimestamp, Timestamp };
