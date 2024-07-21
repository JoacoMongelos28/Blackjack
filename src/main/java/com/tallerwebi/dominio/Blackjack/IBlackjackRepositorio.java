package com.tallerwebi.dominio.Blackjack;

import com.tallerwebi.dominio.Jugador.Jugador;

public interface IBlackjackRepositorio {
    Jugador obtenerJugadorPorSuId(Integer idJugador);

    void actualizarJugador(Jugador jugador);
}
