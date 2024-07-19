import { db } from "./firebase/init.js"
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function getQueryParamValue(paramName) {
    let url = window.location.href;
    // Create a URL object
    let urlObj = new URL(url);
    // Use the URLSearchParams API to get the value of the parameter
    let params = new URLSearchParams(urlObj.search);
    // Return the value of the specified parameter
    return params.get(paramName);
}

function saveOrder(status) {
    try {
        let orderStatus = status
        let orderId = document.getElementById("order-id-display").innerText
        // let trackingNumber = document.getElementById('tracking-number').innerText ? document.getElementById('tracking-number').innerText : ''
        setDoc(doc(db, "orders", orderId), {
            status: orderStatus,
            // tracking: trackingNumber
        }).then(() => {
            displayOrderInfo()
        })
    } catch (error) {
        alert(`Order not saved`)
        console.error(error);
    }
}

function displayOrderInfo() {
    let orderId = getQueryParamValue("id")
    const orderStatus = document.getElementById("order-status-display")
    const orderIdDisplay = document.getElementById('order-id-display')
    orderIdDisplay.innerText = orderId
    getDoc(doc(db, "orders", orderId)).then((doc) => {
        orderStatus.innerText = doc.data().status
    })
}

document.getElementById('inProductionButton').addEventListener('click', () => saveOrder('in-production'))
document.getElementById('shippedButton').addEventListener('click',  () => saveOrder('shipped'))
document.getElementById('invoicedButton').addEventListener('click',  () => saveOrder('invoiced'))
document.getElementById('closedButton').addEventListener('click',  () => saveOrder('closed'))

displayOrderInfo()
