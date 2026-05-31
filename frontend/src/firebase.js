import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyCTHvdMyrkMpQL6n71mZmmDN1-zFw0OwHc",

  authDomain: "knowledge-based-faq.firebaseapp.com",

  projectId: "knowledge-based-faq",

  storageBucket: "knowledge-based-faq.appspot.com",

  messagingSenderId: "794160114637",

  appId: "1:794160114637:web:23d73ef97addb7c9ef3284"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();