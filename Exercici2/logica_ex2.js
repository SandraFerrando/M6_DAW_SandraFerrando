let items = [];

function validaInput(inputValue, inputId) {
    let forbidden = /[<>]/;
    let errorMessage = document.getElementById("error-message");
    let inputField = document.getElementById(inputId);

    if (inputValue.trim() === "") {
        errorMessage.innerHTML = "L'entrada no pot estar buida.";
        errorMessage.style.display = "inline";
        inputField.classList.add("input-error");
        return false;
    } else if (forbidden.test(inputValue)) {
        errorMessage.innerHTML = "Els símbols '<' i '>' no estan permesos.";
        errorMessage.style.display = "inline";
        inputField.classList.add("input-error");
        return false;
    } else {
        errorMessage.style.display = "none";
        inputField.classList.remove("input-error");
        return true;
    }
}

function afegirItem() {
    let nom = document.getElementById("name").value;
    let cognom = document.getElementById("surname").value;

    if (validaInput(nom, "name") && validaInput(cognom, "surname")) {
        let item = nom + " " + cognom;
        items.push(item);
        document.getElementById("count").innerHTML = items.length;
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        mostra();
        
        console.log("Afegit nou item:", item);
        console.log("Estat actual de l'array items:", items);
        
        actualitzarEstatVisual();
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
    let itemEliminat = items[index];
    items.splice(index, 1);
    document.getElementById("count").innerHTML = items.length;
    mostra();
    
    console.log("Eliminat item:", itemEliminat);
    console.log("Estat actual de l'array items:", items);
    
}


function init() {
    document.getElementById("name").addEventListener("input", function() {
        validaInput(this.value, "name");
    });

    document.getElementById("surname").addEventListener("input", function() {
        validaInput(this.value, "surname");
    });

    actualitzarEstatVisual();
}

document.addEventListener("DOMContentLoaded", init);