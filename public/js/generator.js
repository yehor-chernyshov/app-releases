function generateTable(id, columns, data) {
    const tbl = document.getElementById(id);
    tbl.appendChild(generateTableHead(columns));
    tbl.appendChild(generateTableBody(columns, data));

    return tbl;
}

function generateTableBody(columns, data) {
    const tblBody = document.createElement("tbody");
    data.forEach(deployment => {
        const row = document.createElement("tr");
        columns.forEach(column => {
            const cell = document.createElement("td");
            if (deployment[column.key]) {
                let cellText = deployment[column.key];
                if (column.transform) {
                    cellText = column.transform(cellText)
                }
                cell.appendChild(document.createTextNode(cellText));
            }
            row.appendChild(cell);
        })
        tblBody.appendChild(row);
    })

    return tblBody;
}

function generateTableHead(columns) {
    const tblHead = document.createElement("thead");
    const row = document.createElement("tr");
    columns.forEach(column => {
        const cell = document.createElement("th");
        const cellText = document.createTextNode(column.name);
        cell.appendChild(cellText);
        row.appendChild(cell);
    })
    tblHead.appendChild(row);

    return tblHead;
}