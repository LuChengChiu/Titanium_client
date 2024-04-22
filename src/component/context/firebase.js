import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const app = initializeApp({
//   apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_APIKEY,
//   authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECTID,
//   storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGINGSENDERID,
//   appId: import.meta.env.VITE_REACT_APP_FIREBASE_APPID,
//   measurementId: import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENTID,
// });

const app = initializeApp({
  apiKey: "AIzaSyCsWeoPQu7tXwWFtE4aoWyhgBrltXOAMjI",
  authDomain: "e-commerce-website-titanium.firebaseapp.com",
  projectId: "e-commerce-website-titanium",
  storageBucket: "e-commerce-website-titanium.appspot.com",
  messagingSenderId: "977860356475",
  appId: "1:977860356475:web:38dae7672eaa325aab35de",
  measurementId: "G-8S6GL9ZPN5",
});

export const auth = getAuth(app);
export default app;
