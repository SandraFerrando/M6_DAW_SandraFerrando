let items = [];

// Funció per validar el valor de l'input
function validaInput(inputValue) {
    let forbidden = /[<>]/;
    let errorMessage = document.getElementById("error-message");
    let inputField = document.getElementById("name");

    if (inputValue.trim() === "") {
        // Si l'input està buit, mostra un missatge d'error
        errorMessage.innerHTML = "L'entrada no pot estar buida.";
        errorMessage.style.display = "inline";  // Mostra el missatge d'error
        inputField.classList.add("input-error");  // Afegeix el contorn vermell
        return false;
    } else if (forbidden.test(inputValue)) {
        // Si l'input conté símbols prohibits, mostra l'error i canvia el color
        errorMessage.innerHTML = "Els símbols '<' i '>' no estan permesos.";
        errorMessage.style.display = "inline";  // Mostra el missatge d'error
        inputField.classList.add("input-error");  // Afegeix el contorn vermell
        return false;
    } else {
        // Si és vàlid, amaga l'error i restableix el color
        errorMessage.style.display = "none";  // Amaga el missatge d'error
        inputField.classList.remove("input-error");  // Elimina el contorn vermell
        return true;
    }
}


function mostra() {
    var html = "<ul>";
    for (var i = 0; i < items.length; i++) {
        html += "<li>" + items[i] + " <button onclick='deleteItems(" + i + ")'>delete</button></li>";
    }
    html += "</ul>";
    document.getElementById("items").innerHTML = html;
}

function deleteItems(index) {
    items.splice(index, 1);
    document.getElementById("count").innerHTML = items.length;
    mostra();
}
