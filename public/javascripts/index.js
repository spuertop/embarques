window.onload = function() {
    let modals = document.querySelectorAll('.modal');
    modals.forEach(item => {
        item.addEventListener('shown.bs.modal', function(e) {
            (e.target).querySelectorAll('input')[1].focus();
        })
    })
}