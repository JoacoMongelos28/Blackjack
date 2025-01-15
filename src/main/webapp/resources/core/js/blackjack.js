let mazoDeCartas = [];
let sumaJugador = 0;
let sumaCrupier = 0;
let cartaOcultaDelCrupier = null;
let saldo = parseFloat(document.getElementById('saldo').innerText);
let apuesta = 0;
let apuestaAnterior = 0;
let historialApuestas = [];
let huboBlackjack;
let huboBlackjackCrupier;
let huboAzCrupier;
let huboDobleAzCrupier;
let huboAzJugador;
let valorPrimeraMano;
let valorSegundaMano;
let cartaSeparada;
let cartaSeparada2;
let seDividio;
let valorValidado;
let manoActual;
let valorJugador;
let valorCrupier;
let primeraManoSePaso;
let segundaManoSePaso;
let historialIndex = -1;
let seRepartioLasCartas;
let primeraManoValor;
let segundaManoValor;
let huboDobleAzJugador;
let cartasRepartidas = [];
let data = [];

document.addEventListener('DOMContentLoaded', async () => {
    mazoDeCartas = await obtenerCartas();
    if (await cargarPartida()) {
        eliminarBotonesConValores();
        crearDivsDeLosValoresDelJugadorYCrupier();
        const manoCrupier = document.getElementById("cartas-crupier")
        const manoJugador = document.getElementById("cartas-jugador")

        let valorCrupier = document.createElement('div');
        valorCrupier.id = 'valor-crupier';
        manoCrupier.appendChild(valorCrupier)

        let valorJugador = document.createElement('div');
        valorJugador.id = 'valor-jugador';
        manoJugador.appendChild(valorJugador)

        verificarBlackjack();
        mostrarBotonDividirSiAmbasCartasTienenElMismoValor();

        valorCrupier.innerText = `${sumaCrupier}`;

        if (huboBlackjack) {
            valorJugador.innerText = `BJ`;
        } else if (huboDobleAzJugador) {
            sumaJugador = 2;
            valorJugador.innerText = `${sumaJugador}`;
        } else if (huboAzJugador) {
            valorJugador.innerText = `${sumaJugador}/${sumaJugador - 10}`;
        } else {
            valorJugador.innerText = `${sumaJugador}`;
        }

        eliminarBotonesCuandoElJugadorEstaEnJuego();

        if (!huboBlackjack) {
            crearBotonesPedirPlantarseYDoblarApuesta();
        }
    } else {
        mostrarBotonesCuandoElJugadorNoEstaEnPartida();
        crearBotonesConValoresDeApuestaPredeterminados();
    }
});

function mostrarBotonesCuandoElJugadorNoEstaEnPartida() {
    document.querySelector('.jugador').classList.remove('row');
    document.getElementById('contenedor-botones-apuestas').classList.add('contenedor-botones-apuestas')
    document.getElementById('contenedor-botones').classList.remove('botones-expandidos')
    document.getElementById('contenedor-botones').classList.add('contenedor-botones')
    document.getElementById('total-apostado').textContent = '0';
    document.getElementById('apuesta').value = '';
    const apuestaInput = document.getElementById('apuesta');
    apuestaInput.readOnly = true;

    mostrarBotonReapostar();

    apuestaInput.addEventListener('input', function () {
        if (apuestaInput.value.trim() !== '') {
            crearBoton('boton-repartir', 'mdi mdi-cards', 'Repartir');
            crearBoton('boton-doblar', "mdi mdi-size-xs", 'Doblar X2');
            crearBoton('boton-deshacer', "fa-solid fa-rotate-left", 'Deshacer');
            crearBoton('boton-eliminar-apuesta', "fa-solid fa-trash", 'Eliminar apuesta');
        } else {
            eliminarPadreDelBoton('boton-repartir');
            eliminarPadreDelBoton('boton-doblar');
            eliminarPadreDelBoton('boton-deshacer');
            eliminarPadreDelBoton('boton-eliminar-apuesta');
        }
    });
}

function crearBotonesConValoresDeApuestaPredeterminados() {
    const apuestaInput = document.getElementById('apuesta');
    const valores = ['500', '1K', '2K', '5K', '10K'];
    valores.forEach(valor => {
        const botonValor = crearBotonConValor(`boton-${valor}`, valor);
        botonValor.addEventListener('click', () => {
            const valorActual = parseFloat(apuestaInput.value) || 0;
            let valorNumerico = obtenerValorNumerico(valor);
            apuestaInput.value = (valorActual + valorNumerico).toFixed();

            if (valorNumerico > 0) {
                historialApuestas = historialApuestas.slice(0, historialIndex + 1);
                historialApuestas.push((valorActual + valorNumerico));
                historialIndex = historialApuestas.length - 1;
            }

            apuestaInput.dispatchEvent(new Event('input'));
        });
    });
}

function obtenerValorNumerico(valor) {
    if (valor === '500') {
        return 500;
    } else if (valor === '1K') {
        return 1000;
    } else if (valor === '2K') {
        return 2000;
    } else if (valor === '5K') {
        return 5000;
    } else if (valor === '10K') {
        return 10000;
    }
}

document.getElementById('contenedor-botones').addEventListener('click', function (event) {
    if (event.target && event.target.id === 'boton-repartir') {
        repartirCartas();
    } else if (event.target && event.target.id === 'boton-pedir-carta') {
        jugadorPideCarta();
    } else if (event.target && event.target.id === 'boton-plantarse') {
        plantarse();
    } else if (event.target && event.target.id === 'boton-doblar-apuesta') {
        doblarApuestaDuranteLaPartida();
    } else if (event.target && event.target.id === 'boton-dividir') {
        dividirCartas();
    } else if (event.target && event.target.id === 'boton-reapostar') {
        reapostarApuestaAnterior();
    } else if (event.target && event.target.id === 'boton-doblar') {
        doblarLaApuestaDelInput();
    } else if (event.target && event.target.id === 'boton-deshacer') {
        deshacerApuestas();
    } else if (event.target && event.target.id === 'boton-eliminar-apuesta') {
        eliminarApuestas();
    }
});

