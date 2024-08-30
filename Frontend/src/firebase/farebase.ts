import { FirebaseOptions, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCh9B5eMqmqKd8f80z569_P_NqGwSNTUKA",
  authDomain: "instant-socialmedia.firebaseapp.com",
  projectId: "instant-socialmedia",
  storageBucket: "instant-socialmedia.appspot.com",
  messagingSenderId: "292297547500",
  appId: "1:292297547500:web:acd771a3d1bd986cfe0fc9",
};

export const app = initializeApp(firebaseConfig);
