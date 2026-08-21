import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function displayOrderList() {
    const orderList = document.getElementById("orderList")
    const allOrders = query(collection(db, "orders"), orderBy("orderId"), where("status", "not-in", ["closed", "invoiced"]))

    getDocs(allOrders)
        .then((docs) => {
            let stickersCount = 0
            let coastersCount = 0
            let mdfCount = 0
            let magnetCount = 0
            let signCount = 0
            let acrylicCount = 0

            docs.forEach(order => {
                if (order.data().status == "open" || order.data().status == "pending" || order.data().status == "approved") {
                    if (order.data().productType == "stickers") {
                        stickersCount += parseInt(order.data().totalQuantity) 
                    }

                    if (order.data().productType == "coasters") {
                        coastersCount += parseInt(order.data().totalQuantity) 
                    }

                    if (order.data().productType == "acrylic") {
                        acrylicCount += parseInt(order.data().totalQuantity) 
                    }
                    if (order.data().productType == "sign") {
                        signCount += parseInt(order.data().totalQuantity) 
                    }
                }

            })



            const materialsTable = `<div>
            <hr>
            Stickers => ${stickersCount} or ${Math.ceil(stickersCount/4000)} rolls<hr>
            Acrylics => ${acrylicCount} or ${Math.ceil(acrylicCount/100)} small sheets or ${Math.ceil(acrylicCount/400)} full sheets<hr>
            Coasters => ${coastersCount} or ${Math.ceil(coastersCount/25)} boxes<hr>
            Signs => ${signCount} or ${Math.ceil(signCount/25)} full sheets<hr>
            </div>`
            
            orderList.innerHTML = materialsTable
        })
}

displayOrderList()