import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTu_Bwa5465msaQy2g2dvlsg1V2F3l1N8",
  authDomain: "mobile-web-app-be087.firebaseapp.com",
  projectId: "mobile-web-app-be087",
  storageBucket: "mobile-web-app-be087.firebasestorage.app",
  messagingSenderId: "977622636779",
  appId: "1:977622636779:web:c4aaff2362b15ea24bc6ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