async function repartirCartas() {
    const apuestaValida = apostar();

    if (!apuestaValida) {
        return;
    }

    actualizarSaldoDelJugador();
    eliminarBotonesConValores();
    crearDivsDeLosValoresDelJugadorYCrupier();

    const cartasCrupier = document.getElementById('cartas-crupier');
    const cartasJugador = document.getElementById('cartas-jugador');
    const primeraMano = document.getElementById('cartas-jugador-1');
    const segundaMano = document.getElementById('cartas-jugador-2');
    const totalApostado = document.getElementById('total-apostado');
    const contenedorBotones = document.getElementById('contenedor-botones');
    const totalGanado = document.getElementById('total-ganado');
    const cartasARepartir = [{destino: cartasJugador, esCartaOculta: false}, {
        destino: cartasCrupier,
        esCartaOculta: false
    },
        {destino: cartasJugador, esCartaOculta: false}, {destino: cartasCrupier, esCartaOculta: true}];

    limpiarVariables(cartasCrupier, cartasJugador, primeraMano, segundaMano, contenedorBotones, totalGanado);

    totalApostado.textContent = ` ${apuestaAnterior.toFixed(2).toString().replace('.00', '')}`;

    cartasARepartir.forEach((cartaRepartida, i) => {
        setTimeout(() => {
            const cartaAleatoriaObtenida = obtenerCartaAleatoriaDelMazo(mazoDeCartas);
            const carta = document.createElement('div');
            carta.className = 'carta';

            if (cartaRepartida.esCartaOculta) {
                carta.classList.add('carta-oculta');
                cartaOcultaDelCrupier = cartaAleatoriaObtenida;
                cartasRepartidas.push(cartaOcultaDelCrupier)
            } else {
                const cartaAMostrar = document.createElement('img');
                cartaAMostrar.src = `css/imagenes/${cartaAleatoriaObtenida.numero} de ${obtenerElPaloDeLaCarta(cartaAleatoriaObtenida.palo)}.png`;
                cartaAMostrar.alt = `${cartaAleatoriaObtenida.numero} de ${obtenerElPaloDeLaCarta(cartaAleatoriaObtenida.palo)}`;
                carta.appendChild(cartaAMostrar);

                cartasRepartidas.push(cartaAleatoriaObtenida);

                if (cartaRepartida.destino === cartasCrupier) {
                    sumaCrupier += obtenerElValorDeLaCarta(cartaAleatoriaObtenida.numero);
                } else {
                    sumaJugador += obtenerElValorDeLaCarta(cartaAleatoriaObtenida.numero);
                    if (cartaAleatoriaObtenida.numero === 'A') {
                        huboAzJugador = true;
                    }
                }
            }

            cartaRepartida.destino.appendChild(carta);

            requestAnimationFrame(() => {
                carta.classList.add('mostrar');
            });
        }, i * 1000);
    });

    setTimeout(() => {
        cartasJugador.appendChild(valorJugador);
        cartasCrupier.appendChild(valorCrupier);
        console.log(cartasRepartidas)
        guardarPartida();
        cartasRepartidas = []
        console.log(cartasRepartidas)
        verificarBlackjack();
        mostrarBotonDividirSiAmbasCartasTienenElMismoValor();

        valorCrupier.innerText = `${sumaCrupier}`;

        if (huboBlackjack) {
            valorJugador.innerText = `BJ`;
        } else if (huboDobleAzJugador) {
            sumaJugador = 2;
            valorJugador.innerText = `${sumaJugador}`;
        } else if (huboAzJugador) {
            valorJugador.innerText = `${sumaJugador}/${sumaJugador - 10}`;
        } else {
            valorJugador.innerText = `${sumaJugador}`;
        }

        eliminarBotonesCuandoElJugadorEstaEnJuego();

        if (!huboBlackjack) {
            crearBotonesPedirPlantarseYDoblarApuesta();
        }

    }, cartasARepartir.length * 1000);
}

function apostar() {
    const apuestaInput = document.getElementById('apuesta');
    apuesta = parseFloat(document.getElementById('apuesta').value);

    if (isNaN(apuesta) || apuesta <= 0) {
        mostrarPopup('Debes apostar primero o la apuesta es inválida.');
        return false;
    } else if (apuesta > saldo) {
        mostrarPopup('Saldo insuficiente');
        return false;
    }

    apuestaAnterior = apuesta;
    saldo -= apuesta;
    historialApuestas = [apuesta];
    apuestaInput.readOnly = true;
    return true;
}

async function obtenerCartas() {
    try {
        const response = await fetch('/blackjack/cartas');
        if (!response.ok) {
            throw new Error('Error al obtener las cartas');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function actualizarSaldoDelJugador() {
    document.getElementById('saldo').innerText = saldo.toFixed(2);

    fetch('/blackjack/actualizarSaldo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({saldo: saldo})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el saldo en la base de datos');
        }
    }).catch(error => {
        console.error(error);
    });
}

function eliminarBotonesConValores() {
    eliminarBoton('boton-500')
    eliminarBoton('boton-1K')
    eliminarBoton('boton-2K')
    eliminarBoton('boton-5K')
    eliminarBoton('boton-10K')
    document.getElementById('contenedor-botones-apuestas').classList.remove('contenedor-botones-apuestas')
    document.getElementById('contenedor-botones').classList.remove('contenedor-botones');
    document.getElementById('contenedor-botones').classList.add('botones-expandidos');
}

function crearDivsDeLosValoresDelJugadorYCrupier() {
    valorJugador = document.createElement('div');
    valorJugador.id = 'valor-jugador';
    valorCrupier = document.createElement('div');
    valorCrupier.id = 'valor-crupier';
    primeraManoValor = document.createElement('div');
    primeraManoValor.id = 'valor-jugador-1';
    segundaManoValor = document.createElement('div');
    segundaManoValor.id = 'valor-jugador-2';
}

function limpiarVariables(cartasCrupier, cartasJugador, primeraMano, segundaMano, contenedorBotones, totalGanado) {
    cartasCrupier.innerHTML = '';
    cartasJugador.innerHTML = '';
    primeraMano.innerHTML = '';
    segundaMano.innerHTML = '';
    primeraManoValor.innerHTML = '';
    segundaManoValor.innerHTML = '';
    contenedorBotones.innerHTML = '';
    totalGanado.innerHTML = '0';
    sumaJugador = 0;
    sumaCrupier = 0;
    manoActual = 0;
    valorPrimeraMano = 0;
    valorSegundaMano = 0;
    cartaOcultaDelCrupier = null;
    cartaSeparada = null;
    cartaSeparada2 = null;
    huboBlackjackCrupier = false;
    huboBlackjack = false;
    huboAzCrupier = false;
    huboDobleAzCrupier = false;
    huboAzJugador = false;
    seDividio = false;
    valorValidado = false;
    primeraManoSePaso = false;
    segundaManoSePaso = false;
    seRepartioLasCartas = true;
    huboDobleAzJugador = false;
}

