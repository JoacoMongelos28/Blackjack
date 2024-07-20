package com.tallerwebi.dominio.Casino;

import com.tallerwebi.dominio.Jugador.Jugador;

public interface ICasinoRepositorio {
    Jugador obtenerJugadorPorSuId(Integer idJugador);

    void actualizarJugador(Jugador jugadorObtenido);
}