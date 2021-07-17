const tableSearch = (function() {
    const Arr = Array.prototype;
    let input;

    function onInputEvent(e) {
        input = e.target;
        const table = document.getElementsByClassName(input.getAttribute('data-table'));
        Arr.forEach.call(table, function(table) {
            Arr.forEach.call(table.tBodies, function(tbody) {
                Arr.forEach.call(tbody.rows, filter);
            });
        });
    }

    function filter(row) {
        const text = row.textContent.toLowerCase();
        const val = input.value.toLowerCase();
        row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
        init: function() {
            let inputs = document.getElementsByClassName('table-search');
            Arr.forEach.call(inputs, function(input) {
                input.oninput = onInputEvent;
            });
        }
    };
})();