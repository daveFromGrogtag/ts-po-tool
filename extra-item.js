import { db } from "./firebase/init.js"
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { uploadFile } from "./firebase/upload-file.js";

let currentQty;

function getQueryParamValue(paramName) {
    let url = window.location.href;
    // Create a URL object
    let urlObj = new URL(url);

    // Use the URLSearchParams API to get the value of the parameter
    let params = new URLSearchParams(urlObj.search);

    // Return the value of the specified parameter
    return params.get(paramName);
}

function displayExtraData() {
    try {
        let extraId = getQueryParamValue("id")
        const extraItemId = document.getElementById('extraItemId')
        const extraItemLocation = document.getElementById('extraItemLocation')
        const extraItemSize = document.getElementById('extraItemSize')
        const extraItemVariation = document.getElementById('extraItemVariation')
        const extraItemQty = document.getElementById('extraItemQty')
        const extraItemImage = document.getElementById('extraItemImage')


        getDoc(doc(db, "extras", extraId)).then((doc) => {
            extraItemId.innerHTML = doc.data().itemId
            extraItemLocation.innerHTML = doc.data().itemLocation
            extraItemSize.innerHTML = doc.data().itemSize
            extraItemVariation.innerHTML = doc.data().itemVariation
            extraItemQty.innerHTML = doc.data().itemQty
            extraItemImage.innerHTML = `<img src="${doc.data().itemImageUrl}">`
            currentQty = doc.data().itemQty
        })
    } catch (error) {
        
    }
}

function extraAddQuantity() {
    let extraId = getQueryParamValue("id")
    const changeQty = parseInt(document.getElementById('extraChangeQty').value)
    const newQuantity = parseInt(currentQty) + changeQty
    try {
        updateDoc(doc(db, "extras", extraId), {
            itemQty: newQuantity
        }).then(() => {
            alert("Extras added")
            window.location.reload();
        })
    } catch (error) {
        alert("Error! Not added")
        console.error(error);
    }
}

function extraRemoveQuantity() {
    let extraId = getQueryParamValue("id")
    const changeQty = parseInt(document.getElementById('extraChangeQty').value)
    const newQuantity = parseInt(currentQty) - changeQty

    
    try {
        updateDoc(doc(db, "extras", extraId), {
            itemQty: newQuantity
        }).then(() => {
            alert("Extras removed")
            window.location.reload();
        })
    } catch (error) {
        alert("Error! Not added")
        console.error(error);
    }
}

document.getElementById("extraAddQty").addEventListener('click', () => {
    extraAddQuantity()
})

document.getElementById("extraRemoveQty").addEventListener('click', () => {
    extraRemoveQuantity()
})

displayExtraData()