function obtenerCartaAleatoriaDelMazo(mazoDeCartas) {
    const cartaAleatoria = Math.floor(Math.random() * mazoDeCartas.length);
    return mazoDeCartas.splice(cartaAleatoria, 1)[0];
}

function obtenerElPaloDeLaCarta(palo) {
    switch (palo) {
        case "CORAZON":
            return 'Corazon';
        case "DIAMANTE":
            return 'Diamante';
        case "TREBOL":
            return 'Trebol';
        case "PICA":
            return 'Picas';
    }
}

function obtenerElValorDeLaCarta(carta) {
    if (['J', 'Q', 'K'].includes(carta)) {
        return 10;
    } else if (carta === 'A') {
        return 11;
    } else {
        return parseInt(carta, 10);
    }
}

function verificarBlackjack() {
    const cartasJugador = document.getElementById('cartas-jugador').getElementsByClassName('carta');
    if (cartasJugador.length === 2) {
        const carta1 = cartasJugador[0].querySelector('img').alt.split(' ')[0];
        const carta2 = cartasJugador[1].querySelector('img').alt.split(' ')[0];

        if ((carta1 === 'A' && ['10', 'J', 'Q', 'K'].includes(carta2)) ||
            (['10', 'J', 'Q', 'K'].includes(carta1) && carta2 === 'A')) {
            huboBlackjack = true;
            crupierJuega();
        }
    }
}

function mostrarBotonDividirSiAmbasCartasTienenElMismoValor() {
    const cartasJugador = document.getElementById('cartas-jugador').getElementsByClassName('carta');
    if (cartasJugador.length === 2) {
        const carta1 = cartasJugador[0].querySelector('img').alt.split(' ')[0];
        const carta2 = cartasJugador[1].querySelector('img').alt.split(' ')[0];

        const cartaObtenida1 = obtenerElValorDeLaCarta(carta1)
        const cartaObtenida2 = obtenerElValorDeLaCarta(carta2)

        if (cartaObtenida1 === cartaObtenida2) {
            if (carta1 === 'A' && carta2 === 'A') {
                huboDobleAzJugador = true;
            }
            crearBoton('boton-dividir', "fa-solid fa-left-right", 'Dividir')
        }
    }
}

function eliminarBotonesCuandoElJugadorEstaEnJuego() {
    eliminarPadreDelBoton('boton-repartir');
    eliminarPadreDelBoton('boton-doblar');
    eliminarPadreDelBoton('boton-deshacer');
    eliminarPadreDelBoton('boton-reapostar');
    eliminarPadreDelBoton('boton-eliminar-apuesta');
}

function crearBotonesPedirPlantarseYDoblarApuesta() {
    crearBoton('boton-pedir-carta', "fa-solid fa-plus", 'Pedir carta');
    crearBoton('boton-plantarse', "fa-solid fa-minus", 'Plantarse');
    crearBoton('boton-doblar-apuesta', 'mdi mdi-size-xs', 'Doblar X2');
}

function jugadorPideCarta() {
    eliminarPadreDelBoton('boton-dividir')
    if (seDividio) {
        agregarCartaAMano(manoActual);
    } else {
        const carta = obtenerCartaAleatoriaDelMazo(mazoDeCartas);
        agregarCartaAlJugador(carta);
        sumarNuevoValorDeCartaAlValorDelJugador(carta);
        eliminarPadreDelBoton('boton-doblar-apuesta')
    }
}

function agregarCartaAlJugador(carta) {
    const cartasJugador = document.getElementById('cartas-jugador');
    const cartaDiv = document.createElement('div');
    cartaDiv.className = 'carta';

    const img = document.createElement('img');
    img.src = `css/imagenes/${carta.numero} de ${obtenerElPaloDeLaCarta(carta.palo)}.png`;
    img.alt = `${carta.numero} de ${obtenerElPaloDeLaCarta(carta.palo)}`;
    cartaDiv.appendChild(img);

    cartasJugador.appendChild(cartaDiv);

    requestAnimationFrame(() => {
        cartaDiv.classList.add('mostrar');
    });
}

function sumarNuevoValorDeCartaAlValorDelJugador(carta) {
    const valorJugador = document.getElementById('valor-jugador');

    if (carta.numero === 'A') {
        sumaJugador += obtenerElValorDeLaCarta(carta.numero);

        if (huboDobleAzJugador) {
            sumaJugador -= 10;
            valorJugador.innerText = `${sumaJugador}`;
        } else if (huboAzJugador) {
            sumaJugador -= 10;
            huboAzJugador = false
            valorJugador.innerText = `${sumaJugador}`;
        } else if (sumaJugador > 21) {
            sumaJugador -= 10;
            valorJugador.innerText = `${sumaJugador}`;
        } else if (sumaJugador === 21) {
            valorJugador.innerText = `${sumaJugador}`;
        } else {
            huboAzJugador = true;
            valorJugador.innerText = `${sumaJugador}/${sumaJugador - 10}`;
        }
    } else if (huboAzJugador) {
        sumaJugador += obtenerElValorDeLaCarta(carta.numero);

        if (sumaJugador > 21 || carta.numero === 'A') {
            sumaJugador -= 10;
            valorJugador.innerText = `${sumaJugador}`;
            huboAzJugador = false;
        } else if (sumaJugador === 21) {
            valorJugador.innerText = `${sumaJugador}`;
        } else {
            valorJugador.innerText = `${sumaJugador}/${sumaJugador - 10}`;
        }
    } else {
        sumaJugador += obtenerElValorDeLaCarta(carta.numero);
        valorJugador.innerText = `${sumaJugador}`;
    }

    if (sumaJugador > 21 || sumaJugador === 21) {
        crupierJuega();
    }
}

