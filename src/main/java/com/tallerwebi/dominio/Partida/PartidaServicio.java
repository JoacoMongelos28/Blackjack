package com.tallerwebi.dominio.Partida;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartidaServicio implements IPartidaServicio {

    private final IPartidaRepositorio partidaRepositorio;

    @Autowired
    public PartidaServicio (IPartidaRepositorio partidaRepositorio) {
        this.partidaRepositorio = partidaRepositorio;
    }

    @Override
    @Transactional
    public Partida buscarSiElJugadorTienePartidaPendiente(Integer idJugador) {
        return this.partidaRepositorio.buscarPartidaPorIdDelJugador(idJugador);
    }

    @Override
    @Transactional
    public void guardar(Partida partida) {
        this.partidaRepositorio.guardarPartida(partida);
    }

    @Override
    @Transactional
    public void borrarPartida(Partida partidaExistente) {
        this.partidaRepositorio.eliminarPartidaExistente(partidaExistente);
    }
}
