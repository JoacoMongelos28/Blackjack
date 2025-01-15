package com.tallerwebi.dominio.Partida;

import com.tallerwebi.dominio.Jugador.Jugador;

public interface IPartidaServicio {

    void guardar(Partida partida);

    Partida buscarSiElJugadorTienePartidaPendiente(Integer idJugador);

    void borrarPartida(Partida partidaExistente);
}
