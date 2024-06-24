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
    console.log(`rowCount: ${rowCount}
        cellCount: ${cellCount}
        columnCount: ${columnCount}`);
    console.log(arr);
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
        result = '<tr><th>Size</th><th>SKU</th><th>OS</th><th>Total</th><th>Price</th><th>Extended</th></tr><tr>'
    }
    if (itemsPerLine === 8) {
        result = '<tr><th>Size</th><th>SKU</th><th>OS</th><th>Total</th><th>Price</th><th>Extended</th><th>UPC-Number</th><th>UPC-Price</th></tr><tr>'
    }
    for (let i = 0; i < arr.length; i++) {
        // result += `<td><input type=text value="${arr[i]}"/></td>`;
        result += `<td>${arr[i]}</td>`;


        if ((i + 1) % itemsPerLine === 0 && i !== arr.length - 1) {
            result += '</tr><tr>';
        } else if (i !== arr.length - 1) {
            result += '';
        }
    }
    return `<table>${result}</table>`
}

function textParse(text) {
    let tableRegex = /Description [\w $\.\-]{1,}/;
    let tableHeaderRegex = /Description [\w $]{1,} Extended/
    let tableText = text.match(tableRegex);
    let tableHeaderText = text.match(tableHeaderRegex)
    let tableTotalRegex = /Total [\w \.]{1,}/
    let tableAdditionalInstructionsRegex = /Additional Instructions[\w \:\.\-]{0,}/
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
    downloadTextFile('test.csv', csvFormat)

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
    const additionalInstructionsRegex = /Additional Instructions[\w \:\.\-]{0,}/

    let orderNumber = text.match(orderNumberRegex)[0].replace(/Order#[ ]{1,}/, "")
    let poDate = text.match(poDateRegex)[0].replace(/PO Date[ ]{1,}/, "")
    let vendor = text.match(vendorRegex)[0].replace(/Vendor#[ ]{1,}/, "")
    let enteredBy = text.match(enteredByRegex)[0].replace(/Entered By[ ]{1,}/, "")
    let additionalInstructions = text.match(additionalInstructionsRegex) ? text.match(additionalInstructionsRegex)[0].replace(/Total [\w \.]{1,}/, "").replace(/Additional Instructions:[ ]{0,}/, "") : ""

    const startShipToRegex = /Ship To: [ ]{0,}/;
    const endShipToRegex = /[]{0,} Ship Date/;
    let shipTo = findBetween(text, startShipToRegex, endShipToRegex)
    let shipToFormatted = shipTo.replaceAll("  ", "<br>")

    const startInfoRegex = /Phone/
    const endInfoRegex = /Description/
    let infoArray = findBetween(text, startInfoRegex, endInfoRegex).split("   ")
    let shipDate = infoArray[0]
    let expectedOn = infoArray[1]
    let terms = infoArray[2]
    let shipVia = infoArray[3]
    let phone = infoArray[4]

    let poDataHtml = `<table>
    <tr><th>PoNumber:</th><td>${orderNumber}</td></tr>
    <tr><th>PO Date:</th><td>${poDate}</td></tr>
    <tr><th>Vendor:</th><td>${vendor}</td></tr>
    <tr><th>Entered By:</th><td>${enteredBy}</td></tr>
    <tr><th>Ship Date:</th><td>${shipDate}</td></tr>
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

    document.getElementById('po-data').innerHTML = poDataHtml
    document.getElementById('shipping-info').innerHTML = shipDataHtml
    document.getElementById('additional-instructions').innerHTML = additionalInstructionsHtml
    console.log(infoArray);
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
            console.log(extractedText);
            pageSplit(extractedText)
                // textParse(extractedText)
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a PDF file.');
    }
});

document.getElementById('parsed-text').addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'td') {
        console.log(event.target.innerText);
        event.target.innerText = prompt("New Data", event.target.innerText)
    }
});