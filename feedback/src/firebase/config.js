// // src/firebase/config.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // const firebaseConfig = {
// //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
// //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
// //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
// //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// //   measurementId:import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// // };
// const firebaseConfig = {
//     apiKey: "AIzaSyBJtV7gZN1N-vxv9VSDL-tfOLobwqxOA8g",
//     authDomain: "feedback-9a9bf.firebaseapp.com",
//     projectId: "feedback-9a9bf",
//     storageBucket: "feedback-9a9bf.firebasestorage.app",
//     messagingSenderId: "918033905563",
//     appId: "1:918033905563:web:0c94f937e3cd8bc367d33e",
//     measurementId: "G-0YVZYY4P6V"
//   };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJtV7gZN1N-vxv9VSDL-tfOLobwqxOA8g",
  authDomain: "feedback-9a9bf.firebaseapp.com",
  projectId: "feedback-9a9bf",
  storageBucket: "feedback-9a9bf.appspot.com",
  messagingSenderId: "918033905563",
  appId: "1:918033905563:web:0c94f937e3cd8bc367d33e",
  measurementId: "G-0YVZYY4P6V"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
