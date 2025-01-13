package com.tallerwebi.dominio.Jugador;

public interface IJugadorServicio {
    void registrarJugador(Jugador jugador);

    Boolean validarEmailNuevoJugador(Jugador jugador);

    Boolean validarUsuarioNuevoJugador(Jugador jugador);

    Boolean validarDniNuevoJugador(Jugador jugador);
}