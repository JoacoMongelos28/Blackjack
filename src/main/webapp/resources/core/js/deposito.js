const loginForm = document.getElementById("login-form-2");

if (loginForm) {
    loginForm.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const formData = new FormData(this);

        fetch("/loguear", {
            method: "POST",
            body: new URLSearchParams(formData)
        })
            .then(response => response.text())
            .then(data => {
                if (data === "success") {
                    window.location.href = "/deposito";
                } else {
                    document.getElementById("error-2").innerText = data;
                    document.getElementById("error-2").style.display = "block";
                }
            })
            .catch(error => {
                document.getElementById("error-2").innerText = "Ocurrió un error inesperado";
                document.getElementById("error-2").style.display = "block";
            });
    });
}

document.getElementById("login-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const formData = new FormData(this);

    fetch("/loguear", {
        method: "POST",
        body: new URLSearchParams(formData)
    })
        .then(response => response.text())
        .then(data => {
            if (data === "success") {
                localStorage.removeItem('popupMostrado');
                window.location.href = "/deposito";
            } else {
                document.getElementById("error").innerText = data;
                document.getElementById("error").style.display = "block";
            }
        })
        .catch(error => {
            document.getElementById("error").innerText = "Ocurrió un error inesperado";
            document.getElementById("error").style.display = "block";
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const estaLogueado = document.getElementById('estado-del-jugador').value === 'true';

    function mostrarPopupSiElJugadorNoEstaLogueado(evento) {
        if (!estaLogueado) {
            evento.preventDefault();

            const popup = document.getElementById("popup");
            popup.style.display = "block";

            const iconoCerrar = document.getElementsByClassName("icono-cerrar")[0];
            iconoCerrar.onclick = function () {
                popup.style.display = "none";
            }

            window.onclick = function (event) {
                if (event.target === popup) {
                    popup.style.display = "none";
                }
            }
        }
    }

    const iniciarSesion = document.getElementById('iniciar-sesion');
    if (iniciarSesion) {
        iniciarSesion.addEventListener('click', mostrarPopupSiElJugadorNoEstaLogueado);
    }
});

const iconoUsuario = document.querySelector('.icono-usuario');
const menuFlotante = document.querySelector('.menu-usuario');

if (iconoUsuario) {
    iconoUsuario.addEventListener('click', () => {
        menuFlotante.style.display = menuFlotante.style.display === 'none' || menuFlotante.style.display === '' ? 'block' : 'none';
    });

    document.addEventListener('click', (event) => {
        if (!iconoUsuario.contains(event.target)) {
            menuFlotante.style.display = 'none';
        }
    });
}