function plantarse() {
    if (seDividio) {
        if (manoActual.id === 'cartas-jugador-1') {
            manoActual = document.getElementById('cartas-jugador-2')
            agregarCartaAMano(manoActual);
        } else {
            crupierJuega()
        }
    } else {
        crupierJuega();
    }
}

function crupierJuega() {
    ocultarLosBotonesDuranteLaPartida();
    mostrarLaCartaOcultaDelCrupier();
    verificarCartasDelCrupier()

    const intervalo = setInterval(() => {
        if (sumaCrupier < 17) {
            const carta = obtenerCartaAleatoriaDelMazo(mazoDeCartas);
            agregarNuevaCartaAlCrupier(carta);
            let valorCrupier = document.getElementById('valor-crupier');

            if (carta.numero === 'A') {
                sumaCrupier += obtenerElValorDeLaCarta(carta.numero);
                if (huboDobleAzCrupier) {
                    sumaCrupier -= 10;
                    valorCrupier.innerText = `${sumaCrupier}`;
                } else if (huboAzCrupier) {
                    sumaCrupier -= 10;
                    huboAzCrupier = false
                    valorCrupier.innerText = `${sumaCrupier}`;
                } else if (sumaCrupier > 21) {
                    sumaCrupier -= 10;
                    valorCrupier.innerText = `${sumaCrupier}`;
                } else if (sumaCrupier === 21) {
                    valorCrupier.innerText = `${sumaCrupier}`;
                } else {
                    huboAzCrupier = true;
                    valorCrupier.innerText = `${sumaCrupier}/${sumaCrupier - 10}`;
                }
            } else if (huboAzCrupier) {
                sumaCrupier += obtenerElValorDeLaCarta(carta.numero);

                if (sumaCrupier > 21 || carta.numero === 'A') {
                    sumaCrupier -= 10;
                    valorCrupier.innerText = `${sumaCrupier}`;
                    huboAzCrupier = false;
                } else if (sumaCrupier === 21) {
                    valorCrupier.innerText = `${sumaCrupier}`;
                } else {
                    valorCrupier.innerText = `${sumaCrupier}/${sumaCrupier - 10}`;
                }
            } else {
                sumaCrupier += obtenerElValorDeLaCarta(carta.numero);
                valorCrupier.innerText = `${sumaCrupier}`;
            }

            if (sumaCrupier >= 21) {
                clearInterval(intervalo);
                verificarResultado();
                setTimeout(() => {
                    limpiarMesa();
                    mostrarBotonesCuandoElJugadorNoEstaEnPartida();
                    crearBotonesConValoresDeApuestaPredeterminados()
                }, 1000);
            }
        } else {
            clearInterval(intervalo);
            verificarResultado();
            setTimeout(() => {
                limpiarMesa();
                mostrarBotonesCuandoElJugadorNoEstaEnPartida();
                crearBotonesConValoresDeApuestaPredeterminados();
            }, 1000);
        }
    }, 1000);
}

function agregarNuevaCartaAlCrupier(carta) {
    const cartaDiv = document.createElement('div');
    cartaDiv.className = 'carta';
    const img = document.createElement('img');
    img.src = `css/imagenes/${carta.numero} de ${obtenerElPaloDeLaCarta(carta.palo)}.png`;
    img.alt = `${carta.numero} de ${obtenerElPaloDeLaCarta(carta.palo)}`;

    cartaDiv.appendChild(img);
    document.getElementById('cartas-crupier').appendChild(cartaDiv);

    requestAnimationFrame(() => {
        cartaDiv.classList.add('mostrar');
    });
}

function ocultarLosBotonesDuranteLaPartida() {
    eliminarPadreDelBoton('boton-repartir');
    eliminarPadreDelBoton('boton-pedir-carta');
    eliminarPadreDelBoton('boton-plantarse');
    eliminarPadreDelBoton('boton-eliminar-apuesta');
    eliminarPadreDelBoton('boton-doblar-apuesta');
    eliminarPadreDelBoton('boton-dividir');
}

function mostrarLaCartaOcultaDelCrupier() {
    const cartaOcultaDiv = document.querySelector('.carta-oculta');
    if (cartaOcultaDiv && cartaOcultaDelCrupier) {
        cartaOcultaDiv.classList.remove('carta-oculta');
        const img = document.createElement('img');
        img.src = `css/imagenes/${cartaOcultaDelCrupier.numero} de ${obtenerElPaloDeLaCarta(cartaOcultaDelCrupier.palo)}.png`;
        img.alt = `${cartaOcultaDelCrupier.numero} de ${obtenerElPaloDeLaCarta(cartaOcultaDelCrupier.palo)}`;

        cartaOcultaDiv.appendChild(img);

        requestAnimationFrame(() => {
            cartaOcultaDiv.classList.add('mostrar');
        });

        sumaCrupier += obtenerElValorDeLaCarta(cartaOcultaDelCrupier.numero);
    }
}

function verificarCartasDelCrupier() {
    const valorCrupier = document.getElementById('valor-crupier');
    const cartasCrupier = document.getElementById('cartas-crupier').getElementsByClassName('carta');

    if (cartasCrupier.length === 2) {
        const carta1 = cartasCrupier[0].querySelector('img').alt.split(' ')[0];
        const carta2 = cartasCrupier[1].querySelector('img').alt.split(' ')[0];

        if ((carta1 === 'A' && ['10', 'J', 'Q', 'K'].includes(carta2)) ||
            (['10', 'J', 'Q', 'K'].includes(carta1) && carta2 === 'A')) {
            huboBlackjackCrupier = true;
            valorCrupier.innerText = `BJ`;
        } else if (carta1 === 'A' && carta2 === 'A') {
            sumaCrupier = 2;
            huboDobleAzCrupier = true;
            valorCrupier.innerText = `${sumaCrupier}`;
        } else if (carta1 === 'A' || carta2 === 'A') {
            huboAzCrupier = true;
            valorCrupier.innerText = `${sumaCrupier}/${sumaCrupier - 10}`;
        } else {
            valorCrupier.innerText = `${sumaCrupier}`;
        }
    }
}

