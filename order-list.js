import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, query, collection, getDocs, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // Add firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore()

function displayOrderList() {
    const orderList = document.getElementById("orderList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "!=", "closed"))

    getDocs(allOrders)
        .then((docs) => {
            let orderListElements = '<tr><th>Order Id</th><th>Order Status</th><th>Po Date</th></tr>'
            docs.forEach(order => {
                let orderLink = `<tr><td><a href="./order.html?id=${order.id}">${order.id}</a></td><td>${order.data().status}</td><td>${order.data().poDate}</td></tr>`
                orderListElements += orderLink
            })
            orderList.innerHTML = orderListElements
        })
}

displayOrderList()