import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCLHkkanBUxtxXo3qDptkPjBTrljJc-WL4",
//   authDomain: "embed-123.firebaseapp.com",
//   projectId: "embed-123",
//   storageBucket: "embed-123.firebasestorage.app",
//   messagingSenderId: "287040135516",
//   appId: "1:287040135516:web:dc02a1ded50fa622322199",
//   databaseURL:
//     "https://embed-123-default-rtdb.asia-southeast1.firebasedatabase.app/",
// };

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  databaseURL:
    "https://esp32-firebase-ea973-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const app = initializeApp(firebaseConfig);
