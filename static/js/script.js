const apiURL= 'http://127.0.0.1:5000/finance'

// Function to search records
function searchRecords() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#records-body tr');

    rows.forEach(row => {
        const title = row.cells[1]?.innerText.toLowerCase() || '';
        const description = row.cells[2]?.innerText.toLowerCase() || '';

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}

// Function to filter records by status
function filterByStatus() {
    const filter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#records-body tr');

    rows.forEach(row => {
        const statusCell = row.querySelector('td[id^="status-"]');
        if (!statusCell) return;

        const status = statusCell.innerText.trim();

        if (filter === 'All' || status === filter) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}

// Function to toggle record status
async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

    try {
        const response = await fetch(`/finance/toggle-status/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        const data = await response.json();

        if (data.success) {
            const statusCell = document.getElementById(`status-${id}`);
            if (!statusCell) {
                console.error(`Error: Unable to locate the status cell for record ID ${id}.`);
                return;
            }

            // Update the status in the table
            statusCell.innerText = data.new_status;

            // Update the toggle button text
            const button = statusCell.previousElementSibling.querySelector('button');
            if (button) {
                button.innerText =
                    data.new_status === 'Pending' ? 'Mark as Completed' : 'Mark as Pending';
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}

// Function to soft delete a record
async function softDelete(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
        const response = await fetch(`/finance/delete/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);

            const rows = document.querySelectorAll('#records-body tr');
            rows.forEach(row => {
                const firstCell = row.querySelector('td:first-child');
                if (firstCell && parseInt(firstCell.innerText, 10) === id) {
                    row.remove();
                }
            });

            if (!document.querySelector('#records-body tr')) {
                document.getElementById('no_data').style.display = 'table-row';
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}

// Function to redirect to the edit record page
function editRecord(id) {
    window.location.href = `/update?id=${id}`;
}

document.getElementById('update-record-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    const id = document.getElementById('id').value; // ID is required
    const formData = {
        title: document.getElementById('title').value || undefined,
        description: document.getElementById('description').value || undefined,
        date: document.getElementById('date').value || undefined,
        status: document.getElementById('status').value || undefined,
    };

    // Remove undefined fields
    Object.keys(formData).forEach(key => {
        if (!formData[key]) delete formData[key];
    });

    try {
        // Send PUT request
        const response = await fetch(`http://127.0.0.1:5000/finance/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            document.getElementById('update-record-form').reset();
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});

    function filterRecords() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const rows = document.querySelectorAll('#records-body tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowText = Array.from(cells)
                                    .map(cell => cell.innerText.toLowerCase())
                                    .join(' ');

            if (rowText.includes(searchTerm)) {
                row.style.display = ''; // Show the row if it matches
            } else {
                row.style.display = 'none'; // Hide the row if it doesn't match
            }
        }
)};

// Initial load of financial records when the page is opened
document.addEventListener('DOMContentLoaded', fetchFinanceRecords);

// Attach the form submission handler
document.getElementById('add-record-form').addEventListener('submit', addFinancialRecord);
