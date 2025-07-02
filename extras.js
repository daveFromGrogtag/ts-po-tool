import { db } from "./firebase/init.js"
import { query, collection, getDocs, where, orderBy, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { uploadFile } from "./firebase/upload-file.js";
import { uploadResizedImage } from "./firebase/upload-resized-image.js";

function convertTimestampToDate(timestamp) {
    // Timestamp is in seconds for some reason so it needs to be converted to ms via multiplication
    const date = new Date(timestamp * 1000);
    return formatDate(date)
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function displayExtrasList() {
    const extrasList = document.getElementById("extrasList")
    const allExtras = query(collection(db, "extras"), where("itemQty", "!=", 0))

    getDocs(allExtras)
        .then((docs) => {
            let extrasListElements = `<tbody>`
            docs.forEach(extra => {
                let extrasLink = `<tr>
                <td>${extra.data().itemId}</td>
                <td>${extra.data().itemLocation}</td>
                <td>${extra.data().itemSize}</td>
                <td>${extra.data().itemVariation}</td>
                <td>${extra.data().itemQty}</td>
                <td><img style="width: auto; height: auto; max-height: 75px; max-width: 75px;"src="${extra.data().itemImageUrl}"/></td>
                <td><a href="./extra-item.html?id=${extra.id}">Edit</a></td>
                </tr>`
                extrasListElements += extrasLink
            })
            extrasListElements + "</tbody>"
            extrasList.innerHTML = extrasListElements
        })
}

function createNewExtras() {

    const extraItemId = document.getElementById('extraItemId').value
    const extraItemLocation = document.getElementById('extraItemLocation').value
    const extraItemSize = document.getElementById('extraItemSize').value
    const extraItemVariation = document.getElementById('extraItemVariation').value
    const extraItemQty = document.getElementById('extraItemQty').value
    const extraItemImageUrl = document.getElementById('extraItemImageUrl').value

    addDoc(collection(db, "extras"), {
        itemId: extraItemId,
        itemLocation: extraItemLocation,
        itemSize: extraItemSize,
        itemVariation: extraItemVariation,
        itemImageUrl: extraItemImageUrl,
        itemQty: parseInt(extraItemQty),
    }).then(() => {
        alert("Extras Saved")
        window.location.reload();
    })
}

function addImageByUrl() {

}

async function pdfToThumbnailDataURL(pdfData) {
    return uploadFile(pdfData)
}

document.getElementById("extraItemImageUrlInput").addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
        console.log("Image");
        const url = await uploadResizedImage(file, 400, 'extras');
        document.getElementById('extraItemImageUrl').value = url
    }

    // if (file && file.type === 'application/pdf') {
    //     const reader = new FileReader()
    //     reader.onload = async (file) => {
    //         const pdfData = new Uint8Array(file);
    //         try {
    //             const thumbnailDataURL = await pdfToThumbnailDataURL(pdfData)
    //             document.getElementById('extraItemImageUrl').value = thumbnailDataURL
    //             console.log("CHANGED");
                
    //         } catch (error) {
    //             console.error('Error generating PDF thumbnail:', error);
    //             alert('Error generating PDF thumbnail. Please try again.');
    //         }
    //     }
    // }

})


document.getElementById("newExtra").addEventListener("click", () => {
    createNewExtras()
})



displayExtrasList()