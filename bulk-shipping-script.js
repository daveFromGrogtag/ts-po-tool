import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; 

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
const db = getFirestore()
  
  // Function to handle file upload
  function handleFileUpload() {
    console.log("CSV...");
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function(event) {
        console.log("Reading file...");
      const csv = event.target.result;
      const rows = csv.split('\n');
      const headers = rows[0].split(',');
      const orderIdIndex = headers.indexOf('OrderId');
      const trackingNumberIndex = headers.indexOf('tracking-number\r');
  
      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',');
        const orderId = columns[orderIdIndex];
        const trackingNumber = columns[trackingNumberIndex];
        // Update Firestore with tracking number
        if (orderId && trackingNumber) {
          updateFirestore(orderId.trim(), trackingNumber.trim());
        } else {
            console.log("Something went wrong...");
        }
      }
    };
  
    reader.readAsText(file);
  }
  
  // Function to update Firestore with tracking number
  function updateFirestore(orderId, trackingNumber) {
    updateDoc(doc(db, "orders", orderId), {
        tracking: trackingNumber,
        status: "shipped"
    })
    .then(() => {
        console.log(`Tracking number updated for order ${orderId}`);
    })
    .catch((error) => {
        console.error(error);
    })
  }

  document.getElementById('csvBulkUpload').addEventListener('click', () => handleFileUpload())
  
  // AUTHENTICATION - - - -

const signOutButton = document.getElementById('signOutBtn')
const signInButton = document.getElementById('googleSignInBtn')

signInButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        // Redirect or handle signed-in user
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  });


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
    if (user) {
      // User is signed in
      signInButton.style.display = 'none'; // Hide sign-in button
      signOutButton.style.display = 'block'; // Show sign-out button
    } else {
      // User is signed out
      signInButton.style.display = 'block'; // Show sign-in button
      signOutButton.style.display = 'none'; // Hide sign-out button
    }
  });