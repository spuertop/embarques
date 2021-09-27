let albaran, etiqueta, cargar, barra, cantidad, progreso;
let total = 0;


window.onload = function() {
    albaran = document.getElementById('albaran');
    etiqueta = document.getElementById('etiqueta');
    barra = document.getElementById('barra');
    cantidad = document.getElementById('cargas').querySelectorAll('.btn').length;
    progreso = 100 / cantidad;
    etiqueta.focus();
    etiqueta.addEventListener('keyup', searchData);
}

function searchData(e) {
    if (e.keyCode === 13) {
        cargar = document.getElementById('cargar').checked;
        let eti = etiqueta.value;
        console.log(eti);
        let button = document.getElementById(eti);
        if (eti) {
            button.setAttribute('class', 'btn btn-primary btn-lg m-1');
            total = total + progreso;
            barra.setAttribute('style', 'width: ' + total + '%;');
        }
        etiqueta.value = '';
    }
}