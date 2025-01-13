package com.tallerwebi.dominio.Jugador;

public interface IJugadorRepositorio {

    void guardarJugador(Jugador jugador);

    Jugador validarEmailJugador(Jugador jugador);

    Jugador validarUsuarioJugador(Jugador jugador);

    Jugador validarDniJugador(Jugador jugador);
}