function verificarResultado() {

    borrarPartida();

    if (seDividio) {
        if (huboBlackjackCrupier) {
            mostrarPopup('Cruppier tiene BJ');
            document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
            document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
        } else if (!primeraManoSePaso && !segundaManoSePaso && sumaCrupier > 21) {
            saldo += apuesta * 2;
            mostrarPopup('Ganaste ' + apuesta * 2);
            document.getElementById('valor-jugador-1').style.backgroundColor = 'green';
            document.getElementById('valor-jugador-2').style.backgroundColor = 'green';
            document.getElementById('total-ganado').textContent = (apuesta * 2).toFixed();
            actualizarSaldoDelJugador();
        } else if (!primeraManoSePaso && !segundaManoSePaso && valorPrimeraMano > sumaCrupier && valorSegundaMano > sumaCrupier) {
            saldo += apuesta * 2;
            mostrarPopup('Ganaste ' + apuesta * 2);
            document.getElementById('valor-jugador-1').style.backgroundColor = 'green';
            document.getElementById('valor-jugador-2').style.backgroundColor = 'green';
            document.getElementById('total-ganado').textContent = (apuesta * 2).toFixed();
            actualizarSaldoDelJugador();
        } else if (!primeraManoSePaso && segundaManoSePaso) {
            if (sumaCrupier > 21 || valorPrimeraMano > sumaCrupier) {
                saldo += apuesta;
                mostrarPopup('Ganaste ' + apuesta);
                document.getElementById('valor-jugador-1').style.backgroundColor = 'green';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
                document.getElementById('total-ganado').textContent = apuesta.toFixed();
                actualizarSaldoDelJugador();
            } else if (valorPrimeraMano === sumaCrupier) {
                saldo += (apuesta / 2);
                mostrarPopup('Ganaste ' + (apuesta / 2));
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
                document.getElementById('total-ganado').textContent = (apuesta / 2).toFixed();
                actualizarSaldoDelJugador();
            } else {
                mostrarPopup('Perdiste')
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
            }
        } else if (primeraManoSePaso && !segundaManoSePaso) {
            if (sumaCrupier > 21 || valorSegundaMano > sumaCrupier) {
                saldo += apuesta;
                mostrarPopup('Ganaste ' + apuesta);
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'green';
                document.getElementById('total-ganado').textContent = apuesta.toFixed();
                actualizarSaldoDelJugador();
            } else if (valorSegundaMano === sumaCrupier) {
                saldo += (apuesta / 2);
                mostrarPopup('Ganaste ' + (apuesta / 2));
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('total-ganado').textContent = (apuesta / 2).toFixed();
                actualizarSaldoDelJugador();
            } else {
                mostrarPopup('Perdiste')
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
            }
        } else if (valorPrimeraMano === sumaCrupier && valorSegundaMano === sumaCrupier && sumaCrupier <= 21) {
            saldo += apuesta;
            mostrarPopup('Ganaste ' + apuesta);
            document.getElementById('total-ganado').textContent = apuesta.toFixed();
            actualizarSaldoDelJugador();
        } else if ((valorPrimeraMano === sumaCrupier && valorSegundaMano !== sumaCrupier) || (valorPrimeraMano !== sumaCrupier && valorSegundaMano === sumaCrupier)) {
            if ((!primeraManoSePaso) && (valorPrimeraMano > sumaCrupier || sumaCrupier > 21)) {
                saldo += (apuesta + apuesta / 2);
                mostrarPopup('Ganaste ' + (apuesta + apuesta / 2));
                document.getElementById('valor-jugador-1').style.backgroundColor = 'green';
                document.getElementById('total-ganado').textContent = (apuesta + apuesta / 2).toFixed();
                actualizarSaldoDelJugador();
            } else if ((!segundaManoSePaso) && (valorSegundaMano > sumaCrupier || sumaCrupier > 21)) {
                saldo += (apuesta + apuesta / 2);
                mostrarPopup('Ganaste ' + (apuesta + apuesta / 2));
                document.getElementById('valor-jugador-2').style.backgroundColor = 'green';
                document.getElementById('total-ganado').textContent = (apuesta + apuesta / 2).toFixed();
                actualizarSaldoDelJugador();
            } else if ((!primeraManoSePaso) && valorPrimeraMano === sumaCrupier) {
                if (segundaManoSePaso || valorSegundaMano < sumaCrupier) {
                    saldo += (apuesta / 2);
                    mostrarPopup('Ganaste ' + (apuesta / 2));
                    document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
                    document.getElementById('total-ganado').textContent = (apuesta / 2).toFixed();
                    actualizarSaldoDelJugador();
                } else if (!segundaManoSePaso && valorSegundaMano > sumaCrupier) {
                    saldo += (apuesta + apuesta / 2);
                    mostrarPopup('Ganaste ' + (apuesta / 2));
                    document.getElementById('valor-jugador-2').style.backgroundColor = 'green';
                    document.getElementById('total-ganado').textContent = (apuesta + apuesta / 2).toFixed();
                    actualizarSaldoDelJugador();
                }
            } else if ((!segundaManoSePaso) && valorSegundaMano === sumaCrupier) {
                if (primeraManoSePaso || valorPrimeraMano < sumaCrupier) {
                    saldo += (apuesta / 2);
                    mostrarPopup('Ganaste ' + (apuesta / 2));
                    document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                    document.getElementById('total-ganado').textContent = (apuesta / 2).toFixed();
                    actualizarSaldoDelJugador();
                } else if (!primeraManoSePaso && valorPrimeraMano > sumaCrupier) {
                    saldo += (apuesta + apuesta / 2);
                    mostrarPopup('Ganaste ' + (apuesta + apuesta / 2));
                    document.getElementById('valor-jugador-1').style.backgroundColor = 'green';
                    document.getElementById('total-ganado').textContent = (apuesta + apuesta / 2).toFixed();
                    actualizarSaldoDelJugador();
                }
            } else {
                mostrarPopup('Perdiste')
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
            }
        } else if (!primeraManoSePaso && !segundaManoSePaso && sumaCrupier <= 21) {
            if (sumaCrupier > valorPrimeraMano && sumaCrupier < valorSegundaMano) {
                saldo += apuesta;
                mostrarPopup('Ganaste ' + apuesta);
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'green';
                document.getElementById('total-ganado').textContent = apuesta.toFixed();
                actualizarSaldoDelJugador();
            } else if (sumaCrupier > valorSegundaMano && sumaCrupier < valorPrimeraMano) {
                saldo += apuesta;
                mostrarPopup('Ganaste ' + apuesta);
                document.getElementById('valor-jugador-1').style.backgroundColor = 'green';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
                document.getElementById('total-ganado').textContent = apuesta.toFixed();
                actualizarSaldoDelJugador();
            } else {
                mostrarPopup('Perdiste')
                document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
                document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
            }
        } else {
            mostrarPopup('Perdiste')
            document.getElementById('valor-jugador-1').style.backgroundColor = 'red';
            document.getElementById('valor-jugador-2').style.backgroundColor = 'red';
        }
    } else if (huboBlackjack && huboBlackjackCrupier) {
        saldo += apuesta;
        mostrarPopup('Empate, ambos tienen BJ ' + apuesta);
        document.getElementById('total-ganado').textContent = apuesta.toFixed();
        actualizarSaldoDelJugador();
    } else if (huboBlackjackCrupier && !huboBlackjack) {
        mostrarPopup('Cruppier tiene BJ');
        document.getElementById('valor-jugador').style.backgroundColor = 'red';
    } else if (huboBlackjack && !huboBlackjackCrupier) {
        saldo += apuesta * 2.5;
        mostrarPopup('Blackjack Ganaste ' + apuesta * 2.5);
        document.getElementById('total-ganado').textContent = (apuesta * 2.5).toFixed();
        document.getElementById('valor-jugador').style.backgroundColor = 'green';
        actualizarSaldoDelJugador();
    } else if (sumaJugador > 21) {
        mostrarPopup('Perdiste')
        document.getElementById('valor-jugador').style.backgroundColor = 'red';
    } else if (sumaCrupier > 21 || sumaJugador > sumaCrupier) {
        saldo += apuesta * 2;
        mostrarPopup('Ganaste ' + apuesta * 2);
        document.getElementById('total-ganado').textContent = (apuesta * 2).toFixed();
        document.getElementById('valor-jugador').style.backgroundColor = 'green';
        actualizarSaldoDelJugador();
    } else if (sumaJugador === sumaCrupier && !huboBlackjack && !huboBlackjackCrupier) {
        saldo += apuesta;
        mostrarPopup('Ganaste ' + apuesta);
        document.getElementById('total-ganado').textContent = apuesta.toFixed();
        actualizarSaldoDelJugador();
    } else {
        document.getElementById('valor-jugador').style.backgroundColor = 'red';
        actualizarSaldoDelJugador();
    }
}

