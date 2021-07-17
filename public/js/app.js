const columns = [{
        key: 'projectName',
        name: 'project',
    },
    {
        key: 'env',
        name: 'environment',
    },
    {
        key: 'branch',
        name: 'branch',
    },
    {
        key: 'tag',
        name: 'tag',
    },
    {
        key: 'commitHash',
        name: 'commit hash',
    },
    {
        key: 'date',
        name: 'deployment date',
        transform: dateTransform
    },
];

function showContent(data) {
    document.getElementById('login-block')
        .remove();
    const content = document.getElementById('content');
    content
        .appendChild(generateHeading('Deployments'));
    content
        .appendChild(generateTable(columns, data));
}

function dateTransform(string) {
    return new Date(string).toUTCString();
}

function generateHeading(text) {
    const h1 = document.createElement("h1");
    h1.innerText = text;

    return h1;
}

function generateTable(columns, data) {
    const tbl = document.createElement("table");
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

function showListAction(event) {
    event.preventDefault();
    fetch(`/api/deployments?authorization=${document.forms.login.token.value}`)
        .then(response => {
            if (!response.ok) {
                document.getElementById('error').innerText = response.statusText;
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(json => showContent(json))
        .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.forms.login.addEventListener('submit', showListAction);
});