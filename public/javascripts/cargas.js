let albaran, etiqueta, cargar, barra, cantidad, progreso, modal;

window.onload = function() {
    albaran = document.getElementById('albaran');
    etiqueta = document.getElementById('etiqueta');
    barra = document.getElementById('barra');
    cantidad = document.getElementById('cargas').querySelectorAll('.btn').length;
    modal = new bootstrap.Modal(document.getElementById('modal'), {});
    progreso = 100 / cantidad;
    setbar();
    etiqueta.focus();
    etiqueta.addEventListener('keyup', searchData);
}


function searchData(e) {
    if (e.keyCode === 13) {
        document.getElementById('cargar').checked ? cargaUnidad() : descargaUnidad();
    }
}

async function cargaUnidad() {
    let btn = document.getElementById(etiqueta.value);
    if (btn) {
        //La Unidad de carga ya está cargada
        if (btn.classList.contains('up')) {
            let alert = `<br><div class="alert alert-dismissible alert-warning">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong>Error!</strong> Esto ya estaba cargado.
                        </div>`;
            document.getElementById('alert').innerHTML = alert;
        } else {
            //Cargamos la unidad
            const res = await fetch('/users/carga?ud=' + etiqueta.value);
            let results = await res.json();
            if (results[0] === 1) { //1 row affected
                btn.setAttribute('class', 'btn btn-success btn-lg m-1 up');
                document.getElementById('alert').innerHTML = '';
                setbar();
            }
        }
    } else {
        //El bulto a cargar no pertenece al pedido que se está cargando
        modal.show();
    }
    etiqueta.value = '';
}

function descargaUnidad() {
    let btn = document.getElementById(etiqueta.value);
    if (btn) {
        //La UC ya esta descargada
        if (btn.classList.contains('down')) {
            let alert = `<br><div class="alert alert-dismissible alert-warning">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong>Error!</strong> Esto ya estaba descargado.
                        </div>`;
            document.getElementById('alert').innerHTML = alert;
        } else {
            //Descargamos la UC
            btn.setAttribute('class', 'btn btn-outline-danger btn-lg m-1 down');
            document.getElementById('alert').innerHTML = '';
            setbar();
        }

    } else {
        //El bulto a descargar no pertenece al pedido que se está cargando
        modal.show();
    }
    etiqueta.value = '';
}

function setbar() {
    let up = document.getElementById('cargas').querySelectorAll('.up').length;
    let total = up / cantidad * 100;
    barra.setAttribute('style', 'width: ' + total + '%;');
    setFinish(total);
}

function setFinish(total) {
    if (total === 100) {
        let check = `   <h1 class="m-2">Todo cargado</h1>
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>`;
        document.getElementById('finish').innerHTML = check;
        //TODO: add button at footer "Cargar siguiente pedido"
    } else {
        document.getElementById('finish').innerHTML = '';
    }


}