function limpiarMesa() {
    const cartasCrupier = document.getElementById('cartas-crupier');
    const cartasJugador = document.getElementById('cartas-jugador');
    const primeraMano = document.getElementById('cartas-jugador-1')
    const segundaMano = document.getElementById('cartas-jugador-2')
    cartasCrupier.innerHTML = '';
    cartasJugador.innerHTML = '';
    primeraMano.innerHTML = '';
    segundaMano.innerHTML = '';
    valorCrupier.innerHTML = '';
    valorJugador.innerHTML = '';
}

function doblarApuestaDuranteLaPartida() {

    if (saldo < apuesta) {
        mostrarPopup('Saldo insuficiente para doblar la apuesta');
        return;
    }

    saldo -= apuesta;
    apuesta *= 2;
    document.getElementById('total-apostado').textContent = apuesta.toFixed(2);
    document.getElementById('apuesta').value = apuesta.toFixed(2);
    actualizarSaldoDelJugador()
    const carta = obtenerCartaAleatoriaDelMazo(mazoDeCartas);
    agregarCartaAlJugador(carta);
    sumarNuevoValorDeCartaAlValorDelJugador(carta);
    crupierJuega();
}

function dividirCartas() {
    if (saldo >= apuesta) {
        eliminarPadreDelBoton('boton-dividir');
        eliminarPadreDelBoton('boton-doblar-apuesta');
        seDividio = true;

        saldo -= apuesta;
        apuesta *= 2;
        document.getElementById('total-apostado').textContent = apuesta.toFixed(2);
        document.getElementById('apuesta').value = apuesta.toFixed(2);
        actualizarSaldoDelJugador();

        const cartasJugador = Array.from(document.getElementById('cartas-jugador').getElementsByClassName('carta'));
        document.getElementById('cartas-jugador').innerHTML = '';
        const manoJugador1Div = document.getElementById('cartas-jugador-1');
        const manoJugador2Div = document.getElementById('cartas-jugador-2');

        manoJugador1Div.appendChild(primeraManoValor);
        manoJugador1Div.appendChild(cartasJugador[0]);
        manoJugador2Div.appendChild(segundaManoValor);
        manoJugador2Div.appendChild(cartasJugador[1]);

        cartaSeparada = manoJugador1Div.querySelector('img').alt.split(' ')[0];
        valorPrimeraMano = obtenerElValorDeLaCarta(cartaSeparada);
        document.getElementById('valor-jugador-1').innerText = `${valorPrimeraMano}`;

        cartaSeparada2 = manoJugador2Div.querySelector('img').alt.split(' ')[0];
        valorSegundaMano = obtenerElValorDeLaCarta(cartaSeparada2);
        document.getElementById('valor-jugador-2').innerText = `${valorSegundaMano}`;

        requestAnimationFrame(() => {
            cartasJugador[0].classList.add('mostrar');
            cartasJugador[1].classList.add('mostrar');
        });

        agregarCartaAMano(manoJugador1Div);
        document.querySelector('.jugador').classList.add('row');
    } else {
        mostrarPopup("Saldo insuficiente")
    }
}

