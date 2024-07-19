// main.js

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';

// Firebase configuration
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

// Handle form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in
        const user = userCredential.user;
        document.getElementById('message').innerHTML = `Signed in as ${user.email}
        <div id="order-list-link"><a href="./order-list.html">View Order List</a></div>`;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('message').textContent = errorMessage;
    }
});

const signOutButton = document.getElementById('signOutBtn')

signOutButton.addEventListener('click', () => {
    signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log('User signed out');
      // Redirect or update UI as needed after sign-out
    })
    .catch((error) => {
      // An error happened.
      console.error('Sign Out Error', error);
    });
  })

onAuthStateChanged(auth, (user) => {
    const orderListLink = document.getElementById('order-list-link')
    const signInCredentials = document.getElementById('sign-in-credentials')

    if (user) {
      // User is signed in
      signInCredentials.style.display = 'none'; // Hide sign-in button
      orderListLink.style.display = 'block'; // Show sign-out button
    } else {
      // User is signed out
      signInCredentials.style.display = 'block'; // Show sign-in button
      orderListLink.style.display = 'none'; // Hide sign-out button
    }
  });