let albaran, etiqueta, cargar, barra, cantidad, progreso;

window.onload = function() {
    albaran = document.getElementById('albaran');
    etiqueta = document.getElementById('etiqueta');
    barra = document.getElementById('barra');
    cantidad = document.getElementById('cargas').querySelectorAll('.btn').length;
    progreso = 100 / cantidad;
    //set barra si hay leidos
    etiqueta.focus();
    etiqueta.addEventListener('keyup', searchData);
}


function searchData(e) {
    if (e.keyCode === 13) {
        document.getElementById('cargar').checked ? cargaUnidad() : descargaUnidad();
    }
}

function cargaUnidad() {
    let eti = etiqueta.value;
    let btn = document.getElementById(eti);
    if (btn) {
        //Marca 1
        btn.setAttribute('class', 'btn btn-success btn-lg m-1 up');
        setbar();
    } else {
        //No encuentra nada que marcar
        let toast = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true"></span>
                    </button>
                </div>
                <div class="toast-body">
                    Hello, world! This is a toast message.
                </div>
            </div>`
        document.getElementById('toast').innerHTML = toast;
    }
    etiqueta.value = '';
}

function descargaUnidad() {
    let eti = etiqueta.value;
    let btn = document.getElementById(eti);
    if (btn) {
        //Desmarca 1
        btn.setAttribute('class', 'btn btn-outline-light btn-lg m-1 down');
        setbar();
    } else {
        //No encuentra nada que desmarcar
        let toast = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true"></span>
                    </button>
                </div>
                <div class="toast-body">
                    Hello, world! This is a toast message.
                </div>
            </div>`
        document.getElementById('toast').innerHTML = toast;
    }
    etiqueta.value = '';
}

function setbar() {
    let up = document.getElementById('cargas').querySelectorAll('.up').length;
    let total = up / cantidad * 100;
    barra.setAttribute('style', 'width: ' + total + '%;');
}