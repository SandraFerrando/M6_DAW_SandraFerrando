let invoices = []; // Array per guardar les factures
let currentEditingIndex = -1; // Índex de la factura actualment en edició

// Funció per afegir una nova línia
function addLine() {
    const table = document.getElementById('invoice-lines').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(-1);
    
    newRow.innerHTML = `
        <td><input type="text" class="description" required></td>
        <td><input type="number" class="quantity" required></td>
        <td><input type="number" class="price" required></td>
        <td><button type="button" onclick="removeLine(this)">Eliminar</button></td>
    `;

    // Obtenir els inputs de la nova fila
    const quantityInput = newRow.querySelector('.quantity');
    const priceInput = newRow.querySelector('.price');

    // Afegir l'event listener per a la quantitat
    quantityInput.addEventListener('input', calculateTotal);
    // Afegir l'event listener per al preu
    priceInput.addEventListener('input', calculateTotal);
}

// Funció per eliminar una línia
function removeLine(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);
    calculateTotal(); // Actualitzar el total després d'eliminar la línia
}

function initializeDiscountListener() {
    const discountInput = document.getElementById('discount');
    discountInput.addEventListener('input', calculateTotal);
}


// Funció per calcular el total
function calculateTotal() {
    let total = 0;
    const lines = document.querySelectorAll('#invoice-lines tr:not(:first-child)'); // Seleccionar totes les línies de factura
    lines.forEach(line => {
        const quantity = parseFloat(line.querySelector('.quantity').value) || 0; // Obtenir la quantitat
        const price = parseFloat(line.querySelector('.price').value) || 0; // Obtenir el preu
        total += quantity * price; // Afegeix al total
    });
    const discount = parseFloat(document.getElementById('discount').value) || 0; // Obtenir descompte
    total -= total * (discount / 100); // Aplicar descompte
    document.getElementById('total').innerText = total.toFixed(2); // Actualitzar el total a l'HTML
}

// Gestor d'esdeveniments per enviar el formulari
document.getElementById('invoice-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const client = document.getElementById('client').value;
    const total = document.getElementById('total').innerText;
    const lines = [];

    const invoiceLines = document.querySelectorAll('#invoice-lines tr:not(:first-child)');
    invoiceLines.forEach(line => {
        const description = line.querySelector('.description').value;
        const quantity = parseFloat(line.querySelector('.quantity').value) || -1;
        const price = parseFloat(line.querySelector('.price').value) || -1;
        lines.push({ description, quantity, price });
    });

    if (currentEditingIndex >= 0) {
        // Actualitzar la factura existent
        invoices[currentEditingIndex] = { client, total, lines };
        currentEditingIndex = -1; // Resetem l'índex d'edició
    } else {
        // Crear una nova factura
        invoices.push({ client, total, lines });
    }

    renderInvoices();
    this.reset(); // Reiniciar el formulari
    clearInvoiceInputFields(); // Netejar els inputs de les línies de factura
    calculateTotal(); // Recalcular el total després de guardar la factura
});

// Funció per renderitzar la llista de factures
function renderInvoices() {
    const invoicesList = document.getElementById('invoices-list');
    invoicesList.innerHTML = ''; // Netejar la llista de factures

    invoices.forEach((invoice, index) => {
        const newRow = invoicesList.insertRow(-1);
        newRow.innerHTML = `
            <td>${invoice.client}</td>
            <td>${invoice.total} €</td>
            <td>
                <button onclick="viewInvoice(${index})">Consultar</button>
                <button onclick="editInvoice(${index})">Modificar</button>
                <button onclick="deleteInvoice(${index})">Eliminar</button>
            </td>
        `;
    });
}

// Funció per veure els detalls d'una factura
function viewInvoice(index) {
    const invoice = invoices[index];
    
    // Crear el contingut per mostrar al modal
    let details = `<strong>Client:</strong> ${invoice.client}<br>`;
    details += `<strong>Total:</strong> ${invoice.total} €<br>`;
    details += `<strong>Línies:</strong><br>`;
    invoice.lines.forEach(line => {
        details += `- Descripció: ${line.description}, Quantitat: ${line.quantity}, Preu: ${line.price} €<br>`;
    });

    // Omplir el modal amb els detalls
    document.getElementById('invoiceDetails').innerHTML = details;

    // Mostrar el modal
    document.getElementById('invoiceModal').style.display = "block";
}

// Funció per tancar el modal
function closeModal() {
    document.getElementById('invoiceModal').style.display = "none";
}

// Tancar el modal quan es fa clic fora del contingut del modal
window.onclick = function(event) {
    const modal = document.getElementById('invoiceModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Funció per editar una factura
function editInvoice(index) {
    const invoice = invoices[index];

    // Omplir el formulari amb la informació de la factura
    document.getElementById('client').value = invoice.client;
    document.getElementById('total').innerText = invoice.total;

    // Netejar els inputs abans d'omplir-los
    clearInvoiceInputFields();

    // Afegir les línies de la factura
    invoice.lines.forEach(line => {
        const table = document.getElementById('invoice-lines');
        const newRow = table.insertRow(-1);
        newRow.innerHTML = `
            <td><input type="text" class="description" value="${line.description}" required></td>
            <td><input type="number" class="quantity" value="${line.quantity}" required oninput="calculateTotal()"></td>
            <td><input type="number" class="price" value="${line.price}" required oninput="calculateTotal()"></td>
            <td><button type="button" onclick="removeLine(this)">Eliminar</button></td>
        `;
    });

    // Guardar l'índex actual com a fila d'edició
    currentEditingIndex = index;
}

// Funció per netejar els inputs de la factura
function clearInvoiceInputFields() {
    const table = document.getElementById('invoice-lines');
    const rows = table.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => {
        row.querySelector('.description').value = ''; // Netejar el camp de descripció
        row.querySelector('.quantity').value = ''; // Netejar el camp de quantitat
        row.querySelector('.price').value = ''; // Netejar el camp de preu
    });
}

// Funció per eliminar una factura
function deleteInvoice(index) {
    invoices.splice(index, 1); // Eliminar la factura de l'array
    renderInvoices(); // Actualitzar la llista de factures
}

// Afegir la primera línia quan es carrega la pàgina
document.addEventListener('DOMContentLoaded', (event) => {
    addLine(); // Cridar la funció addLine per afegir la primera línia
});
