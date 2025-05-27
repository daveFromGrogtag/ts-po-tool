import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function convertTimestampToDate(timestamp) {
    // Timestamp is in seconds for some reason so it needs to be converted to ms via multiplication
  const date = new Date(timestamp * 1000);
return formatDate(date)
}

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function displayReprintList() {
    const reprintList = document.getElementById("reprintList")
    const allReprints = query(collection(db, "reprints"), where("status", "!=", "closed"))

    getDocs(allReprints)
        .then((docs) => {
            let reprintListElements = `<thead>
            <tr>
            <th>Order Id</th>
            <th>Item Id</th>
            <th>Status</th>
            <th>QTY</th>
            <th>Notes</th>
            <th>Submit Date</th>
            <th>Actions</th>
            </tr>
            </thead><tbody>`
            docs.forEach(reprint => {
                let reprintLink = `<tr>
                <td>${reprint.data().orderId}</td>
                <td>${reprint.data().itemId}</td>
                <td>${reprint.data().status}</td>
                <td>${reprint.data().qty}</td>
                <td>${reprint.data().notes}</td>
                <td>${convertTimestampToDate(reprint.data().reprintRequested["seconds"])}</td>
                <td><button class="reprint-printed" data-reprint-id=${reprint.id}>Printed</button><button class="reprint-closed" data-reprint-id=${reprint.id}>Close</button></td>
                </tr>`
                reprintListElements += reprintLink
            })
            reprintListElements + "</tbody>"
            reprintList.innerHTML = reprintListElements
        }).finally(() => {
            document.querySelectorAll(".reprint-printed").forEach(printButton => {
                printButton.addEventListener('click', (e) => {
                    printReprint(printButton.dataset.reprintId)
                })
            })
            document.querySelectorAll(".reprint-closed").forEach(closeButton => {
                closeButton.addEventListener('click', (e) => {
                    closeReprint(closeButton.dataset.reprintId)
                })
            })
        })
}

function createNewReprints() {
    const reprintOrderId = document.getElementById('reprintOrderId').value
    const reprintItemId = document.getElementById('reprintItemId').value
    const reprintNotes = document.getElementById('reprintNotes').value
    const reprintQty = document.getElementById('reprintQty').value

    addDoc(collection(db, "reprints"), {
        orderId: reprintOrderId,
        itemId: reprintItemId,
        notes: reprintNotes,
        qty: parseInt(reprintQty),
        status: "open",
        reprintRequested: new Date()
    }).then(() => {
        alert("Reprint Saved")
        window.location.reload();
    })
}

function printReprint(reprintId) {
    // alert(reprintId)
    updateDoc(doc(db, "reprints", reprintId), {
        status: "printed"
    }).then(() => {
        alert("Set to print")
        window.location.reload();
    })
}

function closeReprint(reprintId) {
    // alert(reprintId)
    updateDoc(doc(db, "reprints", reprintId), {
        status: "closed"
    }).then(() => {
        alert("Set to closed")
        window.location.reload();
    })
}

document.getElementById("newReprint").addEventListener("click", () => {
    createNewReprints()
})




displayReprintList()