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

    const idBlackjack = document.getElementById('id-blackjack');
    if (idBlackjack) {
        idBlackjack.addEventListener('click', mostrarPopupSiElJugadorNoEstaLogueado);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const categorias = document.querySelectorAll('.contenedor-categorias .categoria');

    const mostrarTodosLosJuegos = document.querySelector('.contenedor-categorias .categoria[data-filter="todos"]');
    if (mostrarTodosLosJuegos) {
        mostrarTodosLosJuegos.classList.add('active');
    }

    function filtrarPorCategoria(categoria) {
        const juegos = document.querySelectorAll('.contenedor-juegos .juego');
        juegos.forEach(juego => {
            const categoriaObtenida = juego.querySelector('[data-category]').getAttribute('data-category');
            if (categoria === 'todos' || categoriaObtenida === categoria) {
                juego.parentElement.style.display = 'block';
            } else {
                juego.parentElement.style.display = 'none';
            }
        });
    }

    categorias.forEach(categoria => {
        categoria.addEventListener('click', (evento) => {
            evento.preventDefault();

            categorias.forEach(categoria => categoria.classList.remove('active'));

            categoria.classList.add('active');

            const categoriaAFiltrar = categoria.getAttribute('data-filter');
            filtrarPorCategoria(categoriaAFiltrar);
        });
    });
});

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
                window.location.href = "/home";
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
    const saldoObtenido = document.getElementById('saldo-usuario');
    const saldo = saldoObtenido ? saldoObtenido.textContent.trim() : null;

    const popupMostrado = localStorage.getItem('popupMostrado');

    if (saldo && !popupMostrado) {
        const popup = document.getElementById("popup-saldo");
        popup.style.display = "block";

        localStorage.setItem('popupMostrado', 'true');

        const cerrarPopup = document.getElementById("cerrarPopup");
        cerrarPopup.onclick = function () {
            popup.style.display = "none";
        };
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const miDiv = document.getElementById('boton-depositar');

    miDiv.addEventListener('click', () => {
        window.location.href = 'deposito';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('buscador');
    const juegos = document.querySelectorAll('.contenedor-juegos .juego');

    function filterGames(searchTerm) {
        juegos.forEach(juego => {
            const nombreJuego = juego.querySelector('[data-nombre]').getAttribute('data-nombre').toLowerCase();
            const matchesSearchTerm = nombreJuego.includes(searchTerm.toLowerCase());

            if (matchesSearchTerm) {
                juego.parentElement.style.display = 'block';
            } else {
                juego.parentElement.style.display = 'none';
            }
        });
    }

    function setActiveCategory(filter) {
        const categorias = document.querySelectorAll('.contenedor-categorias .categoria');
        categorias.forEach(categoria => {
            categoria.classList.remove('active');
        });

        const activeCategoria = document.querySelector(`.contenedor-categorias .categoria[data-filter="${filter}"]`);
        if (activeCategoria) {
            activeCategoria.classList.add('active');
        }
    }

    buscador.addEventListener('input', () => {
        const searchTerm = buscador.value;
        filterGames(searchTerm);

        setActiveCategory('todos');
    });

    setActiveCategory('todos');
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