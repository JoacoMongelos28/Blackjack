package com.tallerwebi.dominio.Jugador;

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

    @Override
    @Transactional
    public Boolean validarEmailNuevoJugador(Jugador jugador) {
        Jugador jugadorExiste = jugadorRepositorio.validarEmailJugador(jugador);
        return jugadorExiste != null;
    }

    @Override
    @Transactional
    public Boolean validarUsuarioNuevoJugador(Jugador jugador) {
        Jugador jugadorExiste = jugadorRepositorio.validarUsuarioJugador(jugador);
        return jugadorExiste != null;
    }

    @Override
    @Transactional
    public Boolean validarDniNuevoJugador(Jugador jugador) {
        Jugador jugadorExiste = jugadorRepositorio.validarDniJugador(jugador);
        return jugadorExiste != null;
    }
}