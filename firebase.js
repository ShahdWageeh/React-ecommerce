import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBKNkgoi7axKxpu1Pm1IicbbcWyd8Ly5pE",
    authDomain: "ecommerce-aeaf9.firebaseapp.com",
    projectId: "ecommerce-aeaf9",
    storageBucket: "ecommerce-aeaf9.firebasestorage.app",
    messagingSenderId: "402771073799",
    appId: "1:402771073799:web:c9c733dcb41590fdc203a2",
    measurementId: "G-KWFY8E3H83"
  };

  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  export const auth = getAuth(app);