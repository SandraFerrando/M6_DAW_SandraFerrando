let factures = [];
let facturaActual = null;

function afegirLinia() {
    const liniesFactura = document.getElementById('liniesFactura');
    const index = liniesFactura.children.length + 1;
    
    const liniaFactura = document.createElement('div');
    liniaFactura.className = 'grid grid-cols-4 gap-2 mb-2';
    liniaFactura.innerHTML = `
        <input type="text" placeholder="Article ${index}" class="p-2 border rounded" required>
        <input type="number" placeholder="Quantitat" class="p-2 border rounded" required min="1">
        <input type="number" placeholder="Preu" class="p-2 border rounded" required min="0" step="0.01">
        <button type="button" class="bg-red-500 text-white px-2 py-1 rounded" onclick="eliminarLinia(this)">Eliminar</button>
    `;
    
    liniesFactura.appendChild(liniaFactura);
    actualitzarTotals();
}

function eliminarLinia(boto) {
    boto.parentElement.remove();
    actualitzarTotals();
}

function actualitzarTotals() {
    const liniesFactura = document.getElementById('liniesFactura').children;
    let subtotal = 0;

    for (let linia of liniesFactura) {
        const quantitat = parseFloat(linia.children[1].value) || 0;
        const preu = parseFloat(linia.children[2].value) || 0;
        subtotal += quantitat * preu;
    }

    const descompte = parseFloat(document.getElementById('descompte').value) || 0;
    const importDescompte = subtotal * (descompte / 100);
    const total = subtotal - importDescompte;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('importDescompte').textContent = importDescompte.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function desarFactura(event) {
    event.preventDefault();

    const factura = {
        id: facturaActual ? facturaActual.id : Date.now(),
        nomClient: document.getElementById('nomClient').value,
        numeroFactura: document.getElementById('numeroFactura').value,
        liniesFactura: [],
        descompte: parseFloat(document.getElementById('descompte').value) || 0,
        total: parseFloat(document.getElementById('total').textContent)
    };

    const liniesFactura = document.getElementById('liniesFactura').children;
    for (let linia of liniesFactura) {
        factura.liniesFactura.push({
            descripcio: linia.children[0].value,
            quantitat: parseFloat(linia.children[1].value),
            preu: parseFloat(linia.children[2].value)
        });
    }

    if (facturaActual) {
        const index = factures.findIndex(f => f.id === facturaActual.id);
        factures[index] = factura;
    } else {
        factures.push(factura);
    }

    actualitzarLlistaFactures();
    reiniciarFormulari();
}

function actualitzarLlistaFactures() {
    const llistaFactures = document.getElementById('llistaFactures');
    llistaFactures.innerHTML = '';

    for (let factura of factures) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${factura.numeroFactura}</td>
            <td>${factura.nomClient}</td>
            <td>${factura.total.toFixed(2)}€</td>
            <td>
                <button onclick="editarFactura(${factura.id})" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                <button onclick="eliminarFactura(${factura.id})" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </td>
        `;
        llistaFactures.appendChild(fila);
    }
}

function editarFactura(id) {
    facturaActual = factures.find(factura => factura.id === id);
    
    document.getElementById('nomClient').value = facturaActual.nomClient;
    document.getElementById('numeroFactura').value = facturaActual.numeroFactura;
    document.getElementById('descompte').value = facturaActual.descompte;

    const liniesFactura = document.getElementById('liniesFactura');
    liniesFactura.innerHTML = '';

    for (let linia of facturaActual.liniesFactura) {
        const liniaFactura = document.createElement('div');
        liniaFactura.className = 'grid grid-cols-4 gap-2 mb-2';
        liniaFactura.innerHTML = `
            <input type="text" value="${linia.descripcio}" class="p-2 border rounded" required>
            <input type="number" value="${linia.quantitat}" class="p-2 border rounded" required min="1">
            <input type="number" value="${linia.preu}" class="p-2 border rounded" required min="0" step="0.01">
            <button type="button" class="bg-red-500 text-white px-2 py-1 rounded" onclick="eliminarLinia(this)">Eliminar</button>
        `;
        liniesFactura.appendChild(liniaFactura);
    }

    actualitzarTotals();
}

function eliminarFactura(id) {
    factures = factures.filter(factura => factura.id !== id);
    actualitzarLlistaFactures();
}

function reiniciarFormulari() {
    document.getElementById('formulariFactura').reset();
    document.getElementById('liniesFactura').innerHTML = '';
    facturaActual = null;
    afegirLinia();
}

document.getElementById('afegirLinia').addEventListener('click', afegirLinia);
document.getElementById('formulariFactura').addEventListener('submit', desarFactura);
document.getElementById('descompte').addEventListener('input', actualitzarTotals);

// Inicialitzar amb una línia de factura
afegirLinia();
