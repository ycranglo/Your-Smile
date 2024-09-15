import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'; // Import storage for compat version

const firebaseConfig = {
  apiKey: "AIzaSyB41A1pOqi10veTIPjJRQVmBfDySTmM2IM",
  authDomain: "yoursmile-89b3b.firebaseapp.com",
  projectId: "yoursmile-89b3b",
  storageBucket: "yoursmile-89b3b.appspot.com",
  messagingSenderId: "605428971951",
  appId: "1:605428971951:web:0b3bffb30db1be8ea2d75a",
  measurementId: "G-S4W32R8T3R"
};

// Initialize Firebase only if an app has not been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { storage };
