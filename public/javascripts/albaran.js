let input = document.getElementById('albaran');
let result = document.getElementById('result');
let results = [];

window.onload = function() {
    //input.addEventListener('keyup', searchData);
    input.focus();
}

async function searchData(e) {
    if (e.keyCode === 13) {
        console.log('13')
        try {
            const res = await fetch('/users/getAlbaranData?ae=' + input.value);
            results = await res.json();
            if (results.length === 0) {
                console.log('long 0')
                    //TODO: Va a ser que el albaran no está bien
            } else {
                displayResults(results);
            }
        } catch (error) {
            console.log(error)
        }
        input.value = '';
    }
}

function displayResults(arrayData) {
    let buttons = '';
    arrayData.forEach(element => {
        buttons = buttons + `<button type="button" class="btn btn-danger btn-lg m-1">${element.Descripcion2}</button>`;
    });
    result.innerHTML = buttons;
    console.log(arrayData);
}