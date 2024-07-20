package com.tallerwebi.dominio.Casino;

import com.tallerwebi.dominio.Jugador.Jugador;

public interface ICasinoServicio {
    Jugador obtenerJugadorPorId(Integer idusuario);

    void cargarSaldo(Jugador jugadorActual, Double saldo);
}
