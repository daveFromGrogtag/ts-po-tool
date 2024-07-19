import { db } from "./firebase/init.js"
import { updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  
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