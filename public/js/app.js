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
        transform: string => new Date(string).toUTCString()
    },
];

function showContent(data) {
    document.querySelectorAll('.first-page')
        .forEach(item => {
            item.remove();
        });
    document.querySelectorAll('.row')
        .forEach(item => item.classList.remove('hidden'));

    generateTable('deployments-table', columns, data);
    tableSearch.init();
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