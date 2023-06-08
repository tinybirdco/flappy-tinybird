export function addDataToDOM(data, divElement) {
    // Check if there's any data
    if (data.rows > 0) {
        // Select the div
        const div = document.getElementById(divElement);

        // Clear the contents of the div
        div.innerHTML = '';

        // Create a new table
        const table = document.createElement('table');
        table.className = 'table-auto';

        // Create the header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Loop over the meta array to create headers
        data.meta.forEach(metaItem => {
            const th = document.createElement('th');
            th.textContent = metaItem.name;
            headerRow.appendChild(th);
        });

        // Add the header row to the table header
        thead.appendChild(headerRow);

        // Add the table header to the table
        table.appendChild(thead);

        // Create the body of the table
        const tbody = document.createElement('tbody');

        // Loop over the data array to create rows
        data.data.forEach(playerData => {
            const row = document.createElement('tr');

            // Loop over the fields in each data item
            for (const field in playerData) {
                const td = document.createElement('td');
                td.textContent = playerData[field];
                row.appendChild(td);
            }

            // Add the row to the table body
            tbody.appendChild(row);
        });

        // Add the table body to the table
        table.appendChild(tbody);

        // Add the table to the playerStatsDiv
        div.appendChild(table);
    }
}
