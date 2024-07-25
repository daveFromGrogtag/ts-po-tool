import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyBQ3npHe8IjeMRTJZM3C7i7TJRQJGq2tTo",
    authDomain: "ts-po-tool.firebaseapp.com",
    projectId: "ts-po-tool",
    storageBucket: "ts-po-tool.appspot.com",
    messagingSenderId: "480127577081",
    appId: "1:480127577081:web:8cef5af67b200f0d912b28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
// const storage = getStorage(app);

export {auth, db}
