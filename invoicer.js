import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


function markOrderAsInvoiced(orderId) {
    try {
        let orderStatus = "invoiced"
        setDoc(doc(db, "orders", orderId), {
            status: orderStatus,
        },{merge: true}).then(() => {
            window.location.reload();
        })
    } catch (error) {
        alert(`Order not saved`)
        console.error(error);
    }

}

function saveOrder(status) {
    try {
        let orderStatus = status
        let orderId = document.getElementById("order-id-display").innerText
        // let trackingNumber = document.getElementById('tracking-number').innerText ? document.getElementById('tracking-number').innerText : ''
        setDoc(doc(db, "orders", orderId), {
            status: orderStatus,
            // tracking: trackingNumber
        },{merge: true}).then(() => {
            displayOrderInfo()
        })
    } catch (error) {
        alert(`Order not saved`)
        console.error(error);
    }
}

function displayOrderList() {
    const orderList = document.getElementById("orderList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "==", "shipped"))

    getDocs(allOrders)
        .then((docs) => {
            let orderListElements = '<thead><tr><th>Order Id</th><th>QTY</th><th>Product</th><th>Notes</th><th>UPC</th><th>App Date</th><th>Due Date</th><th>Tools</th></tr></thead><tbody>'
            docs.forEach(order => {
              let rushStatus = order.data().rush ? " rush" : ""
                let orderLink = `<tr class="${order.data().status}${rushStatus}"><td><a href="./order.html?id=${order.id}">${order.id}</a></td><td>${order.data().totalQuantity}</td><td>${order.data().productType}</td><td>${order.data().orderNotes?order.data().orderNotes:""}</td><td>${order.data().upc?"UPC":"-"}</td><td>${order.data().approvalDate ? order.data().approvalDate : "-"}</td><td>${order.data().dueDate ? order.data().dueDate : "-"}</td><td><a href="./packing-list.html?id=${order.id}">Slip</a><button class="invoice-button" data-invoice-order-id="${order.id}" >Invoice</button></td></tr>`
                orderListElements += orderLink
            })
            orderListElements + "</tbody>"
            orderList.innerHTML = orderListElements
        }).then(() => {
            document.querySelectorAll(".invoice-button").forEach((orderLine) => {
                orderLine.addEventListener('click', (e)=> {
                    markOrderAsInvoiced(e.target.dataset.invoiceOrderId);
                })
            })
        })
}

displayOrderList()