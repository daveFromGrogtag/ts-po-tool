import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, query, collection, getDocs, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

function displayOrderList() {
    const orderList = document.getElementById("orderList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "!=", "closed"))

    getDocs(allOrders)
        .then((docs) => {
            let orderListElements = '<tr><th>Order Id</th><th>Order Status</th><th>Po Date</th></tr>'
            docs.forEach(order => {
                let orderLink = `<tr class="${order.data().status}"><td><a href="./order.html?id=${order.id}">${order.id}</a></td><td>${order.data().status}</td><td>${order.data().poDate}</td></tr>`
                orderListElements += orderLink
            })
            orderList.innerHTML = orderListElements
        })
}

displayOrderList()

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