import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function displayOrderList() {
    const orderList = document.getElementById("orderList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "!=", "closed"))

    getDocs(allOrders)
        .then((docs) => {
            let orderListElements = '<tr><th>Order Id</th><th>Order Status</th><th>QTY</th><th>Product</th><th>UPC</th><th>App Date</th><th>Due Date</th><th>Packing Slip</th></tr>'
            docs.forEach(order => {
              let rushStatus = order.data().rush ? " rush" : ""
                let orderLink = `<tr class="${order.data().status}${rushStatus}"><td><a href="./order.html?id=${order.id}">${order.id}</a></td><td>${order.data().status}${rushStatus}</td><td>${order.data().totalQuantity}</td><td>${order.data().productType}</td><td>${order.data().upc?"UPC":"-"}</td><td>${order.data().approvalDate ? order.data().approvalDate : "-"}</td><td>${order.data().dueDate ? order.data().dueDate : "-"}</td><td><a href="./packing-list.html?id=${order.id}">Slip</a></td></tr>`
                orderListElements += orderLink
            })
            orderList.innerHTML = orderListElements
        })
}

displayOrderList()