function agregarCartaAMano(manoDiv) {
    const carta = obtenerCartaAleatoriaDelMazo(mazoDeCartas);
    const cartaDiv = document.createElement('div');
    cartaDiv.className = 'carta';
    const img = document.createElement('img');
    img.src = `css/imagenes/${carta.numero} de ${obtenerElPaloDeLaCarta(carta.palo)}.png`;
    img.alt = `${carta.numero} de ${obtenerElPaloDeLaCarta(carta.palo)}`;
    cartaDiv.appendChild(img);
    manoDiv.appendChild(cartaDiv);

    requestAnimationFrame(() => {
        cartaDiv.classList.add('mostrar');
    });

    if (manoDiv.id === 'cartas-jugador-1') {
        valorPrimeraMano += obtenerElValorDeLaCarta(carta.numero);

        if (carta.numero === 'A') {
            if (valorPrimeraMano > 21) {
                valorPrimeraMano -= 10;
                document.getElementById('valor-jugador-1').innerText = `${valorPrimeraMano}`;
            } else if (valorPrimeraMano === 21) {
                document.getElementById('valor-jugador-1').innerText = `${valorPrimeraMano}`;
                const manoJugador2Div = document.getElementById('cartas-jugador-2');
                agregarCartaAMano(manoJugador2Div);
            } else {
                document.getElementById('valor-jugador-1').innerText = `${valorPrimeraMano}/${valorPrimeraMano - 10}`;
            }
        } else if (valorPrimeraMano > 21) {
            const manoJugador2Div = document.getElementById('cartas-jugador-2');
            primeraManoSePaso = true;
            document.getElementById('valor-jugador-1').innerText = `${valorPrimeraMano}`;
            agregarCartaAMano(manoJugador2Div);
        } else {
            document.getElementById('valor-jugador-1').innerText = `${valorPrimeraMano}`;
            manoActual = manoDiv;
            interaccionarConLaMano(manoDiv);
        }
    } else if (manoDiv.id === 'cartas-jugador-2') {
        valorSegundaMano += obtenerElValorDeLaCarta(carta.numero);

        if (carta.numero === 'A') {
            if (valorSegundaMano > 21) {
                valorSegundaMano -= 10;
                document.getElementById('valor-jugador-2').innerText = `${valorSegundaMano}`;
            } else if (valorSegundaMano === 21) {
                document.getElementById('valor-jugador-2').innerText = `${valorSegundaMano}`;
                crupierJuega();
            } else {
                document.getElementById('valor-jugador-2').innerText = `${valorSegundaMano}/${valorSegundaMano - 10}`;
            }
        } else if (valorSegundaMano > 21) {
            segundaManoSePaso = true;
            document.getElementById('valor-jugador-2').innerText = `${valorSegundaMano}`;
            crupierJuega();
        } else {
            document.getElementById('valor-jugador-2').innerText = `${valorSegundaMano}`;
            interaccionarConLaMano(manoDiv);
        }
    }
}

function interaccionarConLaMano(manoDiv) {
    if (manoDiv.id === 'cartas-jugador-1' && valorPrimeraMano === 21 && !valorValidado) {
        const manoJugador2Div = document.getElementById('cartas-jugador-2');
        agregarCartaAMano(manoJugador2Div);
        valorValidado = true;
        manoActual = manoJugador2Div;
    } else if (manoDiv.id === 'cartas-jugador-2' && valorSegundaMano === 21) {
        mostrarLaCartaOcultaDelCrupier();
        crupierJuega()
    } else {
        manoActual = manoDiv;
    }
}

function reapostarApuestaAnterior() {
    if (saldo <= 0) {
        mostrarPopup('No tienes saldo disponible para reapostar.');
        return;
    }

    apuesta = apuestaAnterior;
    document.getElementById('apuesta').value = apuesta;
    historialApuestas.push(apuesta)
    document.getElementById('apuesta').dispatchEvent(new Event('input'));
}

function mostrarBotonReapostar() {
    if (seRepartioLasCartas) {
        eliminarPadreDelBoton('boton-reapostar');
        crearBoton('boton-reapostar', 'fa-solid fa-rotate', 'Reapostar');
        const botonReapostar = document.getElementById('boton-reapostar');
        botonReapostar.textContent = ` ${apuestaAnterior}`;
    } else {
        eliminarPadreDelBoton('boton-reapostar');
    }
}

function doblarLaApuestaDelInput() {
    const apuestaInput = document.getElementById('apuesta');
    let apuesta = parseFloat(apuestaInput.value);

    if (isNaN(apuesta) || apuesta <= 0) {
        mostrarPopup('Por favor, ingrese una apuesta válida.');
        return;
    }

    historialApuestas.push(apuesta);
    apuesta *= 2;
    apuestaInput.value = apuesta.toFixed(2);
}

function deshacerApuestas() {
    if (historialApuestas.length === 0) {
        alert('No hay apuestas para deshacer.');
        return;
    }

    switch (historialIndex) {
        case 0:
            historialIndex--;
            actualizarInputYBotones('');
            break;
        default:
            historialIndex--;
            actualizarInputYBotones(historialApuestas[historialIndex]);
            break;
    }
}

function actualizarInputYBotones(nuevoValor) {
    const apuestaInput = document.getElementById('apuesta');
    apuestaInput.value = nuevoValor;
    apuestaInput.dispatchEvent(new Event('input'));
}

function eliminarApuestas() {
    document.getElementById('apuesta').value = '';
    historialApuestas = [];
    document.getElementById('apuesta').dispatchEvent(new Event('input'));
}

function crearBoton(id, icono, texto) {
    const contenedorBotones = document.getElementById('contenedor-botones');
    const botonExistente = document.getElementById(id);

    if (!botonExistente) {
        const contenedorBotonTexto = document.createElement('div');
        contenedorBotonTexto.className = 'boton-con-texto';

        const botonCreado = document.createElement('button');
        botonCreado.className = `boton ${icono}`;
        botonCreado.id = id;

        const textoDelBoton = document.createElement('p');
        textoDelBoton.className = 'texto-boton';
        textoDelBoton.textContent = texto;

        contenedorBotonTexto.appendChild(botonCreado);
        contenedorBotonTexto.appendChild(textoDelBoton);

        contenedorBotones.appendChild(contenedorBotonTexto);
    }
}

function crearBotonConValor(id, texto) {
    const contenedorBotones = document.getElementById('contenedor-botones-apuestas');
    const botonExistente = document.getElementById(id);

    if (!botonExistente) {
        const botonCreado = document.createElement('button');
        botonCreado.className = 'boton-apuesta';
        botonCreado.id = id;
        botonCreado.textContent = texto;
        contenedorBotones.appendChild(botonCreado);
        return botonCreado;
    }
}

function eliminarPadreDelBoton(id) {
    const boton = document.getElementById(id);
    if (boton) {
        const contenedorBotonTexto = boton.parentElement;
        contenedorBotonTexto.remove();
    }
}

function eliminarBoton(id) {
    const boton = document.getElementById(id);
    if (boton) {
        boton.remove();
    }
}

function mostrarPopup(mensaje) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = mensaje;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1000);
}

