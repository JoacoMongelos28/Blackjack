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

$(document).ready(function () {
    // Manejar clic en el botón "Pagar"
    $("#pagar").click(function () {
        // Llamar a la función para generar la preferencia de pago
        generarPreferencia(precioTotal);
    });
});

function generarPreferencia(precioTotal) {
    console.log("Iniciando solicitud AJAX...");

    $.ajax({
        method: "POST",
        url: "/preferencia",
        data: { precioTotal: precioTotal }
    }).done(function(response) {
        console.log("Respuesta del servidor:", response);

        const mp = new MercadoPago('APP_USR-920dcc73-83a3-4740-8525-5ee09134e9cd', {
            locale: 'es-AR'
        });

        console.log("MercadoPago inicializado");

        mp.bricks();

        mp.bricks().create("wallet", "wallet_container", {
            initialization: {
                preferenceId: response,
                redirectMode: "blank"
            },
        }).catch(function(error) {
            console.log("Error al crear la wallet:", error);
        });
    }).fail(function(xhr, status, error) {
        console.log("Error en la solicitud AJAX:", error);
        console.log("Estado:", status);
        console.log("Respuesta del servidor:", xhr.responseText);
    });
}