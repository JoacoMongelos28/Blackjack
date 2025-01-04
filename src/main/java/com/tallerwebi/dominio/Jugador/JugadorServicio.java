package com.tallerwebi.dominio.Jugador;

import com.tallerwebi.dominio.Casino.ICasinoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JugadorServicio implements IJugadorServicio {

    private final IJugadorRepositorio jugadorRepositorio;

    @Autowired
    public JugadorServicio(IJugadorRepositorio jugadorRepositorio) {
        this.jugadorRepositorio = jugadorRepositorio;
    }

    @Override
    @Transactional
    public void registrarJugador(Jugador jugador) {
        jugador.setSaldo(10000.0);
        this.jugadorRepositorio.guardarJugador(jugador);
    }
}