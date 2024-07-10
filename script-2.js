function removeEmptyStrings(arr) {
    return arr.filter(function(item) {
        return item !== "";
    });
}

function countRows(arr) {
    const regex = /[A-z0-9]{4,}-[A-z0-9]{4,}-[A-z0-9]{4,}/
    return arr.reduce((count, item) => {
        if (regex.test(item)) {
            count++;
        }
        return count;
    }, 0);
}

function countColumns(arr) {
    let rowCount = countRows(arr);
    let cellCount = arr.length;
    let columnCount = cellCount / rowCount
    return columnCount
}

function joinWithLineBreaks(arr, itemsPerLine) {
    let result = '';

    for (let i = 0; i < arr.length; i++) {
        result += arr[i];

        if ((i + 1) % itemsPerLine === 0 && i !== arr.length - 1) {
            result += '\n';
        } else if (i !== arr.length - 1) {
            result += ',';
        }
    }

    return result;
}

function joinAsHtmlTable(arr, itemsPerLine) {
    let result = '<tr>';
    if (itemsPerLine === 6) {
        result = '<tr><th>Size</th><th>SKU</th><th>OS</th><th>Total</th><th>Price</th><th>Extended</th><th>Image</th><th>Notes</th></tr><tr>'
    }
    if (itemsPerLine === 8) {
        result = '<tr><th>Size</th><th>SKU</th><th>OS</th><th>Total</th><th>Price</th><th>Extended</th><th>UPC-Number</th><th>UPC-Price</th><th>Image</th><th>Notes</th></tr><tr>'
    }
    for (let i = 0; i < arr.length; i++) {
        result += `<td>${arr[i]}</td>`;


        if ((i + 1) % itemsPerLine === 0 && i !== arr.length - 1) {
            result += '<td><div class="table-image"><img src="./No-Image-01.png"></div></td><td></td></tr><tr>';
        } else if ((i + 1) % itemsPerLine === 0 && i === arr.length - 1) {
            result += '<td><div class="table-image"><img src="./No-Image-01.png"></div></td><td></td></tr>';
        } else if (i !== arr.length - 1) {
            result += '';
        }
    }
    return `<table id="item-data-table">${result}</table>`
}

function textParse(text) {
    let tableRegex = /Description [\w $\.\-]{1,}/;
    let tableHeaderRegex = /Description [\w $]{1,} Extended/
    let tableText = text.match(tableRegex);
    let tableHeaderText = text.match(tableHeaderRegex)
    let tableTotalRegex = /Total [\w \.]{1,}/
    let tableAdditionalInstructionsRegex = /Additional Notes[\w \:\.\-]{0,}/
    let tableBodyText = tableText[0].replace(tableHeaderRegex, "").replace(tableTotalRegex, "").replace(tableAdditionalInstructionsRegex, "")
    let tableBodyArray = removeEmptyStrings(tableBodyText.split(" "))
    return tableBodyArray
}

function pageSplit(text) {
    getPoData(text);
    let combinedArray = []
    let perPage = removeEmptyStrings(text.split('\n\n'))
    perPage.map(pageText => combinedArray = combinedArray.concat(textParse(pageText)))
    let columnCount = countColumns(combinedArray);
    let csvFormat = joinWithLineBreaks(combinedArray, columnCount)
    let formattedTable = joinAsHtmlTable(combinedArray, columnCount)
        // downloadTextFile('test.csv', csvFormat)

    document.getElementById('parsed-text').innerHTML = formattedTable;
}

function findBetween(text, startPattern, endPattern) {
    const startMatch = text.match(startPattern);
    const endMatch = text.match(endPattern);
    if (startMatch && endMatch) {
        const startIndex = startMatch.index + startMatch[0].length;
        const endIndex = endMatch.index;
        const extractedText = text.substring(startIndex, endIndex).trim();
        // console.log(extractedText);
        return extractedText
    } else {
        console.log("Start or end pattern not found.");
    }
}

