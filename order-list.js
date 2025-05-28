import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function displayOrderList() {
    const orderList = document.getElementById("orderList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "!=", "closed"))

    getDocs(allOrders)
        .then((docs) => {
            let orderListElements = '<thead><tr><th>Order Id</th><th>Order Status</th><th>QTY</th><th>Product</th><th>Notes</th><th>UPC</th><th>App Date</th><th>Due Date</th><th>Packing Slip</th></tr></thead><tbody>'
            docs.forEach(order => {
              let rushStatus = order.data().rush ? " rush" : ""
                let orderLink = `<tr class="${order.data().status}${rushStatus}"><td><a href="./order.html?id=${order.id}">${order.id}</a></td><td>${order.data().status}${rushStatus}</td><td>${order.data().totalQuantity}</td><td>${order.data().productType}</td><td>${order.data().orderNotes?order.data().orderNotes:""}</td><td>${order.data().upc?"UPC":"-"}</td><td>${order.data().approvalDate ? order.data().approvalDate : "-"}</td><td>${order.data().dueDate ? order.data().dueDate : "-"}</td><td><a href="./packing-list.html?id=${order.id}">Slip</a></td></tr>`
                orderListElements += orderLink
            })
            orderListElements + "</tbody>"
            orderList.innerHTML = orderListElements
        })
}

function displayReprints() {
    const allReprints = query(collection(db, "reprints"), where("status", "==", "open"))
    let reprintQty = 0
    getDocs(allReprints)
        .then((docs) => {
            docs.forEach(reprint => {
                reprintQty = reprintQty + parseInt(reprint.data().qty)
            })
            if (reprintQty > 0) {
                document.getElementById('reprintTool').innerHTML = `
                <div class="reprint-alert">Reprints - Qty: ${reprintQty} - <a href="./reprints.html">Reprints</a></div>
                `
            }
        })
}

displayOrderList()
displayReprints()