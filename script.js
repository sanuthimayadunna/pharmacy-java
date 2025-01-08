document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const formId = button.getAttribute('data-form');
        const form = document.getElementById(formId);
        const select = form.querySelector('select');
        const selectedOption = select.options[select.selectedIndex];
        const product = selectedOption.text;
        const pricePerUnit = parseFloat(selectedOption.getAttribute('data-price'));
        const quantityInput = form.querySelector('input[name="quantity"]');
        const quantity = parseFloat(quantityInput.value);

        if (!isNaN(quantity) && quantity > 0) {
            const totalCost = pricePerUnit * quantity;


            const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
            cartData.push({ product, quantity, pricePerUnit, totalCost });
            localStorage.setItem('cartData', JSON.stringify(cartData));

            // Create a new table row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${product}</td>
                <td>${quantity}</td>
                <td>${currencySymbol}${pricePerUnit.toFixed(2)}</td>
                <td>${currencySymbol}${totalCost.toFixed(2)}</td>
                <td><button class="remove-btn">Remove</button></td>
            `;

            // Append the new row to the table
            const tableBody = document.querySelector('#result-table tbody');
            tableBody.appendChild(newRow);

            // Update total price
            updateTotalPrice();

        } else {
            alert('Please enter a valid quantity');
        }
    });
});


function saveCartData() {
    const table = document.getElementById('result-table');
    const tableData = table.outerHTML;
    localStorage.setItem('cartData', tableData);
}

document.addEventListener('DOMContentLoaded', () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];

    const tableBody = document.querySelector('#result-table tbody');
    let totalPrice = 0;

    cartData.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${currencySymbol}${item.pricePerUnit.toFixed(2)}</td>
            <td>${currencySymbol}${item.totalCost.toFixed(2)}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;
        tableBody.appendChild(newRow);
        totalPrice += item.totalCost;
    });

    // Update total price
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="3" style="text-align: right;"><strong>Total Price:</strong></td>
        <td><strong>${currencySymbol}${totalPrice.toFixed(2)}</strong></td>
    `;
    document.querySelector('#result-table tfoot').appendChild(totalRow);
});

function updateTotalPrice() {
    const rows = document.querySelectorAll('#result-table tbody tr');
    let totalPrice = 0;

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const totalCostCell = cells[3];
        const totalCost = parseFloat(totalCostCell.textContent.replace(currencySymbol, ''));
        totalPrice += totalCost;
    });

    // Update the total price row
    let totalRow = document.querySelector('#result-table tfoot tr');
    if (!totalRow) {
        const tfoot = document.querySelector('#result-table tfoot');
        totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="3" style="text-align: right;"><strong>Total Price:</strong></td>
            <td><strong>${currencySymbol}${totalPrice.toFixed(2)}</strong></td>
        `;
        tfoot.appendChild(totalRow);
    } else {
        totalRow.cells[1].innerHTML = `<strong>${currencySymbol}${totalPrice.toFixed(2)}</strong>`;
    }
}

// Choose your currency symbol here
const currencySymbol = 'Rs. '; // Change this to your desired currency symbol


// Function to update the table based on the given data
function updateTable(tableData) {
    const table = document.getElementById('result-table');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');

    // Clear existing table content
    tbody.innerHTML = '';
    tfoot.innerHTML = '';

    // Create a temporary div to parse the tableData string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableData;

    // Extract the new table rows and footer
    const newTable = tempDiv.querySelector('#result-table');
    tbody.innerHTML = newTable.querySelector('tbody').innerHTML;
    tfoot.innerHTML = newTable.querySelector('tfoot').innerHTML;
}

// Event listener for "Add to Favourites"
document.getElementById('add-to-favourites').addEventListener('click', function() {
    const table = document.getElementById('result-table');
    const tableData = table.outerHTML;
    localStorage.setItem('favouriteOrder', tableData);
    alert('Favourite order has been saved.');
});

// Event listener for "Apply Favourites"
document.getElementById('apply-favourites').addEventListener('click', function() {
    const favouriteData = localStorage.getItem('favouriteOrder');
    if (favouriteData) {
        updateTable(favouriteData);
        alert('Favourite order has been applied.');
    } else {
        alert('No favourite order found!');
    }
});

function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission

    const form = document.getElementById('orderForm');

    if (form.checkValidity()) {//checks if all the fields r filled properly
        alert('Thank you for your purchase!');
        form.submit(); 
    } else {
        form.reportValidity();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedCartData = localStorage.getItem('cartData');
    if (savedCartData) {
        const table = document.getElementById('result-table');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = savedCartData;

        // Get the table content and insert it into the current table
        table.querySelector('tbody').innerHTML = tempDiv.querySelector('tbody').innerHTML;
        table.querySelector('tfoot').innerHTML = tempDiv.querySelector('tfoot').innerHTML;
    }
});
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const row = event.target.closest('tr');
        const productName = row.cells[0].textContent;

        // Remove the item from localStorage
        let cartData = JSON.parse(localStorage.getItem('cartData')) || [];
        cartData = cartData.filter(item => item.product !== productName);
        localStorage.setItem('cartData', JSON.stringify(cartData));

        // Remove the row from the table
        row.remove();

        // Update the total price
        updateTotalPrice();
    }
});