import { db } from "./firebase/init.js"
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

function dataImageUpdate() {
    let imageInput
    // Change Data on Sheet
    document.getElementById('parsed-text').addEventListener('click', function (event) {
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

    // Image selector for Changing Table images
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
        } else if (file.type === 'application/pdf') {
            // Handle PDF files
            console.log('PDF file selected');
            const reader = new FileReader();
            reader.onload = async (e) => {
                const pdfData = new Uint8Array(e.target.result);
                try {
                    const thumbnailDataURL = await pdfToThumbnailDataURL(pdfData);
                    console.log(thumbnailDataURL);
                    // Display the thumbnail somewhere (e.g., set as image source)
                    window.currentImageElement.src = thumbnailDataURL;
                } catch (error) {
                    console.error('Error generating PDF thumbnail:', error);
                    alert('Error generating PDF thumbnail. Please try again.');
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please select a valid image file.');
        }
        imageInput.value = '';
    })
}

function addTrackingData() {
    const trackingNumber = document.getElementById('tracking-number')
    let newTrackingNumber = prompt("Add Tracking Number", trackingNumber.innerText)
    trackingNumber.innerText = newTrackingNumber

//     let trackingDataHtml = `<table>
//     <tr><th>Tracking Info:</th></tr>
//     <tr><td>${trackingInfo}</td></tr>
// </table>`
}

document.getElementById('inProductionButton').addEventListener('click', () => saveOrder('in-production'))
document.getElementById('shippedButton').addEventListener('click',  () => saveOrder('shipped'))
document.getElementById('invoicedButton').addEventListener('click',  () => saveOrder('invoiced'))
document.getElementById('closedButton').addEventListener('click',  () => saveOrder('closed'))


displayOrderInfo()