async function guardarPartida() {
    let idJugador = document.getElementById("idJugador").value;
    let apuestaActual = apuesta
    let numeroDeLaCartaDelCrupier = cartasRepartidas[1].numero;
    let paloDeLaCartaDelCrupier = cartasRepartidas[1].palo;
    let numeroDeLaCartaOcultaDelCrupier = cartasRepartidas[3].numero;
    let paloDeLaCartaOcultaDelCrupier = cartasRepartidas[3].palo;
    let numeroDeLaPrimeraCartaDelJugador = cartasRepartidas[0].numero;
    let paloDeLaPrimeraCartaDelJugador = cartasRepartidas[0].palo
    let numeroDeLaSegundaCartaDelJugador = cartasRepartidas[2].numero
    let paloDeLaSegundaCartaDelJugador = cartasRepartidas[2].palo

    data = {
        jugador: {
            idJugador: idJugador
        },
        numeroDeLaCartaDelCrupier: numeroDeLaCartaDelCrupier,
        paloDeLaCartaDelCrupier: paloDeLaCartaDelCrupier,
        numeroDeLaCartaOcultaDelCrupier: numeroDeLaCartaOcultaDelCrupier,
        paloDeLaCartaOcultaDelCrupier: paloDeLaCartaOcultaDelCrupier,
        numeroDeLaPrimeraCartaDelJugador: numeroDeLaPrimeraCartaDelJugador,
        paloDeLaPrimeraCartaDelJugador: paloDeLaPrimeraCartaDelJugador,
        numeroDeLaSegundaCartaDelJugador: numeroDeLaSegundaCartaDelJugador,
        paloDeLaSegundaCartaDelJugador: paloDeLaSegundaCartaDelJugador,
        apuesta: apuestaActual
    };

    try {
        const response = await fetch('/partida/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function cargarPartida() {
    try {
        const response = await fetch('/partida/cargar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.existe) {
                /*cartasRepartidas.push({
                    numero: data.partida.numeroDeLaPrimeraCartaDelJugador,
                    palo: data.partida.paloDeLaPrimeraCartaDelJugador
                }, {
                    numero: data.partida.numeroDeLaCartaDelCrupier,
                    palo: data.partida.paloDeLaCartaDelCrupier
                }, {
                    numero: data.partida.numeroDeLaSegundaCartaDelJugador,
                    palo: data.partida.paloDeLaSegundaCartaDelJugador
                }, {
                    numero: data.partida.numeroDeLaCartaOcultaDelCrupier,
                    palo: data.partida.paloDeLaCartaOcultaDelCrupier
                });*/

                const manoCrupier = document.getElementById("cartas-crupier")
                const cartaCrupier = document.createElement('div');
                cartaCrupier.className = 'carta mostrar';

                const cartaOculta = document.createElement('div');
                cartaOculta.className = 'carta carta-oculta mostrar';
                cartaOcultaDelCrupier = {
                    numero: data.partida.numeroDeLaCartaOcultaDelCrupier,
                    palo: data.partida.paloDeLaCartaOcultaDelCrupier
                };

                const cartaAMostrar = document.createElement('img');
                cartaAMostrar.src = `css/imagenes/${data.partida.numeroDeLaCartaDelCrupier} de ${obtenerElPaloDeLaCarta(data.partida.paloDeLaCartaDelCrupier)}.png`;
                cartaAMostrar.alt = `${data.partida.numeroDeLaCartaDelCrupier} de ${obtenerElPaloDeLaCarta(data.partida.paloDeLaCartaDelCrupier)}`;
                cartaCrupier.appendChild(cartaAMostrar);
                manoCrupier.appendChild(cartaCrupier)
                manoCrupier.appendChild(cartaOculta)

                const manoJugador = document.getElementById("cartas-jugador")
                const primeraCartaDelJugador = document.createElement('div');
                primeraCartaDelJugador.className = 'carta mostrar';
                const segundaCartaDelJugador = document.createElement('div');
                segundaCartaDelJugador.className = 'carta mostrar';

                const primeraCartaAMostrar = document.createElement('img');
                primeraCartaAMostrar.src = `css/imagenes/${data.partida.numeroDeLaPrimeraCartaDelJugador} de ${obtenerElPaloDeLaCarta(data.partida.paloDeLaPrimeraCartaDelJugador)}.png`;
                primeraCartaAMostrar.alt = `${data.partida.numeroDeLaPrimeraCartaDelJugador} de ${obtenerElPaloDeLaCarta(data.partida.paloDeLaPrimeraCartaDelJugador)}`;
                primeraCartaDelJugador.appendChild(primeraCartaAMostrar);
                manoJugador.appendChild(primeraCartaDelJugador)

                const segundaCartaAMostrar = document.createElement('img');
                segundaCartaAMostrar.src = `css/imagenes/${data.partida.numeroDeLaSegundaCartaDelJugador} de ${obtenerElPaloDeLaCarta(data.partida.paloDeLaSegundaCartaDelJugador)}.png`;
                segundaCartaAMostrar.alt = `${data.partida.numeroDeLaSegundaCartaDelJugador} de ${obtenerElPaloDeLaCarta(data.partida.paloDeLaSegundaCartaDelJugador)}`;
                segundaCartaDelJugador.appendChild(segundaCartaAMostrar);
                manoJugador.appendChild(segundaCartaDelJugador)

                const totalApostado = document.getElementById('total-apostado');
                totalApostado.innerText = data.partida.apuesta;

                apuesta = data.partida.apuesta

                sumaCrupier += obtenerElValorDeLaCarta(data.partida.numeroDeLaCartaDelCrupier);

                sumaJugador += obtenerElValorDeLaCarta(data.partida.numeroDeLaPrimeraCartaDelJugador);
                sumaJugador += obtenerElValorDeLaCarta(data.partida.numeroDeLaSegundaCartaDelJugador);

                if (data.partida.numeroDeLaPrimeraCartaDelJugador === 'A' || data.partida.numeroDeLaSegundaCartaDelJugador === 'A') {
                        huboAzJugador = true;
                }

                return true;
            } else {
                return false;
            }
        } else {
            console.error('Error inesperado al cargar la partida.');
            return false;
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function borrarPartida () {
    try {
        const response = await fetch('/partida/borrar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
