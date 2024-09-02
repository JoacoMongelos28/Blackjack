document.addEventListener('DOMContentLoaded', () => {
    const estaLogueado = document.getElementById('estado-del-jugador').value === 'true';

    function mostrarPopupSiElJugadorNoEstaLogueado(evento) {
        if (!estaLogueado) {
            evento.preventDefault();

            const modal = document.getElementById("miModal");
            modal.style.display = "block";

            const span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            }
        }
    }

    const iniciarSesion = document.getElementById('iniciar-sesion');
    if (iniciarSesion) {
        iniciarSesion.addEventListener('click', mostrarPopupSiElJugadorNoEstaLogueado);
    }

    const idBlackjack = document.getElementById('id-blackjack');
    if (idBlackjack) {
        idBlackjack.addEventListener('click', mostrarPopupSiElJugadorNoEstaLogueado);
    }
});