function getPoData(text) {

    const orderNumberRegex = /Order#[ ]{1,}[\w\d]{1,}/
    const poDateRegex = /PO Date[ ]{1,}[\w\d\/]{1,}/
    const vendorRegex = /Vendor#[ ]{1,}[\w\d]{1,}/
    const enteredByRegex = /Entered By[ ]{1,}[\w\d]{1,}/
    const additionalInstructionsRegex = /Additional Notes[\w \:\.\-]{0,}/
    const tableTotalRegex =/Total[\s]{1,}[0-9]{1,}[\s]{1,}[0-9.0]{1,}/

    let orderNumber = text.match(orderNumberRegex)[0].replace(/Order#[ ]{1,}/, "")
    let poDate = text.match(poDateRegex)[0].replace(/PO Date[ ]{1,}/, "")
    let vendor = text.match(vendorRegex)[0].replace(/Vendor#[ ]{1,}/, "")
    let enteredBy = text.match(enteredByRegex)[0].replace(/Entered By[ ]{1,}/, "")
    let additionalInstructions = text.match(additionalInstructionsRegex) ? text.match(additionalInstructionsRegex)[0].replace(/Total [\w \.]{1,}/, "").replace(/Additional Notes:[ ]{0,}/, "") : ""
    let tableTotal = text.match(tableTotalRegex)[0].split(/[\s]{1,}/)
    let tableTotalQty = tableTotal[1]
    let tableTotalPrice = tableTotal[2] ? `$${tableTotal[2]}` : ''

    const startShipToRegex = /Ship To: [ ]{0,}/;
    const endShipToRegex = /[]{0,} Ship Date/;
    let shipTo = findBetween(text, startShipToRegex, endShipToRegex)
    let shipToFormatted = shipTo.replaceAll("  ", "<br>")

    const startInfoRegex = /Phone/
    const endInfoRegex = /Description/

    let infoString = findBetween(text, startInfoRegex, endInfoRegex)
    let shipDate = infoString.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{2,4}/)
    let expectedOn = infoString.replace(/[0-9]{2}\/[0-9]{2}\/[0-9]{2,4}/, "").match(/[0-9]{2}\/[0-9]{2}\/[0-9]{2,4}/)
    let terms = infoString.match(/Net [0-9]{1,} Days/)
    let shipVia = infoString.replace(/[0-9]{2}\/[0-9]{2}\/[0-9]{2,4}[\s]{1,}[0-9]{2}\/[0-9]{2}\/[0-9]{2,4}[\s]{1,}Net [0-9]{1,} Days/, "").replace(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, "")
    let phone = infoString.match(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)
    

    let poHeaderHtml = `<h2>${orderNumber}</h2>`

    let poDataHtml = `<table>
    <tr><th>PoNumber:</th><td id="orderId">${orderNumber}</td></tr>
    <tr><th>PO Date:</th><td id="poDate">${poDate}</td></tr>
    <tr><th>Vendor:</th><td>${vendor}</td></tr>
    <tr><th>Entered By:</th><td>${enteredBy}</td></tr>
    <tr><th>Ship Date:</th><td id="shipDate">${shipDate}</td></tr>
    <tr><th>Expected:</th><td>${expectedOn}</td></tr>
    <tr><th>Terms:</th><td>${terms}</td></tr>
    <tr><th>Ship Via:</th><td>${shipVia}</td></tr>
    <tr><th>Phone:</th><td>${phone?phone:""}</td></tr>
    </table>`

    let shipDataHtml = `<table>
    <tr><th>Ship To:</th></tr>
    <tr><td>${shipToFormatted}</td></tr>
</table>`

    let additionalInstructionsHtml = `<table>
    <tr><th>Additional Instructions:</th></tr>
    <tr><td>${additionalInstructions}</td></tr>
</table>`

    let poTotalHtml = `<table>
    <tr><th>Quantity</th><th>Total</th></tr>
    <tr><td>${tableTotalQty}</td><td>${tableTotalPrice}</td></tr>
    </table>`

    document.getElementById('po-header').innerHTML = poHeaderHtml
    document.getElementById('po-data').innerHTML = poDataHtml
    document.getElementById('shipping-info').innerHTML = shipDataHtml
    document.getElementById('additional-instructions').innerHTML = additionalInstructionsHtml
    document.getElementById('po-total').innerHTML = poTotalHtml

}

function downloadTextFile(filename, text) {
    // Create a new Blob object using the text
    const blob = new Blob([text], { type: 'text/plain' });
    // Create a link element
    const link = document.createElement('a');
    // Create an object URL for the Blob
    const url = URL.createObjectURL(blob);
    // Set the link's href to the object URL
    link.href = url;
    // Set the download attribute to the desired file name
    link.download = filename;
    link.innerText = filename;
    // Append the link to the body (this is necessary for some browsers)
    document.getElementById('csv-link').appendChild(link);
    // Programmatically click the link to trigger the download
    // link.click();
    // Remove the link from the document
    // document.body.removeChild(link);
    // Revoke the object URL to free up resources
    // URL.revokeObjectURL(url);
}

// function changeTextModal(text, outerEvent) {
//     const changeModal = document.getElementById('change-text-modal')
//     const changeInput = document.getElementById('change-text-input')
//     const changeButton = document.getElementById('change-text-button')
//     changeInput.value = text
//     changeModal.classList.toggle('hidden')
//     changeButton.addEventListener('click', () => {
//         changeModal.classList.toggle('hidden')
//         outerEvent.target.innerText = changeInput.value
//     })

// }

async function extractTextFromPDF(pdfData) {
    const pdf = await pdfjsLib.getDocument({
        data: pdfData
    }).promise;

    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContentObj = await page.getTextContent();
        const pageText = textContentObj.items.map(item => item.str).join(' ');
        textContent += pageText + '\n\n';
    }

    return textContent;
}

document.getElementById('po-upload').addEventListener('change', async(event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();

        reader.onload = async(e) => {
            const pdfData = new Uint8Array(e.target.result);
            const extractedText = await extractTextFromPDF(pdfData);
            // console.log(extractedText);
            pageSplit(extractedText)
                // textParse(extractedText)
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a PDF file.');
    }
});

// Change Data on Sheet
document.getElementById('parsed-text').addEventListener('click', function(event) {
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

async function pdfToThumbnailDataURL(pdfData) {
    // Load PDF using PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    // Fetch the first page
    const pageNumber = 1;
    const page = await pdf.getPage(pageNumber);

    // Set desired thumbnail size
    const thumbnailWidth = 100;  // Adjust width as needed
    const viewport = page.getViewport({ scale: 1 });
    const scale = thumbnailWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    // Create canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // Render PDF page on canvas
    const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
    };
    await page.render(renderContext).promise;

    // Convert canvas to PNG data URL
    const dataURL = canvas.toDataURL('image/png');

    return dataURL;
}

function exportTableToExcel(tableID) {
    // Select the table
    let filename = document.getElementById('orderId').innerText
    var table = document.getElementById(tableID);
    var workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, filename ? filename + '.xlsx' : 'exported_table.xlsx');
}

// function downloadPDF() {
//     // Get the HTML content from the specified element
//     const element = document.getElementById('content');

//     // Use html2pdf to generate the PDF
//     html2pdf(element, {
//         margin: 1,
//         filename: 'document.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     });
// }