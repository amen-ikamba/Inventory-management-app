// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7mhPPbcFicgwpbNiSrVY50C9kIBxplGo",
  authDomain: "inventory-management-app-881be.firebaseapp.com",
  projectId: "inventory-management-app-881be",
  storageBucket: "inventory-management-app-881be.appspot.com",
  messagingSenderId: "498698398780",
  appId: "1:498698398780:web:1e17c99da22c62860fa739",
  measurementId: "G-R2547HP45W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
export { firestore };