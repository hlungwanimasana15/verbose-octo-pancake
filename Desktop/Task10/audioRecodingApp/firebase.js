import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o",
  authDomain: "audiorecorder-9bb5e.firebaseapp.com",
  projectId: "audiorecorder-9bb5e",
  storageBucket: "audiorecorder-9bb5e.appspot.com",
  messagingSenderId: "450332404809",
  appId: "1:450332404809:web:5f300b2058920021a4a398",
  measurementId: "G-K1K5T4M7F7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)


export { auth , db , storage};