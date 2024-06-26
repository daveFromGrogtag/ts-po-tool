import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

function getQueryParamValue(paramName) {
    let url = window.location.href;
    // Create a URL object
    let urlObj = new URL(url);

    // Use the URLSearchParams API to get the value of the parameter
    let params = new URLSearchParams(urlObj.search);

    // Return the value of the specified parameter
    return params.get(paramName);
}

function saveOrder() {
    try {
        let orderId = document.getElementById("orderId").innerText
        let orderHtml = document.getElementById("content").innerHTML
        let orderStatus = document.getElementById("order-status").value
        let poDate = document.getElementById("poDate").innerHTML
        setDoc(doc(db, "orders", orderId), {
            html: orderHtml,
            status: orderStatus,
            poDate: poDate,
            orderId: orderId
        }).then(() => {
            alert(`Order ${orderId} saved`)
        })
    } catch (error) {
        alert(`Order not saved`)
        console.error(error);
    }
}

function displayOrderInfo() {
    let orderId = getQueryParamValue("id")
    const orderInfo = document.getElementById("content")
    const orderStatus = document.getElementById("order-status")
    getDoc(doc(db, "orders", orderId)).then((doc) => {
        orderInfo.innerHTML = doc.data().html
        orderStatus.value = doc.data().status
        dataImageUpdate()
    })
}

document.getElementById("saveOrderButton").addEventListener('click', () => {
    console.log("saving order to database...");
    saveOrder()
    console.log("Order saved.");
})
document.getElementById("exportTableToExcel").addEventListener('click', () => {
    console.log("exporting order as XLSX...");
    exportTableToExcel('item-data-table')
})


function exportTableToExcel(tableID) {
    // Select the table
    let filename = document.getElementById('orderId').innerText
    var table = document.getElementById(tableID);
    var workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, filename ? filename + '.xlsx' : 'exported_table.xlsx');
}

function dataImageUpdate() {
    let imageInput
        // Change Data on Sheet
    document.getElementById('parsed-text').addEventListener('click', function(event) {
        // Change table values
        if (event.target.tagName.toLowerCase() === 'td') {
            console.log(event.target.innerText);
            event.target.innerText = prompt("Change Field", event.target.innerText)
                // changeTextModal(event.target.innerText, event)
        }
        // Change table images
        if (event.target.tagName.toLowerCase() === 'img') {
            window.currentImageElement = event.target;
            imageInput = document.getElementById('image-selector')
            imageInput.click()
            console.log(event.target);
        }
    });

    // Image selector for Chaning Table images
    document.getElementById('image-selector').addEventListener('change', () => {
        console.log('Selecting New Image');
        const file = imageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            console.log('Image is type image');
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e.target.result);
                window.currentImageElement.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
        imageInput.value = '';
    })
}

displayOrderInfo()

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