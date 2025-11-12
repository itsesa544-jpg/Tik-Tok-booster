import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX38y3HlAUMZZ3b6aJGrk7mZOvgBtkHH4",
  authDomain: "smmpanel-f614e.firebaseapp.com",
  databaseURL: "https://smmpanel-f614e-default-rtdb.firebaseio.com",
  projectId: "smmpanel-f614e",
  storageBucket: "smmpanel-f614e.appspot.com",
  messagingSenderId: "213883233645",
  appId: "1:213883233645:web:a6ebefd96f2a2baaf26664"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
