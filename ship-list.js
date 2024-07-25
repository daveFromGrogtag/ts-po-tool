import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function displayOrderList() {
    const orderList = document.getElementById("shipList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "==", "shipped"))

    getDocs(allOrders)
        .then((docs) => {
            let orderListElements = '<tr><th>Order Id</th><th>Order Status</th><th>Po Date</th><th>PS</th><th>Tracking</th></tr>'
            docs.forEach(order => {
              let rushStatus = order.data().rush ? " rush" : ""
                let orderLink = `<tr class="${order.data().status}${rushStatus}"><td><a href="./order.html?id=${order.id}">${order.id}</a></td><td>${order.data().status}${rushStatus}</td><td>${order.data().poDate}</td><td><a href="./packing-list.html?id=${order.id}">Slip</a></td><td>${order.data().tracking}</td></tr>`
                orderListElements += orderLink
            })
            orderList.innerHTML = orderListElements
        })
}

displayOrderList()