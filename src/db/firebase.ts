// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB43Pk0ZqTPZw9dScVOt8mWngM6KdwyA0c",
  authDomain: "blog-with-tags.firebaseapp.com",
  projectId: "blog-with-tags",
  storageBucket: "blog-with-tags.appspot.com",
  messagingSenderId: "382914189767",
  appId: "1:382914189767:web:336865ffbac506c2c121e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
