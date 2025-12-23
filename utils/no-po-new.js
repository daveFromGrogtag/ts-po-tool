let testData = {
    new_orderId: "54321", 
    new_customerOrderId: "T54321", 
    new_poDate: "12/25/25", 
    new_enteredBy: "Santa", 
    new_shipDate: "12/25/25", 
    new_expectedDate: "12/25/25", 
    new_terms: "Net 10",
    new_shippingMethod: "UPS Ground", 
    new_shippingInfo: `North Pole, <br> Santa`, 
    new_additionalInstructions: `Leave cookies and milk<br>Be nice`, 
    new_numberOfItems: 5
}


function createNewItemsHtml(numberOfItems) {
        const oneItem = `                    <tr>
                        <td>S3X5</td>
                        <td>SKU</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0.00</td>
                        <td>0.00</td>
                        <td>
                            <div class="table-image"><img
                                    src="/No-Image-01.png">
                            </div>
                        </td>
                        <td></td>
                    </tr>`
        let allItems = ""
        for (let i = 0; i < parseInt(numberOfItems); i++) {
            allItems = allItems + oneItem
        }
        return allItems
        
}

function createNewHtmlOrder(new_orderId, new_customerOrderId, new_poDate, new_enteredBy, new_shipDate, new_expectedDate, new_terms, new_shippingMethod, new_shippingInfo, new_additionalInstructions, new_numberOfItems) {
    const newItemsList = createNewItemsHtml(new_numberOfItems)
    const newHtml = `<section class="po-header">
        <div id="po-header">
            <h2>${new_orderId}</h2>
        </div>
    </section>
    <section class="order-data">
        <div id="po-data">
            <table>
                <tbody>
                    <tr>
                        <th>PoNumber:</th>
                        <td id="orderId">${new_orderId}</td>
                    </tr>
                    <tr>
                        <th>Customer Order Id:</th>
                        <td>${new_customerOrderId}</td>
                    </tr>
                    <tr>
                        <th>PO Date:</th>
                        <td id="poDate">${new_poDate}</td>
                    </tr>
                    <tr>
                        <th>Vendor:</th>
                        <td>PANGAEA</td>
                    </tr>
                    <tr>
                        <th>Entered By:</th>
                        <td>${new_enteredBy}</td>
                    </tr>
                    <tr>
                        <th>Ship Date:</th>
                        <td id="shipDate">${new_shipDate}</td>
                    </tr>
                    <tr>
                        <th>Expected:</th>
                        <td>${new_expectedDate}</td>
                    </tr>
                    <tr>
                        <th>Terms:</th>
                        <td>${new_terms}</td>
                    </tr>
                    <tr>
                        <th>Ship Via:</th>
                        <td>${new_shippingMethod}</td>
                    </tr>
                    <tr>
                        <th>Approval Date:</th>
                        <td id="approvalDate"><input id="approvalDateInput" type="date" value=""></td>
                    </tr>
                    <tr>
                        <th>Due Date:</th>
                        <td id="dueDate"><input id="dueDateInput" type="date" value=""></td>
                    </tr>
                    <tr>
                        <th>QTY:</th>
                        <td id="total-quantity">0</td>
                    </tr>
                    <tr>
                        <th>PRICE:</th>
                        <td id="total-price">$0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <div id="shipping-info">
                <table>
                    <tbody>
                        <tr>
                            <th>Ship To:</th>
                        </tr>
                        <tr>
                            <td>${new_shippingInfo}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="additional-instructions">
                <table>
                    <tbody>
                        <tr>
                            <th>Additional Instructions:</th>
                        </tr>
                        <tr>
                            <td>${new_additionalInstructions}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="tracking-info">
                <table>
                    <tbody>
                        <tr>
                            <th>Tracking Info:</th>
                        </tr>
                        <tr>
                            <td id="tracking-number"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="vertical-id">
            <h1>${new_orderId}</h1>
        </div>
    </section>
    <section class="item-data">
        <div id="parsed-text">
            <table id="item-data-table">
                <tbody>
                    <tr>
                        <th>Size</th>
                        <th>SKU</th>
                        <th>OS</th>
                        <th>Total</th>
                        <th>Price</th>
                        <th>Extended</th>
                        <th>Image</th>
                        <th>Notes</th>
                    </tr>
                    ${newItemsList}
                </tbody>
            </table>
        </div>
        <div id="po-total">
            <table>
                <tbody>
                    <tr>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                    <tr>
                        <td>0</td>
                        <td>$0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>`

    document.getElementById("content").innerHTML = newHtml
}

  document.getElementById("newOrderForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop normal form submit

    const orderData = {
      new_orderId: document.getElementById("new_orderId").value.trim(),
      new_customerOrderId: document.getElementById("new_customerOrderId").value.trim(),
      new_poDate: document.getElementById("new_poDate").value,
      new_enteredBy: document.getElementById("new_enteredBy").value.trim(),
      new_shipDate: document.getElementById("new_shipDate").value,
      new_expectedDate: document.getElementById("new_expectedDate").value,
      new_terms: document.getElementById("new_terms").value.trim(),
      new_shippingMethod: document.getElementById("new_shippingMethod").value.trim(),
      new_shippingInfo: document.getElementById("new_shippingInfo").value.trim(),
      new_additionalInstructions: document.getElementById("new_additionalInstructions").value.trim(),
      new_numberOfItems: Number(
        document.getElementById("new_numberOfItems").value
      )
    };

    createNewHtmlOrder(orderData.new_orderId, orderData.new_customerOrderId, orderData.new_poDate, orderData.new_enteredBy, orderData.new_shipDate, orderData.new_expectedDate, orderData.new_terms, orderData.new_shippingMethod, orderData.new_shippingInfo, orderData.new_additionalInstructions, orderData.new_numberOfItems);
    // send to API / Firestore / etc here
  });

// createNewHtmlOrder(testData.new_orderId, testData.new_customerOrderId, testData.new_poDate, testData.new_enteredBy, testData.new_shipDate, testData.new_expectedDate, testData.new_terms, testData.new_shippingMethod, testData.new_shippingInfo, testData.new_additionalInstructions, testData.new_numberOfItems)