function exportTableToExcel(tableID, filename) {
    // Select the table
    // let filename = document.getElementById('orderId').innerText
    var table = document.getElementById(tableID);
    var workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, filename ? filename + '.xlsx' : 'exported_table.xlsx');
}