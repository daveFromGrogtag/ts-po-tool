import { db } from "./firebase/init.js"
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function saveOrder() {
    console.log("saving order to database...");
    try {
        let orderId = document.getElementById("orderId").innerText
        let poDate = document.getElementById("poDate").innerHTML
        let orderHtml = document.getElementById("content").innerHTML
        let rushCheck = document.getElementById("rush-check").checked
        setDoc(doc(db, "orders", orderId), {
            html: orderHtml,
            status: "open",
            poDate: poDate,
            orderId: orderId,
            rush: rushCheck
        }).then(() => {
            alert("Order saved")
            console.log(`Order ${orderId} saved`);
        })
    } catch (error) {
        console.log(`Order not saved`);
        console.error(error);
    }
}

document.getElementById("saveOrderButton").addEventListener('click', () => {
    saveOrder()
})