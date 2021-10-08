import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyBmLK30pAOnfUcPJVxpSUUZ9d4oToqa4aw",
  authDomain: "bookkay-dev.firebaseapp.com",
  projectId: "bookkay-dev",
  storageBucket: "bookkay-dev.appspot.com",
  messagingSenderId: "833420091386",
  appId: "1:833420091386:web:cffb36e548d4c4ecb88e43",
};

const app = initializeApp(firebaseConfig);
let db = getFirestore(app);

export default db;
