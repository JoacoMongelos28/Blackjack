package com.tallerwebi.dominio.Partida;

public interface IPartidaRepositorio {

    void guardarPartida(Partida partida);

    void eliminarPartidaExistente(Partida partidaExistente);

    Partida buscarPartidaPorIdDelJugador(Integer idJugador);
}
