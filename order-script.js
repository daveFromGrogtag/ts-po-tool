import { db } from "./firebase/init.js"
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { uploadFile } from "./firebase/upload-file.js";

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
        let rushCheck = document.getElementById("rush-check").checked
        let trackingInfo = document.getElementById("tracking-number").innerHTML
        let totalPrice = document.getElementById("total-price").innerText
        let totalQuantity = document.getElementById("total-quantity").innerText
        let dueDate = document.getElementById("dueDateInput") ? document.getElementById("dueDateInput").value : "-"
        let approvalDate = document.getElementById("approvalDateInput") ? document.getElementById("approvalDateInput").value : "-"

        updateDoc(doc(db, "orders", orderId), {
            html: orderHtml,
            status: orderStatus,
            poDate: poDate,
            orderId: orderId,
            rush: rushCheck,
            tracking: trackingInfo,
            totalPrice: totalPrice,
            totalQuantity: totalQuantity,
            dueDate: dueDate,
            approvalDate: approvalDate
        }).then(() => {
            alert(`Order ${orderId} saved`)
        })
    } catch (error) {
        alert(`Order not saved`)
        console.error(error);
    }
}

function dueDateChanger() {
    try {
        document.getElementById("dueDate").addEventListener('change', (e) => {
            console.log(e.target.value)
            e.target.setAttribute('value', e.target.value)
        })
    } catch (error) {
        
    }
}

function approvalDateChanger() {
    try {
        document.getElementById("approvalDate").addEventListener('change', (e) => {
            console.log(e.target.value)
            e.target.setAttribute('value', e.target.value)
        })
    } catch (error) {
        
    }
}


function dateCalculation() {
    let turnDays;
    const today = new Date();
    let turnTimeDay = new Date(today);

    if (parseInt(document.getElementById('total-quantity').innerText.replace(/,/g, '')) >= 2000) {
        turnDays = 7
    } else {
        turnDays = 4
    }


    // Function to add weekdays
    function addWeekdays(startDate, numWeekdays) {
        let currentDate = new Date(startDate);
        let daysAdded = 0;

        while (daysAdded < numWeekdays) {
            currentDate.setDate(currentDate.getDate() + 1);
            // Check if the current day is a weekday (Monday to Friday)
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                daysAdded++;
            }
        }

        return currentDate;
    }


    turnTimeDay = addWeekdays(today, turnDays);

    if (document.getElementById("approvalDateInput").value === '') {
        document.getElementById('approvalDateInput').valueAsDate = today;
        document.getElementById('approvalDateInput').setAttribute('value', document.getElementById('approvalDateInput').value)
    }

    if (document.getElementById("dueDateInput").value === '') {
        document.getElementById('dueDateInput').valueAsDate = turnTimeDay;
        document.getElementById('dueDateInput').setAttribute('value', document.getElementById('dueDateInput').value)
    }
}

function displayOrderInfo() {
    let orderId = getQueryParamValue("id")
    const orderInfo = document.getElementById("content")
    const orderStatus = document.getElementById("order-status")
    const rushCheck = document.getElementById("rush-check")
    getDoc(doc(db, "orders", orderId)).then((doc) => {
        orderInfo.innerHTML = doc.data().html
        orderStatus.value = doc.data().status
        rushCheck.checked = doc.data().rush
        dataImageUpdate()
        dueDateChanger()
        approvalDateChanger()
    })
    .then(
        getDoc(doc(db, "orders", orderId)).then((doc) => {
            document.getElementById("tracking-number").innerHTML = doc.data().tracking
        })
    )

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
// document.getElementById("addQrCodeButton").addEventListener('click', () => {
//     console.log("Adding QR Code...");
//     createQrCode()
// })
document.getElementById("addTracking").addEventListener('click', () => {
    console.log("adding Tracking Info...");
    addTrackingData()

})
document.getElementById("order-status").addEventListener('change', (e) => {
    if (e.target.value == 'approved') {
        dateCalculation()
    }
    
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

    document.getElementById('po-data').addEventListener('click', function (event) {
        // Change table values
        if (event.target.tagName.toLowerCase() === 'td') {
            console.log(event.target.innerText);
            event.target.innerText = prompt("Change Field", event.target.innerText)
            // changeTextModal(event.target.innerText, event)
        }
    });

    document.getElementById('po-total').addEventListener('click', function (event) {
        // Change table values
        if (event.target.tagName.toLowerCase() === 'td') {
            console.log(event.target.innerText);
            event.target.innerText = prompt("Change Field", event.target.innerText)
            // changeTextModal(event.target.innerText, event)
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

async function pdfToThumbnailDataURL(pdfData) {
    return uploadFile(pdfData)
    // // Load PDF using PDF.js
    // const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    // const pdf = await loadingTask.promise;

    // // Fetch the first page
    // const pageNumber = 1;
    // const page = await pdf.getPage(pageNumber);

    // // Set desired thumbnail size
    // const thumbnailWidth = 100;  // Adjust width as needed
    // const viewport = page.getViewport({ scale: 1 });
    // const scale = thumbnailWidth / viewport.width;
    // const scaledViewport = page.getViewport({ scale });

    // // Create canvas element
    // const canvas = document.createElement('canvas');
    // const context = canvas.getContext('2d');
    // canvas.width = scaledViewport.width;
    // canvas.height = scaledViewport.height;

    // // Render PDF page on canvas
    // const renderContext = {
    //     canvasContext: context,
    //     viewport: scaledViewport
    // };
    // await page.render(renderContext).promise;

    // // Convert canvas to PNG data URL
    // const dataURL = canvas.toDataURL('image/png');

    // return dataURL;
}

function createQrCode() {
    let orderId = getQueryParamValue("id")
    let qrcodearea = document.getElementById('qrcode')
    new QRCode("qrcode", {
        text: `https://davefromgrogtag.github.io/ts-po-tool/order-status-changer.html?id=${orderId}`,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

displayOrderInfo()
createQrCode()
