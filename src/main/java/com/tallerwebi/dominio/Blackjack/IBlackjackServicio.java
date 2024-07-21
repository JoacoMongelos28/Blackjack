package com.tallerwebi.dominio.Blackjack;

import com.tallerwebi.dominio.Cartas.Carta;
import com.tallerwebi.dominio.Jugador.Jugador;

import java.util.List;

public interface IBlackjackServicio {
    List<Carta> obtenerElMazoDeCartas();

    void actualizarNuevoSaldo(Integer idJugador, Double saldo);
}
